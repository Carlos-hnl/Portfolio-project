function scrollCarrossel(button, direction) {
    const container = button.closest('.carrossel-container');
    const slider = container.querySelector('.carrossel');
    const scrollAmount = 300 * direction;
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".carrossel-container");

  containers.forEach(container => {
    const fadeLeft = document.createElement("div");
    fadeLeft.classList.add("fade", "fade-left");

    const fadeRight = document.createElement("div");
    fadeRight.classList.add("fade", "fade-right");

    container.appendChild(fadeLeft);
    container.appendChild(fadeRight);
  });
});

function iniciarCarrosselAutomatico(carrossel) {
  const imagens = carrossel.querySelectorAll("img");
  const totalImagens = imagens.length;
  let index = 0;

  setInterval(() => {
    index = (index + 1) % totalImagens;
    const imagem = imagens[index];
    carrossel.scrollTo({
      left: imagem.offsetLeft,
      behavior: 'smooth'
    });
  }, 3000); // muda a imagem a cada 3 segundos
}

// Inicia todos os carrosseis da página
document.addEventListener("DOMContentLoaded", () => {
  const todosCarrosseis = document.querySelectorAll(".carrossel");
  todosCarrosseis.forEach(carrossel => iniciarCarrosselAutomatico(carrossel));
});

function destacarImagemCentral(carrossel) {
  const imagens = carrossel.querySelectorAll("img");
  const centro = carrossel.scrollLeft + carrossel.offsetWidth / 2;

  let imagemMaisPerto = null;
  let menorDistancia = Infinity;

  imagens.forEach(img => {
    const centroImagem = img.offsetLeft + img.offsetWidth / 2;
    const distancia = Math.abs(centro - centroImagem);

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      imagemMaisPerto = img;
    }
  });

  imagens.forEach(img => img.classList.remove("destacada"));
  if (imagemMaisPerto) imagemMaisPerto.classList.add("destacada");
}

function iniciarCarrosselAutomatico(carrossel) {
  const imagens = carrossel.querySelectorAll("img");
  let index = 0;

  setInterval(() => {
    index++;

    // se passar do final, volta para o início
    if (index >= imagens.length) {
      index = 0;
    }

    const imagemAlvo = imagens[index];
    carrossel.scrollTo({
      left: imagemAlvo.offsetLeft,
      behavior: 'smooth'
    });

    setTimeout(() => destacarImagemCentral(carrossel), 500);
  }, 3000); // muda a cada 3 segundos

  carrossel.addEventListener("scroll", () => {
    setTimeout(() => destacarImagemCentral(carrossel), 100);
  });

  destacarImagemCentral(carrossel);
}

document.addEventListener("DOMContentLoaded", () => {
  const todosCarrosseis = document.querySelectorAll(".carrossel");
  todosCarrosseis.forEach(carrossel => iniciarCarrosselAutomatico(carrossel));
});

function clonarExtremos(carrossel) {
  const imagens = carrossel.querySelectorAll("img");
  const quantidade = 2; // Número de clones em cada ponta

  // Clones à esquerda
  for (let i = imagens.length - quantidade; i < imagens.length; i++) {
    const clone = imagens[i].cloneNode(true);
    clone.classList.add("clone");
    carrossel.prepend(clone);
  }

  // Clones à direita
  for (let i = 0; i < quantidade; i++) {
    const clone = imagens[i].cloneNode(true);
    clone.classList.add("clone");
    carrossel.appendChild(clone);
  }
}

function destacarImagemCentral(carrossel) {
  const imagens = carrossel.querySelectorAll("img");
  const centro = carrossel.scrollLeft + carrossel.offsetWidth / 2;

  let maisProxima = null;
  let menorDistancia = Infinity;

  imagens.forEach(img => {
    const centroImg = img.offsetLeft + img.offsetWidth / 2;
    const distancia = Math.abs(centro - centroImg);
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      maisProxima = img;
    }
  });

  imagens.forEach(img => img.classList.remove("destacada"));
  if (maisProxima) maisProxima.classList.add("destacada");
}

function iniciarLoop(carrossel) {
  const imagensReais = carrossel.querySelectorAll("img:not(.clone)");
  let index = 0;

  const mover = () => {
    index++;
    const imagens = carrossel.querySelectorAll("img");
    const alvo = imagens[index];

    carrossel.scrollTo({
      left: alvo.offsetLeft,
      behavior: 'smooth'
    });

    destacarImagemCentral(carrossel);

    if (index >= imagens.length - 3) { // ajusta baseado nos clones
      setTimeout(() => {
        carrossel.scrollLeft = imagensReais[0].offsetLeft;
        index = 0;
        destacarImagemCentral(carrossel);
      }, 600); // espera a rolagem suave terminar
    }
  };

  setInterval(mover, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carrossel").forEach(carrossel => {
    clonarExtremos(carrossel);
    ajustarScrollInicial(carrossel);
    destacarImagemCentral(carrossel);
    iniciarLoop(carrossel);

    carrossel.addEventListener("scroll", () => {
      setTimeout(() => destacarImagemCentral(carrossel), 100);
    });
  });
});