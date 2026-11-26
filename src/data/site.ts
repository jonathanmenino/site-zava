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
  // Os formulários do site enviam para o e-mail acima pelo FormSubmit (formsubmit.co), sem servidor próprio.
  // No primeiro envio o FormSubmit manda um e-mail de ativação para esse endereço: é só confirmar uma vez.
  // Depois da ativação, dá para trocar o e-mail aqui pelo código aleatório que o FormSubmit fornece.
  formEndpoint: 'https://formsubmit.co/ajax/contato@agenciazava.com.br',
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
