<?php
// Recebe os formulários do site (proposta, Trabalhe na Zava, Sou modelo), confere o Cloudflare Turnstile
// e manda os dados por e-mail. Roda na hospedagem do agenciazava.com.br (PHP 7.4+).
//
// A chave secreta do Turnstile NÃO fica aqui nem no repositório. Ela vai num arquivo fora da pasta pública,
// um nível acima da raiz do site (ex.: /home/<usuario>/zava-config.php, ao lado de public_html):
//
//   <?php return ['turnstile_secret' => '0x...', 'para' => 'contato@agenciazava.com.br'];
//
// Sem esse arquivo (ou sem a chave), o formulário funciona sem o Turnstile, só com as outras travas.

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function responder(int $codigo, array $dados): void {
  http_response_code($codigo);
  echo json_encode($dados, JSON_UNESCAPED_UNICODE);
  exit;
}
// Para robôs, finge que deu certo: assim eles não aprendem a contornar.
function fingir_sucesso(): void { responder(200, ['success' => 'true']); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, ['success' => 'false', 'message' => 'Método não permitido']);

$config = [];
foreach ([dirname(__DIR__, 2) . '/zava-config.php', dirname(__DIR__, 3) . '/zava-config.php'] as $arq) {
  if (is_readable($arq)) { $config = (array) include $arq; break; }
}
$segredo = $config['turnstile_secret'] ?? getenv('TURNSTILE_SECRET') ?: '';
$para = $config['para'] ?? 'contato@agenciazava.com.br';

// Formulários aceitos. O assunto é definido aqui, nunca pelo visitante.
$formularios = [
  'proposta' => 'Novo pedido de proposta pelo site',
  'trabalhe' => 'Trabalhe na Zava: novo cadastro pelo site',
  'modelo' => 'Sou modelo: novo cadastro pelo site',
];

$bruto = file_get_contents('php://input', false, null, 0, 20000);
$dados = json_decode($bruto ?: '', true);
if (!is_array($dados)) responder(400, ['success' => 'false', 'message' => 'Dados inválidos']);

$form = $dados['_form'] ?? '';
if (!isset($formularios[$form])) responder(400, ['success' => 'false', 'message' => 'Formulário desconhecido']);

// 1. Campo escondido (só robô preenche) e envio rápido demais (menos de 3 s com a página aberta).
if (!empty($dados['_honey'])) fingir_sucesso();
if (isset($dados['_tempo']) && (int) $dados['_tempo'] < 3000) fingir_sucesso();

// 2. Limite por IP: no máximo 5 envios a cada 10 minutos.
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$marca = sys_get_temp_dir() . '/zava-form-' . md5($ip);
$agora = time();
$envios = array_filter(array_map('intval', @file($marca, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > $agora - 600);
if (count($envios) >= 5) responder(429, ['success' => 'false', 'message' => 'Muitos envios. Tente de novo em alguns minutos.']);

// 3. Cloudflare Turnstile, conferido aqui no servidor.
if ($segredo !== '') {
  $token = (string) ($dados['cf-turnstile-response'] ?? '');
  if ($token === '') responder(400, ['success' => 'false', 'message' => 'Verificação anti-spam ausente']);
  $ctx = stream_context_create(['http' => [
    'method' => 'POST',
    'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
    'content' => http_build_query(['secret' => $segredo, 'response' => $token, 'remoteip' => $ip]),
    'timeout' => 8,
  ]]);
  $resp = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
  $ok = $resp ? json_decode($resp, true) : null;
  if (empty($ok['success'])) responder(400, ['success' => 'false', 'message' => 'Verificação anti-spam falhou']);
}

// 4. Monta os campos: só os do visitante (sem os que começam com "_"), com tamanho limitado.
$campos = [];
foreach ($dados as $k => $v) {
  if (!is_string($k) || $k === '' || $k[0] === '_' || $k === 'cf-turnstile-response') continue;
  if (count($campos) >= 20) break;
  $campos[mb_substr($k, 0, 60)] = mb_substr(trim((string) $v), 0, 2000);
}
if (!$campos) responder(400, ['success' => 'false', 'message' => 'Formulário vazio']);

// 5. WhatsApp com número de verdade (10 a 13 dígitos) e termos típicos de spam.
if (isset($campos['WhatsApp'])) {
  $dig = preg_replace('/\D/', '', $campos['WhatsApp']);
  if (strlen($dig) < 10 || strlen($dig) > 13) responder(400, ['success' => 'false', 'message' => 'WhatsApp inválido']);
}
$texto = mb_strtolower(implode(' ', $campos));
foreach (['casino', 'cassino', 'crypto', 'bitcoin', 'viagra', 'porn', 'seo services', 'backlink', 'loan'] as $termo) {
  if (strpos($texto, $termo) !== false) fingir_sucesso();
}

// 6. Envia o e-mail.
$linhas = '';
foreach ($campos as $k => $v) {
  $linhas .= '<tr><th align="left" style="padding:8px 12px;background:#ffe9da;vertical-align:top">' . htmlspecialchars($k) . '</th>'
    . '<td style="padding:8px 12px">' . nl2br(htmlspecialchars($v)) . '</td></tr>';
}
$assunto = $formularios[$form];
$corpo = '<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222">'
  . '<h2 style="margin:0 0 16px">' . htmlspecialchars($assunto) . '</h2>'
  . '<table cellspacing="0" style="border-collapse:collapse;border:1px solid #eee">' . $linhas . '</table>'
  . '<p style="color:#888;font-size:12px">Enviado pelo site agenciazava.com.br em ' . date('d/m/Y H:i') . '</p></body></html>';
$cabecalhos = implode("\r\n", [
  'MIME-Version: 1.0',
  'Content-Type: text/html; charset=UTF-8',
  'From: Site Zava <no-reply@agenciazava.com.br>',
]);
$enviado = mail($para, '=?UTF-8?B?' . base64_encode($assunto) . '?=', $corpo, $cabecalhos);
if (!$enviado) responder(500, ['success' => 'false', 'message' => 'Não foi possível enviar o e-mail']);

$envios[] = $agora;
@file_put_contents($marca, implode("\n", $envios));
responder(200, ['success' => 'true']);
