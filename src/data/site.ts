export const site = {
  name: 'Agência Zava',
  tagline: 'Marketing 360°',
  description:
    'Agência de Marketing 360° em Limeira – SP. Redes sociais, tráfego pago, sites, identidade visual, produção de conteúdo e consultoria para fazer o seu negócio vender mais.',
  url: 'https://agenciazava.com.br',
  email: 'contato@agenciazava.com.br',
  phone: '(19) 97104-2877',
  whatsapp: 'https://wa.me/5519971042877',
  instagram: 'https://www.instagram.com/zavamkt/',
  address: {
    line1: 'Av. Campinas, 1755 – 2º Andar',
    line2: 'Cidade Jardim, Limeira – SP, 13480-290',
    maps: 'https://www.google.com/maps?q=Av.+Campinas,+1755+-+2%C2%BA+Andar+-+Cidade+Jardim,+Limeira+-+SP,+13480-290',
    embed:
      'https://maps.google.com/maps?q=Av.%20Campinas%2C%201755%20-%20Cidade%20Jardim%2C%20Limeira%20-%20SP%2C%2013480-290&t=m&z=16&output=embed&iwloc=near',
  },
  // Formulário atual do site (Typeform).
  typeformId: 'ZQHBL03f',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'A Zava', href: '/#sobre' },
  { label: 'Trabalhos', href: '/#cases' },
  { label: 'Contato', href: '/contato/' },
];

// "Trabalhe na Zava" e "Sou modelo" apontavam para "#" no site antigo.
// Por enquanto abrem um e-mail com o assunto certo. Troque pelo link definitivo quando existir.
export const careers = {
  colaborador: `mailto:${site.email}?subject=${encodeURIComponent('Quero trabalhar na Zava')}`,
  modelo: `mailto:${site.email}?subject=${encodeURIComponent('Sou modelo')}`,
};
