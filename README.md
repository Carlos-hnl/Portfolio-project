# Portfólio — Hnl

Site de portfólio feito só com HTML, CSS e JavaScript. Não precisa de servidor nem de banco de dados.

Online: https://carlos-hnl.github.io/Portfolio-project/

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | Início: destaque, galeria com filtros, resumo do Sobre e contato |
| `obra.html?id=...` | Página de cada obra: ficha técnica, compra do original e do print |
| `venda.html` | À venda: originais, telas e prints, com filtros |
| `esbocos.html` | Esboços e processo |
| `sobre.html` | Biografia, trajetória (exposições, formação, publicações) e perguntas frequentes |

Todo o conteúdo fica em **`assets/obras.js`**. As páginas são montadas a partir dele.

---

## Adicionar uma obra nova pelo navegador (sem instalar nada)

**1. Envie a imagem**
- No GitHub, abra a pasta `img/originais`.
- Clique em **Add file → Upload files** e arraste a imagem.
- Clique em **Commit changes**.

Uma automação gera sozinha as versões leves do site em um ou dois minutos. Dá para acompanhar na aba **Actions**.

> O nome do arquivo vira o **id** da obra: em minúsculas, sem acentos e com hífens no lugar de espaços.
> Exemplo: `Noite Branca.jpg` → id `noite-branca`.

**2. Cadastre a obra**
- Abra `assets/obras.js` e clique no lápis (✏️ **Edit**).
- Dentro de `const OBRAS = [ ... ]`, copie um bloco `{ ... },` e cole logo abaixo.
- Troque os dados:

```js
{
  id: "noite-branca",
  titulo: "Noite Branca",
  serie: "",
  ano: "2025",
  tecnica: "Óleo sobre tela",
  dimensoes: "60 × 80 cm",
  descricao: "Texto curto sobre a obra.",
  alt: "O que aparece na imagem, para quem usa leitor de tela.",
  venda: {
    original: { status: "disponivel", preco: "R$ 2.400", observacao: "Acompanha moldura." },
    prints: true,
  },
},
```

- Clique em **Commit changes**. O site atualiza em um ou dois minutos.

A obra aparece na galeria, ganha uma página própria e, se estiver à venda, entra em **À venda**.

### Campos de venda

| Campo | Valores |
|---|---|
| `status` | `"disponivel"`, `"reservado"`, `"vendido"` ou `""` (não está à venda) |
| `preco` | Texto livre, como `"R$ 1.200"`. Vazio aparece como "Sob consulta" |
| `prints` | `true` vende reproduções nos tamanhos definidos em `PRINTS`; `false` não vende |

Quando uma obra for vendida, basta trocar `status: "disponivel"` por `status: "vendido"`. Ela continua no portfólio e sai dos originais à venda.

### Telas, fotografias e outras técnicas

Funcionam da mesma forma. O que muda é o texto em `tecnica`, como `"Óleo sobre tela"` ou `"Fotografia, impressão em fine art"`.

### Preços e tamanhos dos prints

Ficam no bloco `PRINTS` no início de `assets/obras.js` e valem para todas as obras.

## Adicionar um esboço

1. Envie a imagem para `img/originais`, como no caso das obras.
2. Em `assets/obras.js`, dentro de `const ESBOCOS = [ ]`, adicione:

```js
{ id: "estudo-maos", titulo: "Estudo de mãos", ano: "2025", tecnica: "Lápis sobre papel", nota: "", obra: "inalcancavel" },
```

Com o campo `obra` preenchido, o esboço também aparece na página da obra relacionada.

## Editar a página Sobre

No bloco `SOBRE` de `assets/obras.js` ficam a biografia, a cidade, as listas de exposições, formação e publicações e as perguntas frequentes. Listas vazias não aparecem no site.

## Contato

Em `SITE`, no início de `assets/obras.js`: `email`, `instagram` e `whatsapp`. Com o WhatsApp preenchido, todos os botões de compra abrem uma conversa com a mensagem pronta. Sem ele, abrem um e-mail.

---

## Dicas

- **Errou alguma vírgula ou aspa?** Se a galeria sumir depois de uma edição, quase sempre é isso. Abra o commit no GitHub para ver o que mudou, ou desfaça a edição.
- **Proteção das imagens:** o que você envia para `img/originais` fica público no repositório. Envie arquivos com uns 2000 px no lado maior, que dão ótima qualidade na tela, e guarde os arquivos em alta resolução fora do GitHub.
- **Rodar no computador:** abra o `index.html` no navegador. Para gerar as imagens localmente: `pip install pillow` e `python tools/otimizar_imagens.py`.
