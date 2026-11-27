/*
  Comportamento do site.
  - O conteúdo (obras, preços, esboços, textos) fica em assets/obras.js.
  - O tamanho das imagens fica em assets/imagens.js (gerado automaticamente).
  Cada página tem <body data-pagina="..."> e aqui rodamos só o que ela precisa.
*/

// =============== Utilidades ===============

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

// Protege textos vindos dos dados antes de colocá-los no HTML
function esc(texto = "") {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const ESTA_PAGINA = document.body.dataset.pagina;

function caminhoImagem(id, tamanho = 800) {
  return `img/obras/${id}-${tamanho}.webp`;
}

function medidas(id) {
  return (typeof IMAGENS !== "undefined" && IMAGENS[id]) || [800, 800];
}

// <img> responsivo: miniatura de 800px e versão de 1600px para telas grandes
function imgHTML(id, alt, { sizes = "(max-width: 700px) 90vw, 30vw", lazy = true, classe = "" } = {}) {
  const [l, a] = medidas(id);
  return `<img src="${caminhoImagem(id)}"
    srcset="${caminhoImagem(id)} ${l}w, ${caminhoImagem(id, 1600)} ${l * 2}w"
    sizes="${sizes}" width="${l}" height="${a}" alt="${esc(alt)}"
    ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" ${classe ? `class="${classe}"` : ""}>`;
}

const linkObra = (obra) => `obra.html?id=${encodeURIComponent(obra.id)}`;
const obraPorId = (id) => OBRAS.find((o) => o.id === id);
const nomeSerie = (obra) => (obra.serie && SERIES[obra.serie] ? SERIES[obra.serie].nome : "");

// Link de pedido: WhatsApp se houver número, senão e-mail
function linkPedido(assunto, mensagem) {
  if (SITE.whatsapp) return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
}

// =============== Regras de venda ===============

const STATUS = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };

const original = (obra) => (obra.venda && obra.venda.original) || {};
const statusOriginal = (obra) => original(obra).status || "";
const originalAVenda = (obra) => ["disponivel", "reservado"].includes(statusOriginal(obra));
const temPrint = (obra) => Boolean(obra.venda && obra.venda.prints);
const precoOriginal = (obra) => original(obra).preco || "Sob consulta";

function precoPrintInicial() {
  const primeiro = PRINTS.tamanhos[0];
  if (!primeiro) return "";
  return /\d/.test(primeiro.preco) ? `a partir de ${primeiro.preco}` : primeiro.preco;
}

// =============== Partes comuns ===============

