/*
  Comportamento do site. Os dados (obras, contatos, tamanhos) ficam em assets/obras.js.
  Cada página tem <body data-pagina="..."> e aqui rodamos só o que ela precisa.
*/

// ---------- Utilidades ----------

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);

function imagem(id, tamanho = 800) {
  return `img/obras/${id}-${tamanho}.webp`;
}

function linkObra(obra) {
  return `obra.html?id=${encodeURIComponent(obra.id)}`;
}

// Cria um <img> responsivo para uma obra
function imgObra(obra, { sizes = "(max-width: 700px) 90vw, 30vw", lazy = true } = {}) {
  const img = document.createElement("img");
  img.src = imagem(obra.id, 800);
  img.srcset = `${imagem(obra.id, 800)} ${obra.largura}w, ${imagem(obra.id, 1600)} ${obra.largura * 2}w`;
  img.sizes = sizes;
  img.width = obra.largura;
  img.height = obra.altura;
  img.alt = obra.alt || obra.titulo;
  if (lazy) img.loading = "lazy";
  img.decoding = "async";
  return img;
}

// Link de pedido: WhatsApp se houver número, senão e-mail
function linkPedido(assunto, mensagem) {
  if (SITE.whatsapp) {
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
  }
  return `mailto:${SITE.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
}

function nomeSerie(obra) {
  return obra.serie && SERIES[obra.serie] ? SERIES[obra.serie].nome : "";
}

// ---------- Partes comuns a todas as páginas ----------

function iniciarMenu() {
  const botao = $(".menu-botao");
  const menu = $("#menu");
  if (!botao) return;

  botao.addEventListener("click", () => {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    botao.setAttribute("aria-expanded", String(!aberto));
    menu.classList.toggle("aberto", !aberto);
  });

  // Fecha o menu ao escolher um link (no celular)
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      botao.setAttribute("aria-expanded", "false");
      menu.classList.remove("aberto");
    })
  );
}

function preencherContatos() {
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  document.querySelectorAll("[data-email]").forEach((el) => {
    el.href = `mailto:${SITE.email}`;
    el.textContent = SITE.email;
  });

  const lista = $("#contato-links");
  if (lista) {
    const links = [];
    if (SITE.instagram) links.push(["Instagram", `https://instagram.com/${SITE.instagram}`]);
    if (SITE.whatsapp) links.push(["WhatsApp", `https://wa.me/${SITE.whatsapp}`]);
    lista.innerHTML = links
      .map(([nome, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${nome} ↗</a></li>`)
      .join("");
  }
}

// Elementos com a classe .revelar aparecem suavemente ao entrar na tela
function iniciarRevelar() {
  const elementos = document.querySelectorAll(".revelar");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visivel"));
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          observador.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -10% 0px" }
  );
  elementos.forEach((el) => observador.observe(el));
}

// ---------- Página inicial ----------

function paginaInicio() {
  // Obra de destaque no topo
  const destaque = OBRAS.find((o) => o.destaque) || OBRAS[0];
  const hero = $("#hero-obra");
  if (hero && destaque) {
    hero.href = linkObra(destaque);
    const img = $("img", hero);
    img.alt = destaque.alt || destaque.titulo;
    $(".legenda", hero).textContent = destaque.titulo;
  }

  // Galeria
  const galeria = $("#galeria");
  galeria.innerHTML = "";
  OBRAS.forEach((obra) => {
    const cartao = document.createElement("a");
    cartao.className = "cartao revelar";
    cartao.href = linkObra(obra);
    cartao.dataset.serie = obra.serie || "avulsas";

    const moldura = document.createElement("div");
    moldura.className = "moldura";
    moldura.appendChild(imgObra(obra));

    const legenda = document.createElement("div");
    legenda.className = "cartao-legenda";
    legenda.innerHTML = `<span class="cartao-titulo"></span><span class="cartao-serie"></span>`;
    $(".cartao-titulo", legenda).textContent = obra.titulo;
    $(".cartao-serie", legenda).textContent = nomeSerie(obra) || obra.ano;

    cartao.append(moldura, legenda);
    galeria.appendChild(cartao);
  });

  // Filtros
  const botoes = document.querySelectorAll(".filtro");
  botoes.forEach((botao) =>
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro;
      botoes.forEach((b) => {
        const ativo = b === botao;
        b.classList.toggle("ativo", ativo);
        b.setAttribute("aria-pressed", String(ativo));
      });
      galeria.querySelectorAll(".cartao").forEach((c) => {
        c.hidden = filtro !== "todas" && c.dataset.serie !== filtro;
      });
    })
  );
}

// ---------- Página de uma obra ----------

function paginaObra() {
  const id = new URLSearchParams(location.search).get("id");
  const indice = OBRAS.findIndex((o) => o.id === id);

  if (indice === -1) {
    document.querySelectorAll(".pagina-obra > :not(#nao-encontrada)").forEach((el) => (el.hidden = true));
    $("#nao-encontrada").hidden = false;
    document.title = `Obra não encontrada — ${SITE.nome}`;
    return;
  }

  const obra = OBRAS[indice];
  const serie = nomeSerie(obra);
  document.title = `${obra.titulo} — ${SITE.nome}`;
  $('meta[property="og:title"]').content = document.title;
  $('meta[name="description"]').content = obra.descricao || obra.alt;

  // Imagem
  const botaoImagem = $("#obra-imagem");
  const img = imgObra(obra, { sizes: "(max-width: 900px) 92vw, 60vw", lazy: false });
  img.fetchPriority = "high";
  botaoImagem.replaceChildren(img);
  botaoImagem.classList.toggle("horizontal", obra.largura > obra.altura);

  // Texto
  if (serie) {
    const linkSerie = $("#obra-serie");
    linkSerie.hidden = false;
    linkSerie.textContent = `Série ${serie}`;
    linkSerie.href = "./#obras";
  }
  $("#obra-titulo").textContent = obra.titulo;

  const ficha = [
    ["Técnica", obra.tecnica],
    ["Ano", obra.ano],
    ["Dimensões", obra.dimensoes],
    ["Série", serie],
    ["Print", obra.print ? SITE.tamanhosPrint.map((t) => t.nome).join(", ") : ""],
  ].filter(([, valor]) => valor);
  $("#obra-ficha").innerHTML = ficha.map(([rotulo]) => `<div><dt>${rotulo}</dt><dd></dd></div>`).join("");
  $("#obra-ficha").querySelectorAll("dd").forEach((dd, i) => (dd.textContent = ficha[i][1]));

  const descricao = $("#obra-descricao");
  if (obra.descricao) descricao.textContent = obra.descricao;
  else descricao.remove();

  // Ações
  const acoes = $("#obra-acoes");
  if (obra.print) {
    const pedir = document.createElement("a");
    pedir.className = "botao";
    pedir.href = `prints.html#print-${obra.id}`;
    pedir.textContent = "Encomendar print";
    acoes.appendChild(pedir);
  }
  const compartilhar = document.createElement("button");
  compartilhar.className = "botao botao-linha";
  compartilhar.textContent = "Compartilhar";
  compartilhar.addEventListener("click", async () => {
    const dados = { title: document.title, url: location.href };
    if (navigator.share) {
      try { await navigator.share(dados); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(location.href);
      compartilhar.textContent = "Link copiado ✓";
      setTimeout(() => (compartilhar.textContent = "Compartilhar"), 2000);
    }
  });
  acoes.appendChild(compartilhar);

  // Anterior / próxima
  const anterior = OBRAS[(indice - 1 + OBRAS.length) % OBRAS.length];
  const proxima = OBRAS[(indice + 1) % OBRAS.length];
  $("#obra-anterior").href = linkObra(anterior);
  $("#obra-anterior").innerHTML = `<span>← Anterior</span><strong></strong>`;
  $("#obra-anterior strong").textContent = anterior.titulo;
  $("#obra-proxima").href = linkObra(proxima);
  $("#obra-proxima").innerHTML = `<span>Próxima →</span><strong></strong>`;
  $("#obra-proxima strong").textContent = proxima.titulo;

  // Mais obras: primeiro as da mesma série, depois as outras
  const outras = OBRAS.filter((o) => o.id !== obra.id)
    .sort((a, b) => (b.serie === obra.serie && obra.serie ? 1 : 0) - (a.serie === obra.serie && obra.serie ? 1 : 0))
    .slice(0, 4);
  const tira = $("#mais-obras");
  outras.forEach((o) => {
    const a = document.createElement("a");
    a.className = "tira-item";
    a.href = linkObra(o);
    a.appendChild(imgObra(o, { sizes: "(max-width: 700px) 45vw, 22vw" }));
    const t = document.createElement("span");
    t.textContent = o.titulo;
    a.appendChild(t);
    tira.appendChild(a);
  });

  // Zoom em tela cheia
  const zoom = $("#zoom");
  const zoomImg = $("img", zoom);
  const abrir = () => {
    zoomImg.src = imagem(obra.id, 1600);
    zoomImg.alt = obra.alt || obra.titulo;
    zoom.hidden = false;
    document.body.style.overflow = "hidden";
    $(".zoom-fechar").focus();
  };
  const fechar = () => {
    zoom.hidden = true;
    document.body.style.overflow = "";
    botaoImagem.focus();
  };
  botaoImagem.addEventListener("click", abrir);
  zoom.addEventListener("click", fechar);

  document.addEventListener("keydown", (e) => {
    if (!zoom.hidden && e.key === "Escape") return fechar();
    if (!zoom.hidden) return;
    if (e.key === "ArrowLeft") location.href = linkObra(anterior);
    if (e.key === "ArrowRight") location.href = linkObra(proxima);
  });

  // Deslizar o dedo para trocar de obra (celular)
  let inicioX = null;
  botaoImagem.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  botaoImagem.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const diferenca = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(diferenca) > 60) location.href = linkObra(diferenca > 0 ? anterior : proxima);
    inicioX = null;
  });
}

