/*
  ============================================================
  DADOS DO SITE — é aqui que você edita quase tudo.
  ============================================================

  Para adicionar uma obra nova:
    1. Coloque a imagem em img/originais/ (ex.: minha-obra.jpg)
    2. Rode:  python tools/otimizar_imagens.py
    3. Copie um bloco { ... } da lista OBRAS abaixo e troque os dados.
       O "id" precisa ser igual ao nome do arquivo, sem extensão.

  Campos vazios ("") simplesmente não aparecem no site.
*/

const SITE = {
  nome: "Hnl",
  // Contato — troque pelos seus dados reais.
  email: "seuemail@exemplo.com",
  instagram: "seuusuario",          // só o usuário, sem @
  whatsapp: "",                     // só números com DDI e DDD, ex.: "5521999998888"

  // Tamanhos oferecidos como print (vale para todas as obras com print: true).
  tamanhosPrint: [
    { nome: "A4", medida: "21 × 29,7 cm", preco: "Sob consulta" },
    { nome: "A3", medida: "29,7 × 42 cm", preco: "Sob consulta" },
  ],
};

const SERIES = {
  contorcionismo: {
    nome: "Contorcionismo",
    texto: "Série de figuras que se dobram sobre si mesmas, com a cabeça substituída por um círculo de luz.",
  },
};

const OBRAS = [
  {
    id: "livro-fechado",
    titulo: "Livro Fechado",
    serie: "",
    tecnica: "",            // ex.: "Grafite sobre papel"
    ano: "",
    dimensoes: "",          // ex.: "30 × 42 cm"
    descricao: "",
    alt: "Homem de terno sem cabeça, com a lua no lugar do rosto, caminhando por uma rua de pedra à noite com um livro sob o braço, enquanto dois cães latem.",
    largura: 640, altura: 800,
    destaque: true,
    print: true,
  },
  {
    id: "inalcancavel",
    titulo: "Inalcançável",
    serie: "",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Uma mão gigante segura um círculo luminoso acima de um pé enorme, por onde pequenas figuras humanas tentam escalar.",
    largura: 640, altura: 800,
    print: true,
  },
  {
    id: "desespero",
    titulo: "Desespero",
    serie: "",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Rosto deformado com a boca aberta num grito cheio de dentes, apertado por mãos que cobrem a cabeça.",
    largura: 640, altura: 800,
    print: true,
  },
  {
    id: "jardim",
    titulo: "Jardim",
    serie: "",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura de gorro pontudo, como um gnomo, escondida entre cogumelos gigantes e mato escuro.",
    largura: 640, altura: 800,
    print: true,
  },
  {
    id: "rastro",
    titulo: "Rastro",
    serie: "",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Pequena figura caminhando sobre a borda de uma folha enorme, sob uma lua cheia.",
    largura: 640, altura: 800,
    print: true,
  },
  {
    id: "sem-titulo",
    titulo: "Sem título",
    serie: "",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura de paletó cuja cabeça é um livro aberto com um olho desenhado nas páginas.",
    largura: 800, altura: 800,
    print: true,
  },
  {
    id: "contorcionismo-1",
    titulo: "Contorcionismo I",
    serie: "contorcionismo",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura magra curvada para a frente, apoiada nos pés e nas mãos, com a cabeça dentro de um círculo branco.",
    largura: 800, altura: 561,
    print: true,
  },
  {
    id: "contorcionismo-2",
    titulo: "Contorcionismo II",
    serie: "contorcionismo",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura agachada abraçando os joelhos, com a cabeça dentro de um círculo branco.",
    largura: 800, altura: 561,
    print: true,
  },
  {
    id: "contorcionismo-3",
    titulo: "Contorcionismo III",
    serie: "contorcionismo",
    tecnica: "",
    ano: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura em ponte, com o rosto de cabeça para baixo dentro de um círculo branco entre as pernas.",
    largura: 800, altura: 561,
    print: true,
  },
];