function montarTopo() {
  const links = [
    ["Obras", "./#obras", "inicio-obras"],
    ["À venda", "venda.html", "venda"],
    ["Esboços", "esbocos.html", "esbocos"],
    ["Sobre", "sobre.html", "sobre"],
    ["Contato", ESTA_PAGINA === "sobre" ? "#contato" : "./#contato", "contato"],
  ];
  $(".topo").innerHTML = `
    <a class="marca" href="./" aria-label="${esc(SITE.nome)}, início">
      <img src="img/logo-192.png" alt="" width="44" height="44">
      <span class="marca-nome">${esc(SITE.nome)}</span>
    </a>
    <button class="menu-botao" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav id="menu" class="menu">
      ${links
        .map(([nome, href, chave]) => `<a href="${href}"${chave === ESTA_PAGINA ? ' aria-current="page"' : ""}>${nome}</a>`)
        .join("")}
    </nav>`;

  const botao = $(".menu-botao");
  const menu = $("#menu");
  const fechar = () => {
    botao.setAttribute("aria-expanded", "false");
    menu.classList.remove("aberto");
  };
  botao.addEventListener("click", () => {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    botao.setAttribute("aria-expanded", String(!aberto));
    menu.classList.toggle("aberto", !aberto);
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", fechar));
  document.addEventListener("keydown", (e) => e.key === "Escape" && fechar());
}

function montarRodape() {
  $(".rodape").innerHTML = `
    <span>© ${new Date().getFullYear()} ${esc(SITE.nome)}. Todas as obras protegidas por direitos autorais.</span>
    <a href="#conteudo">Voltar ao topo ↑</a>`;
}

function preencherContatos() {
  $$("[data-nome]").forEach((el) => (el.textContent = SITE.nome));
  $$("[data-descricao]").forEach((el) => (el.textContent = SITE.descricao || ""));

  $$("[data-email]").forEach((el) => {
    el.href = `mailto:${SITE.email}`;
    el.textContent = SITE.email;
  });

  const redes = [];
  if (SITE.instagram) redes.push(["Instagram", `https://instagram.com/${SITE.instagram}`]);
  if (SITE.whatsapp) redes.push(["WhatsApp", `https://wa.me/${SITE.whatsapp}`]);
  $$("[data-redes]").forEach((ul) => {
    ul.innerHTML = redes
      .map(([nome, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${nome} ↗</a></li>`)
      .join("");
  });

  $$("[data-papel]").forEach((el) => (el.textContent = PRINTS.papel.toLowerCase()));
  $$("[data-observacao]").forEach((el) => (el.textContent = PRINTS.observacao.toLowerCase()));
}

// Elementos com a classe .revelar aparecem suavemente ao entrar na tela
function iniciarRevelar() {
  const elementos = $$(".revelar");
  if (!("IntersectionObserver" in window)) return elementos.forEach((el) => el.classList.add("visivel"));
  const observador = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          observador.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  elementos.forEach((el) => observador.observe(el));
}

// Visualizador em tela cheia (obra e esboços)
function iniciarZoom() {
  const zoom = $("#zoom");
  if (!zoom) return () => {};
  const img = $("img", zoom);
  const legenda = $(".zoom-legenda", zoom);
  let origem = null;

  const fechar = () => {
    zoom.hidden = true;
    document.body.style.overflow = "";
    if (origem) origem.focus();
  };
  zoom.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") fechar();
  });
  document.addEventListener("keydown", (e) => {
    if (!zoom.hidden && e.key === "Escape") fechar();
  });

  return function abrir(id, alt, legendaHTML = "", botaoOrigem = null) {
    origem = botaoOrigem;
    img.src = caminhoImagem(id, 1600);
    img.alt = alt;
    legenda.innerHTML = legendaHTML;
    zoom.hidden = false;
    document.body.style.overflow = "hidden";
    $(".zoom-fechar", zoom).focus();
  };
}

function iniciarFiltros(container, itens, atributo, aoFiltrar = () => {}) {
  const botoes = $$(".filtro", container);
  botoes.forEach((botao) =>
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro;
      botoes.forEach((b) => {
        b.classList.toggle("ativo", b === botao);
        b.setAttribute("aria-pressed", String(b === botao));
      });
      itens().forEach((item) => {
        const valores = item.dataset[atributo].split(" ");
        item.hidden = !["todas", "todos"].includes(filtro) && !valores.includes(filtro);
        if (!item.hidden) item.classList.add("visivel");
      });
      aoFiltrar();
    })
  );
}

// =============== Página inicial ===============

function paginaInicio() {
  const destaque = OBRAS.find((o) => o.destaque) || OBRAS[0];
  const hero = $("#hero-obra");
  if (destaque) {
    hero.href = linkObra(destaque);
    hero.innerHTML = `${imgHTML(destaque.id, destaque.alt || destaque.titulo, { sizes: "(max-width: 800px) 90vw, 40vw", lazy: false })}
      <span class="legenda">${esc(destaque.titulo)}</span>`;
  }

  // Filtros: Todas, Desenhos (obras sem série nem categoria), uma por categoria e uma por série
  const series = [...new Set(OBRAS.map((o) => o.serie).filter(Boolean))];
  const categorias = [...new Set(OBRAS.map((o) => o.categoria).filter(Boolean))];
  const temDesenhos = OBRAS.some((o) => !o.serie && !o.categoria);
  const filtros = [["todas", "Todas"]];
  if (temDesenhos && (series.length || categorias.length)) filtros.push(["desenhos", "Desenhos"]);
  categorias.forEach((c) => filtros.push([c, CATEGORIAS[c] || c]));
  series.forEach((s) => filtros.push([s, `Série ${SERIES[s] ? SERIES[s].nome : s}`]));
  const grupos = (o) => [o.serie, o.categoria, !o.serie && !o.categoria && "desenhos"].filter(Boolean).join(" ");
  $("#filtros").innerHTML = filtros.length > 1
    ? filtros
        .map(([valor, nome], i) => `<button class="filtro${i ? "" : " ativo"}" data-filtro="${valor}" aria-pressed="${!i}">${esc(nome)}</button>`)
        .join("")
    : "";

  $("#galeria").innerHTML = OBRAS.map(
    (obra) => `
    <a class="cartao revelar" href="${linkObra(obra)}" data-grupos="${grupos(obra)}">
      <div class="moldura">
        ${imgHTML(obra.id, obra.alt || obra.titulo)}
        ${originalAVenda(obra) ? `<span class="selo">${statusOriginal(obra) === "reservado" ? "Reservado" : "À venda"}</span>` : ""}
      </div>
      <div class="cartao-legenda">
        <span class="cartao-titulo">${esc(obra.titulo)}</span>
        <span class="cartao-serie">${esc(nomeSerie(obra) || (obra.categoria && CATEGORIAS[obra.categoria] ? CATEGORIAS[obra.categoria].replace(/s$/, "") : "") || obra.ano)}</span>
      </div>
    </a>`
  ).join("");

  iniciarFiltros($("#filtros"), () => $$("#galeria .cartao"), "grupos");

  // Resumo do "Sobre"
  $("#sobre-titulo").textContent = SOBRE.titulo;
  $("#sobre-resumo").textContent = SOBRE.bio[0] || "";
  const [l, a] = medidas(SOBRE.foto);
  Object.assign($("#sobre-foto"), { src: caminhoImagem(SOBRE.foto), width: l, height: a });
}

// =============== Página de uma obra ===============

function blocoVenda(obra) {
  const partes = [];
  const status = statusOriginal(obra);

  if (status) {
    const orig = original(obra);
    let acao;
    if (status === "disponivel") {
      const msg = `Olá! Tenho interesse no original de "${obra.titulo}". Pode me passar mais detalhes?`;
      acao = `<a class="botao botao-cheio" href="${linkPedido(`Original: ${obra.titulo}`, msg)}" target="_blank" rel="noopener">Tenho interesse no original</a>`;
    } else if (status === "reservado") {
      const msg = `Olá! Vi que o original de "${obra.titulo}" está reservado. Pode me avisar se ele voltar a ficar disponível?`;
      acao = `<a class="botao botao-linha botao-cheio" href="${linkPedido(`Original: ${obra.titulo}`, msg)}" target="_blank" rel="noopener">Avise-me se ficar disponível</a>`;
    } else {
      acao = `<p class="nota">Esta peça já encontrou um lar.${temPrint(obra) ? " Os prints continuam disponíveis." : ""}</p>`;
    }
    partes.push(`
      <div class="compra">
        <div class="compra-cabeca">
          <h2 class="bloco-titulo">Original</h2>
          <span class="status status-${status}">${STATUS[status]}</span>
        </div>
        ${status !== "vendido" ? `<p class="preco">${esc(precoOriginal(obra))}</p>` : ""}
        ${orig.observacao ? `<p class="nota">${esc(orig.observacao)}</p>` : ""}
        ${acao}
      </div>`);
  }

  if (temPrint(obra) && PRINTS.tamanhos.length) {
    partes.push(`
      <div class="compra" id="print">
        <div class="compra-cabeca">
          <h2 class="bloco-titulo">Print</h2>
          <span class="status status-disponivel">Sob demanda</span>
        </div>
        <p class="nota">${esc(PRINTS.papel)}. ${esc(PRINTS.observacao)}</p>
        <fieldset class="tamanhos">
          <legend class="visualmente-oculto">Tamanho do print</legend>
          ${PRINTS.tamanhos
            .map(
              (t, i) => `
            <label>
              <input type="radio" name="tamanho" value="${i}" ${i === 0 ? "checked" : ""}>
              <span><strong>${esc(t.nome)}</strong> ${esc(t.medida)}</span>
              <em>${esc(t.preco)}</em>
            </label>`
            )
            .join("")}
        </fieldset>
        <a class="botao botao-cheio" id="pedir-print" target="_blank" rel="noopener">Pedir este print</a>
      </div>`);
  }

  return partes.length ? partes.join("") : `<p class="nota">Esta obra não está à venda no momento.</p>`;
}

function paginaObra() {
  const id = new URLSearchParams(location.search).get("id");
  const indice = OBRAS.findIndex((o) => o.id === id);

  if (indice === -1) {
    $$(".pagina-obra > :not(#nao-encontrada)").forEach((el) => (el.hidden = true));
    $("#nao-encontrada").hidden = false;
    document.title = `Obra não encontrada | ${SITE.nome}`;
    return;
  }

  const obra = OBRAS[indice];
  const serie = nomeSerie(obra);
  document.title = `${obra.titulo} | ${SITE.nome}`;
  $('meta[property="og:title"]').content = document.title;
  $('meta[name="description"]').content = obra.descricao || obra.alt || obra.titulo;

  // Veio da página "À venda"? O link de voltar leva para lá.
  if (document.referrer.includes("venda.html")) {
    $("#voltar").href = "venda.html";
    $("#voltar").textContent = "← Voltar para À venda";
  }

  // Imagem
  const botaoImagem = $("#obra-imagem");
  botaoImagem.innerHTML = imgHTML(obra.id, obra.alt || obra.titulo, { sizes: "(max-width: 900px) 92vw, 60vw", lazy: false });
  const [l, a] = medidas(obra.id);
  botaoImagem.classList.toggle("horizontal", l > a);

  // Texto
  if (serie) {
    $("#obra-serie").hidden = false;
    $("#obra-serie").textContent = `Série ${serie}`;
  }
  $("#obra-titulo").textContent = obra.titulo;
  if (obra.descricao) $("#obra-descricao").textContent = obra.descricao;
  else $("#obra-descricao").remove();

  // Ficha técnica: sempre mostra técnica, dimensões e ano ("—" se ainda não preenchido)
  const status = statusOriginal(obra);
  const ficha = [
    ["Técnica", obra.tecnica || "—"],
    ["Dimensões", obra.dimensoes || "—"],
    ["Ano", obra.ano || "—"],
    ["Série", serie],
    ["Original", status ? STATUS[status] : "Coleção do artista"],
  ].filter(([, v]) => v);
  $("#obra-ficha").innerHTML = ficha.map(([r, v]) => `<div><dt>${r}</dt><dd>${esc(v)}</dd></div>`).join("");

  // Compra
  $("#obra-venda").innerHTML = blocoVenda(obra);
  const pedirPrint = $("#pedir-print");
  if (pedirPrint) {
    const atualizar = () => {
      const t = PRINTS.tamanhos[Number($('input[name="tamanho"]:checked').value)];
      const msg = `Olá! Tenho interesse no print de "${obra.titulo}" no tamanho ${t.nome} (${t.medida}). Pode me passar valores e prazo?`;
      pedirPrint.href = linkPedido(`Print: ${obra.titulo} (${t.nome})`, msg);
    };
    $(".tamanhos").addEventListener("change", atualizar);
    atualizar();
  }

  // Compartilhar
  const compartilhar = $("#compartilhar");
  compartilhar.addEventListener("click", async () => {
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: location.href }); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(location.href);
      compartilhar.textContent = "Link copiado ✓";
      setTimeout(() => (compartilhar.textContent = "Compartilhar"), 2000);
    }
  });

  // Anterior / próxima
  const anterior = OBRAS[(indice - 1 + OBRAS.length) % OBRAS.length];
  const proxima = OBRAS[(indice + 1) % OBRAS.length];
  $("#obra-anterior").href = linkObra(anterior);
  $("#obra-anterior").innerHTML = `<span>← Anterior</span><strong>${esc(anterior.titulo)}</strong>`;
  $("#obra-proxima").href = linkObra(proxima);
  $("#obra-proxima").innerHTML = `<span>Próxima →</span><strong>${esc(proxima.titulo)}</strong>`;

  // Zoom
  const abrirZoom = iniciarZoom();
  botaoImagem.addEventListener("click", () => abrirZoom(obra.id, obra.alt || obra.titulo, esc(obra.titulo), botaoImagem));

  // Esboços desta obra
  const esbocos = ESBOCOS.filter((e) => e.obra === obra.id);
  if (esbocos.length) {
    $("#esbocos-relacionados").hidden = false;
    $("#tira-esbocos").innerHTML = esbocos
      .map((e) => `<a class="tira-item" href="esbocos.html#${e.id}">${imgHTML(e.id, e.titulo, { sizes: "(max-width: 700px) 45vw, 22vw" })}<span>${esc(e.titulo)}</span></a>`)
      .join("");
  }

  // Mais obras: primeiro as da mesma série
  const mesmaSerie = (o) => (obra.serie && o.serie === obra.serie ? 1 : 0);
  $("#mais-obras").innerHTML = OBRAS.filter((o) => o.id !== obra.id)
    .sort((x, y) => mesmaSerie(y) - mesmaSerie(x))
    .slice(0, 4)
    .map((o) => `<a class="tira-item" href="${linkObra(o)}">${imgHTML(o.id, o.alt || o.titulo, { sizes: "(max-width: 700px) 45vw, 22vw" })}<span>${esc(o.titulo)}</span></a>`)
    .join("");

  // Teclado e deslize para trocar de obra
  document.addEventListener("keydown", (e) => {
    if (!$("#zoom").hidden || e.target.matches("input")) return;
    if (e.key === "ArrowLeft") location.href = linkObra(anterior);
    if (e.key === "ArrowRight") location.href = linkObra(proxima);
  });
  let inicioX = null;
  botaoImagem.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  botaoImagem.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 60) location.href = linkObra(dx > 0 ? anterior : proxima);
    inicioX = null;
  });
}

// =============== À venda ===============

function paginaVenda() {
  const itens = OBRAS.filter((o) => originalAVenda(o) || temPrint(o));

  $("#catalogo").innerHTML = itens
    .map((obra) => {
      const tipos = [originalAVenda(obra) && "original", temPrint(obra) && "print"].filter(Boolean);
      const detalhes = [obra.tecnica, obra.dimensoes].filter(Boolean).join(" · ");
      const linhas = [];
      if (originalAVenda(obra)) {
        const status = statusOriginal(obra);
        linhas.push(`<li><span>Original</span><strong>${status === "reservado" ? "Reservado" : esc(precoOriginal(obra))}</strong></li>`);
      }
      if (temPrint(obra)) linhas.push(`<li><span>Print</span><strong>${esc(precoPrintInicial())}</strong></li>`);

      return `
      <a class="item-venda revelar" href="${linkObra(obra)}" data-tipos="${tipos.join(" ")}">
        <div class="moldura">${imgHTML(obra.id, obra.alt || obra.titulo, { sizes: "(max-width: 700px) 90vw, 30vw" })}</div>
        <div class="item-corpo">
          <h3>${esc(obra.titulo)}</h3>
          ${detalhes ? `<p class="item-detalhes">${esc(detalhes)}</p>` : ""}
          <ul class="precos">${linhas.join("")}</ul>
          <span class="item-link">Ver ficha e comprar →</span>
        </div>
      </a>`;
    })
    .join("");

  const atualizarContagem = () => {
    const visiveis = $$("#catalogo .item-venda").filter((i) => !i.hidden).length;
    $("#contagem").textContent = `${visiveis} ${visiveis === 1 ? "obra" : "obras"}`;
    $("#vazio").hidden = visiveis > 0;
  };
  iniciarFiltros($(".filtros"), () => $$("#catalogo .item-venda"), "tipos", atualizarContagem);
  atualizarContagem();

  $("#botao-encomenda").href = linkPedido(
    "Desenho sob encomenda",
    "Olá! Gostaria de um orçamento para um desenho sob encomenda. A ideia é: "
  );
}

// =============== Esboços ===============

function paginaEsbocos() {
  if (!ESBOCOS.length) {
    $("#vazio").hidden = false;
    return;
  }

  $("#esbocos").innerHTML = ESBOCOS.map((e) => {
    const detalhes = [e.tecnica, e.ano].filter(Boolean).join(" · ");
    return `
    <button class="cartao esboco revelar" id="${esc(e.id)}" data-id="${esc(e.id)}">
      <div class="moldura">${imgHTML(e.id, e.titulo)}</div>
      <div class="cartao-legenda">
        <span class="cartao-titulo">${esc(e.titulo)}</span>
        <span class="cartao-serie">${esc(detalhes)}</span>
      </div>
    </button>`;
  }).join("");

  const abrirZoom = iniciarZoom();
  $$(".esboco").forEach((botao) =>
    botao.addEventListener("click", () => {
      const e = ESBOCOS.find((x) => x.id === botao.dataset.id);
      const obra = e.obra && obraPorId(e.obra);
      const legenda = [
        `<strong>${esc(e.titulo)}</strong>`,
        [e.tecnica, e.ano].filter(Boolean).map(esc).join(" · "),
        e.nota ? esc(e.nota) : "",
        obra ? `<a href="${linkObra(obra)}">Ver a obra final: ${esc(obra.titulo)} →</a>` : "",
      ].filter(Boolean).join("<br>");
      abrirZoom(e.id, e.titulo, legenda, botao);
    })
  );

  // Link direto para um esboço (esbocos.html#id)
  if (location.hash) {
    const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (alvo) setTimeout(() => alvo.click(), 300);
  }
}

// =============== Sobre ===============

function paginaSobre() {
  const [l, a] = medidas(SOBRE.foto);
  Object.assign($("#sobre-foto"), { src: caminhoImagem(SOBRE.foto, 1600), width: l, height: a });
  $("#sobre-titulo").textContent = SOBRE.titulo;
  $("#sobre-bio").innerHTML = SOBRE.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  if (SOBRE.local) $("#sobre-local").textContent = SOBRE.local;
  else $("#sobre-local").remove();

  const listas = [
    ["Exposições", SOBRE.exposicoes],
    ["Formação", SOBRE.formacao],
    ["Publicações", SOBRE.publicacoes],
  ].filter(([, itens]) => itens && itens.length);
  if (listas.length) {
    $("#curriculo").hidden = false;
    $("#curriculo-colunas").innerHTML = listas
      .map(
        ([titulo, itens]) => `
        <div>
          <h3>${titulo}</h3>
          <ul>${itens.map((i) => `<li><span>${esc(i.ano)}</span>${esc(i.texto)}</li>`).join("")}</ul>
        </div>`
      )
      .join("");
  }

  if (SOBRE.faq.length) {
    $("#faq-lista").innerHTML = SOBRE.faq
      .map((f) => `<details><summary>${esc(f.pergunta)}</summary><p>${esc(f.resposta)}</p></details>`)
      .join("");
  } else {
    $("#faq").remove();
  }
}

// =============== Início ===============

montarTopo();
montarRodape();
preencherContatos();

({
  inicio: paginaInicio,
  obra: paginaObra,
  venda: paginaVenda,
  esbocos: paginaEsbocos,
  sobre: paginaSobre,
}[ESTA_PAGINA] || (() => {}))();

iniciarRevelar();