// ---------- Página de prints ----------

function paginaPrints() {
  const lista = $("#prints");
  const obras = OBRAS.filter((o) => o.print);

  obras.forEach((obra) => {
    const cartao = document.createElement("article");
    cartao.className = "print revelar";
    cartao.id = `print-${obra.id}`;

    const link = document.createElement("a");
    link.className = "moldura";
    link.href = linkObra(obra);
    link.appendChild(imgObra(obra, { sizes: "(max-width: 700px) 90vw, 30vw" }));

    const corpo = document.createElement("div");
    corpo.className = "print-corpo";
    corpo.innerHTML = `
      <h2 class="print-titulo"></h2>
      <fieldset class="tamanhos">
        <legend>Tamanho</legend>
        ${SITE.tamanhosPrint
          .map(
            (t, i) => `
          <label>
            <input type="radio" name="tamanho-${obra.id}" value="${i}" ${i === 0 ? "checked" : ""}>
            <span><strong>${t.nome}</strong> ${t.medida}</span>
            <em>${t.preco}</em>
          </label>`
          )
          .join("")}
      </fieldset>
      <a class="botao botao-cheio" target="_blank" rel="noopener">Pedir este print</a>`;
    $(".print-titulo", corpo).textContent = obra.titulo;

    // Atualiza o link de pedido conforme o tamanho escolhido
    const botao = $(".botao", corpo);
    const atualizar = () => {
      const t = SITE.tamanhosPrint[Number($("input:checked", corpo).value)];
      const mensagem = `Olá! Tenho interesse no print de "${obra.titulo}" no tamanho ${t.nome} (${t.medida}). Pode me passar valores e prazo?`;
      botao.href = linkPedido(`Print — ${obra.titulo} (${t.nome})`, mensagem);
    };
    corpo.addEventListener("change", atualizar);
    atualizar();

    cartao.append(link, corpo);
    lista.appendChild(cartao);
  });

  $("#botao-encomenda").href = linkPedido(
    "Desenho sob encomenda",
    "Olá! Gostaria de um orçamento para um desenho sob encomenda. A ideia é: "
  );

  // Se veio de uma obra (prints.html#print-...), destaca o cartão
  if (location.hash) {
    const alvo = document.getElementById(location.hash.slice(1));
    if (alvo) {
      alvo.classList.add("selecionado", "visivel");
      alvo.scrollIntoView({ block: "center" });
    }
  }
}

// ---------- Início ----------

iniciarMenu();
preencherContatos();

const pagina = document.body.dataset.pagina;
if (pagina === "inicio") paginaInicio();
if (pagina === "obra") paginaObra();
if (pagina === "prints") paginaPrints();

iniciarRevelar();
