// Ano atual no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Visualizador: clicar numa obra abre em tela cheia
const obras = Array.from(document.querySelectorAll(".grade figure"));
const visualizador = document.querySelector(".visualizador");
const imagemGrande = visualizador.querySelector("img");
const legenda = visualizador.querySelector("figcaption");
let atual = 0;

function mostrar(indice) {
  atual = (indice + obras.length) % obras.length;
  const img = obras[atual].querySelector("img");
  imagemGrande.src = img.src;
  imagemGrande.alt = img.alt;
  legenda.textContent = img.alt;
  visualizador.hidden = false;
}

function fechar() {
  visualizador.hidden = true;
}

obras.forEach((obra, i) => obra.addEventListener("click", () => mostrar(i)));

visualizador.querySelector(".fechar").addEventListener("click", fechar);
visualizador.querySelector(".anterior").addEventListener("click", () => mostrar(atual - 1));
visualizador.querySelector(".proxima").addEventListener("click", () => mostrar(atual + 1));

// Clicar no fundo escuro também fecha
visualizador.addEventListener("click", (e) => {
  if (e.target === visualizador) fechar();
});

// Teclado: Esc fecha, setas navegam
document.addEventListener("keydown", (e) => {
  if (visualizador.hidden) return;
  if (e.key === "Escape") fechar();
  if (e.key === "ArrowLeft") mostrar(atual - 1);
  if (e.key === "ArrowRight") mostrar(atual + 1);
});
