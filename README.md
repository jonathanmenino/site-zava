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
| Fotos de banco (Unsplash) e créditos | `src/assets/stock/` e `src/assets/stock/CREDITOS.md` |
| Cores e fontes | `src/styles/global.css` (bloco `@theme`) |
| Termos e privacidade | `src/pages/*.md` |

Para criar um serviço ou case novo, copie um arquivo `.md` da pasta, troque o nome do arquivo (ele vira a URL) e edite os campos.

## Identidade visual

Tirada do site atual: laranja `#FF6800`, roxo `#6B01D0`, pêssego `#FFE9DA`, texto `#222222`; títulos em **Syne**, texto em **Poppins** (fontes servidas pelo próprio site via Fontsource).

## Pendências de conteúdo

- **Rascunhos (`draft: true`)**: um serviço com essa linha aparece no `npm run dev`, mas não entra no site publicado. Os 6 serviços atuais já foram revisados e estão publicados.
- **Termos e Política de Privacidade**: também eram texto de template. Os novos são rascunhos e precisam de revisão.
- **Depoimentos**: o depoimento "Numerique" do site antigo era falso (template). Ele está em `src/content/depoimentos/exemplo-template.md` com `placeholder: true` e não aparece no site. A seção de depoimentos só aparece quando houver um depoimento real.
- **"Trabalhe na Zava" e "Sou modelo"**: apontavam para `#`. Por enquanto abrem um e-mail com assunto pronto.

## URLs antigas

`/home/` → `/`, `/jdemilia/` → `/trabalhos/jardim-emilia/` e `/free-audit/` → `/contato/` (em `astro.config.mjs`). As URLs de serviços, contato e páginas legais continuam iguais.
