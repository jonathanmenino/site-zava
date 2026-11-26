export const site = {
  name: 'Agência Zava',
  tagline: 'Marketing 360°',
  description:
    'Agência de Marketing 360° em Limeira – SP. Redes sociais, tráfego pago, sites, identidade visual, produção de conteúdo e consultoria para fazer o seu negócio vender mais.',
  url: 'https://agenciazava.com.br',
  email: 'contato@agenciazava.com.br',
  phone: '(19) 98161-9842',
  phoneIntl: '+55 19 98161-9842',
  hours: 'Segunda a sexta, das 8h às 17h',
  // Abre o WhatsApp com uma mensagem pronta.
  whatsapp: `https://wa.me/5519981619842?text=${encodeURIComponent('Olá! Vim pelo site da Zava e quero uma proposta.')}`,
  instagram: 'https://www.instagram.com/zavamkt/',
  instagramHandle: '@zavamkt',
  address: {
    line1: 'Av. Campinas, 1755',
    line2: 'Cidade Jardim, Limeira – SP, 13480-290',
    maps: 'https://www.google.com/maps?q=Av.+Campinas,+1755+-+Cidade+Jardim,+Limeira+-+SP,+13480-290',
    embed:
      'https://maps.google.com/maps?q=Av.%20Campinas%2C%201755%20-%20Cidade%20Jardim%2C%20Limeira%20-%20SP%2C%2013480-290&t=m&z=16&output=embed&iwloc=near',
  },
  // Para onde os formulários enviam. No site oficial é o script PHP da própria hospedagem (public/api/formulario.php),
  // que confere o Turnstile e manda o e-mail. A prévia no GitHub Pages não roda PHP e define PUBLIC_FORM_ENDPOINT
  // com o FormSubmit (ver .github/workflows/pages.yml).
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || '/api/formulario.php',
  // Chave PÚBLICA do Cloudflare Turnstile, liberada só para agenciazava.com.br (a secreta fica no servidor,
  // em zava-config.php, fora do repositório). A prévia usa o FormSubmit, que não confere o Turnstile: lá ele fica desligado.
  turnstileSiteKey: import.meta.env.PUBLIC_FORM_ENDPOINT ? '' : import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAGUs4TPvbNxtOAUy',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Serviços', href: '/servicos/' },
  { label: 'A Zava', href: '/#sobre' },
  { label: 'Cases', href: '/cases/' },
  { label: 'Contato', href: '/contato/' },
];

// Páginas com os formulários de "Trabalhe na Zava" e "Sou modelo".
export const careers = {
  colaborador: '/trabalhe-na-zava/',
  modelo: '/sou-modelo/',
};
