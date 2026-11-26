/*
  ================================================================
  DADOS DO SITE: é aqui que você edita o conteúdo.
  O passo a passo para adicionar obras está no README.md.
  ================================================================

  Regras simples:
  - Texto sempre entre aspas: "assim".
  - Cada item termina com vírgula.
  - Campo vazio ("") não aparece no site.
*/

// ---------------- Contato e informações gerais ----------------
const SITE = {
  nome: "Hnl",
  email: "seuemail@exemplo.com",    // troque pelo seu
  instagram: "seuusuario",          // só o usuário, sem @
  whatsapp: "",                     // só números com DDI e DDD, ex.: "5521999998888"
};

// ---------------- Prints (reproduções) ----------------
// Valem para todas as obras que tiverem  prints: true  em "venda".
const PRINTS = {
  papel: "Papel de algodão, impressão fine art",
  observacao: "Assinados à mão.",
  tamanhos: [
    { nome: "A4", medida: "21 × 29,7 cm", preco: "Sob consulta" },
    { nome: "A3", medida: "29,7 × 42 cm", preco: "Sob consulta" },
  ],
};

// ---------------- Séries ----------------
const SERIES = {
  contorcionismo: {
    nome: "Contorcionismo",
    texto: "Figuras que se dobram sobre si mesmas, com a cabeça substituída por um círculo de luz.",
  },
};

/* ---------------- Obras ----------------

  Modelo para copiar (apague os campos que não usar):

  {
    id: "nome-do-arquivo",          // nome da imagem em img/originais, sem extensão
    titulo: "Título da obra",
    serie: "",                      // id de uma série acima, ou ""
    ano: "2025",
    tecnica: "Grafite sobre papel", // ex.: "Óleo sobre tela", "Fotografia digital"
    dimensoes: "30 × 42 cm",
    descricao: "Texto curto sobre a obra.",
    alt: "Descrição do que aparece na imagem (para leitores de tela e Google).",
    destaque: false,                // true = aparece no topo da página inicial
    venda: {
      original: {
        status: "disponivel",       // "disponivel", "reservado", "vendido" ou "" (não está à venda)
        preco: "R$ 1.200",          // ou "" para "Sob consulta"
        observacao: "Acompanha moldura.",
      },
      prints: true,                 // true = vende reproduções nos tamanhos de PRINTS
    },
  },
*/

const OBRAS = [
  {
    id: "livro-fechado",
    titulo: "Livro Fechado",
    serie: "",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Homem de terno sem cabeça, com a lua no lugar do rosto, caminhando por uma rua de pedra à noite com um livro sob o braço, enquanto dois cães latem.",
    destaque: true,
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "inalcancavel",
    titulo: "Inalcançável",
    serie: "",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Uma mão gigante segura um círculo luminoso acima de um pé enorme, por onde pequenas figuras humanas tentam escalar.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "desespero",
    titulo: "Desespero",
    serie: "",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Rosto deformado com a boca aberta num grito cheio de dentes, apertado por mãos que cobrem a cabeça.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "jardim",
    titulo: "Jardim",
    serie: "",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura de gorro pontudo, como um gnomo, escondida entre cogumelos gigantes e mato escuro.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "rastro",
    titulo: "Rastro",
    serie: "",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Pequena figura caminhando sobre a borda de uma folha enorme, sob uma lua cheia.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "sem-titulo",
    titulo: "Sem título",
    serie: "",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura de paletó cuja cabeça é um livro aberto com um olho desenhado nas páginas.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "contorcionismo-1",
    titulo: "Contorcionismo I",
    serie: "contorcionismo",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura magra curvada para a frente, apoiada nos pés e nas mãos, com a cabeça dentro de um círculo branco.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "contorcionismo-2",
    titulo: "Contorcionismo II",
    serie: "contorcionismo",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura agachada abraçando os joelhos, com a cabeça dentro de um círculo branco.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
  {
    id: "contorcionismo-3",
    titulo: "Contorcionismo III",
    serie: "contorcionismo",
    ano: "",
    tecnica: "",
    dimensoes: "",
    descricao: "",
    alt: "Figura em ponte, com o rosto de cabeça para baixo dentro de um círculo branco entre as pernas.",
    venda: { original: { status: "disponivel", preco: "" }, prints: true },
  },
];

/* ---------------- Esboços ----------------

  Estudos, rascunhos e processo. As imagens também vão em img/originais.

  Modelo para copiar:
  {
    id: "estudo-maos",              // nome da imagem, sem extensão
    titulo: "Estudo de mãos",
    ano: "2025",
    tecnica: "Lápis sobre papel",
    nota: "Primeiro estudo para Inalcançável.",
    obra: "inalcancavel",           // id da obra relacionada, ou ""
  },
*/

const ESBOCOS = [
];

// ---------------- Página Sobre ----------------
const SOBRE = {
  foto: "artista",                  // id da imagem do retrato
  titulo: "Um traço para cada inquietação.",
  bio: [
    "Sou um artista visual que explora emoções humanas por meio do grafite, do lápis e da fotografia. Cada obra é um fragmento de sentimentos, inquietações e experiências que ganham forma em traços, sombras e luz.",
    "Meu trabalho transita entre o figurativo e o abstrato, buscando provocar reflexão e despertar sensações em quem observa.",
  ],
  local: "",                        // ex.: "Vive e trabalha em Niterói, RJ"

  // Listas do currículo. Seções vazias não aparecem.
  // Modelo: { ano: "2025", texto: "Nome da exposição — Galeria, Cidade" },
  exposicoes: [
  ],
  formacao: [
  ],
  publicacoes: [
  ],

  // Perguntas frequentes. Revise as respostas para que reflitam como você trabalha.
  faq: [
    {
      pergunta: "Como faço para comprar uma obra?",
      resposta: "Abra a obra e use o botão de interesse. A mensagem já vai pronta; a partir dela combinamos valor final, pagamento e entrega.",
    },
    {
      pergunta: "Qual a diferença entre o original e o print?",
      resposta: "O original é a peça única, feita à mão. O print é uma reprodução de alta qualidade, impressa sob demanda e assinada.",
    },
    {
      pergunta: "Você envia para outras cidades?",
      resposta: "Sim. A forma de envio e o frete são combinados de acordo com o seu endereço.",
    },
    {
      pergunta: "Aceita encomendas?",
      resposta: "Sim: retratos, ilustrações e peças a partir de uma ideia ou fotografia. Entre em contato contando o que você imagina.",
    },
    {
      pergunta: "Posso usar as imagens do site?",
      resposta: "As obras são protegidas por direitos autorais. Para qualquer uso, inclusive em redes sociais com fins comerciais, entre em contato antes.",
    },
  ],
};
