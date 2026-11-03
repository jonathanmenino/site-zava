# Site Agência Zava

Novo site da [Agência Zava](https://agenciazava.com.br), refeito do WordPress/Elementor para **Astro + Tailwind CSS**. O site é 100% estático.

## Rodando

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera o site em dist/
npm run preview  # serve o dist/ localmente
```

## Onde fica cada coisa

| O que | Onde |
| --- | --- |
| Contatos, endereço, menu, links "Trabalhe na Zava" / "Sou modelo" | `src/data/site.ts` |
| Serviços (uma página gerada por arquivo) | `src/content/servicos/*.md` |
| Cases | `src/content/trabalhos/*.md` |
| Depoimentos | `src/content/depoimentos/*.md` |
| Logos de clientes (basta soltar um PNG) | `src/assets/clients/` |
| Cores e fontes | `src/styles/global.css` (bloco `@theme`) |
| Termos e privacidade | `src/pages/*.md` |

Para criar um serviço ou case novo, copie um arquivo `.md` da pasta, troque o nome do arquivo (ele vira a URL) e edite os campos.

## Identidade visual

Tirada do site atual: laranja `#FF6800`, roxo `#6B01D0`, pêssego `#FFE9DA`, texto `#222222`; títulos em **Syne**, texto em **Poppins** (fontes servidas pelo próprio site via Fontsource).

## Pendências de conteúdo

- **Serviços marcados com `draft: true`**: tráfego pago, sites, identidade visual, foto e produção e consultoria estavam com o texto em inglês do template no site antigo. O texto atual é um rascunho em português a partir dos resumos da home.
- **Termos e Política de Privacidade**: também eram texto de template. Os novos são rascunhos e precisam de revisão.
- **Depoimentos**: o depoimento "Numerique" do site antigo era falso (template). Ele está em `src/content/depoimentos/exemplo-template.md` com `placeholder: true` e não aparece no site. A seção de depoimentos só aparece quando houver um depoimento real.
- **"Trabalhe na Zava" e "Sou modelo"**: apontavam para `#`. Por enquanto abrem um e-mail com assunto pronto.

## URLs antigas

`/home/` → `/`, `/jdemilia/` → `/trabalhos/jardim-emilia/` e `/free-audit/` → `/contato/` (em `astro.config.mjs`). As URLs de serviços, contato e páginas legais continuam iguais.
