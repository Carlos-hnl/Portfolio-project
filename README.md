# Portfólio — Hnl

Site de portfólio feito só com HTML, CSS e JavaScript. Não tem build nem dependências para o site funcionar.

Online: https://carlos-hnl.github.io/Portfolio-project/

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | Início: destaque, galeria com filtros, sobre e contato |
| `obra.html?id=...` | Página de cada obra (gerada a partir de `assets/obras.js`) |
| `prints.html` | Prints à venda e desenhos sob encomenda |
| `404.html` | Página de "não encontrado" do GitHub Pages |

## Como editar

Quase tudo fica em **`assets/obras.js`**:

- **Contato:** `email`, `instagram` e `whatsapp` no bloco `SITE`. Com o WhatsApp preenchido, os botões de pedido abrem uma conversa já com a mensagem pronta. Sem ele, abrem um e-mail.
- **Tamanhos e preços dos prints:** `tamanhosPrint`.
- **Obras:** a lista `OBRAS`. Os campos `tecnica`, `ano`, `dimensoes` e `descricao` aparecem na página da obra quando estão preenchidos. Use `print: false` para tirar uma obra da página de prints e `destaque: true` para escolher a obra do topo da página inicial.

As cores e as fontes ficam no início de `assets/style.css`, em `:root`.

## Adicionar uma obra nova

1. Coloque a imagem original em `img/originais/` com um nome simples, sem espaços nem acentos. Exemplo: `minha-obra.jpg`.
2. Gere as versões leves (é preciso ter Python e Pillow instalados: `pip install pillow`):
   ```
   python tools/otimizar_imagens.py
   ```
3. Em `assets/obras.js`, copie um bloco da lista `OBRAS` e use `id: "minha-obra"`. Preencha `largura` e `altura` com o tamanho da versão `-800.webp`, que o script mostra na tela.
4. Opcional: adicione a obra em `sitemap.xml`.

## Rodar no computador

Basta abrir o `index.html` no navegador. Se você usa o VS Code, a extensão **Live Server** atualiza a página sozinha a cada vez que você salva.
