"""
Gera versões leves (WebP) das imagens do site e anota o tamanho de cada uma.

Você normalmente NÃO precisa rodar isto: quando uma imagem nova é enviada para
img/originais/ no GitHub, uma automação roda este script sozinha
(veja .github/workflows/otimizar-imagens.yml).

Para rodar no seu computador (opcional):
    pip install pillow
    python tools/otimizar_imagens.py

O que ele faz:
  img/originais/Minha Obra.jpg  ->  img/obras/minha-obra-800.webp   (miniatura)
                                    img/obras/minha-obra-1600.webp  (versão grande)
  e atualiza assets/imagens.js com a largura e a altura de cada imagem.

O "id" usado em assets/obras.js é o nome do arquivo simplificado:
minúsculas, sem acentos e com hífens no lugar de espaços ("minha-obra").
"""

import json
import re
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGINAIS = RAIZ / "img" / "originais"
SAIDA = RAIZ / "img" / "obras"
LISTA = RAIZ / "assets" / "imagens.js"
TAMANHOS = [800, 1600]  # maior lado, em pixels
QUALIDADE = 82
FORMATOS = {".jpg", ".jpeg", ".png", ".webp"}


def simplificar(nome: str) -> str:
    """'Contorcionismo 2 (1).JPG' -> 'contorcionismo-2-1'"""
    sem_acento = unicodedata.normalize("NFKD", nome).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", sem_acento.lower()).strip("-")


def otimizar(arquivo: Path, id_: str) -> None:
    with Image.open(arquivo) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        for tamanho in TAMANHOS:
            copia = im.copy()
            copia.thumbnail((tamanho, tamanho), Image.LANCZOS)
            destino = SAIDA / f"{id_}-{tamanho}.webp"
            copia.save(destino, "WEBP", quality=QUALIDADE, method=6)
            print(f"  {destino.relative_to(RAIZ)}  {copia.size[0]}x{copia.size[1]}  "
                  f"{destino.stat().st_size // 1024} KB")


def precisa_otimizar(arquivo: Path, id_: str) -> bool:
    saidas = [SAIDA / f"{id_}-{t}.webp" for t in TAMANHOS]
    return any(not s.exists() or s.stat().st_mtime < arquivo.stat().st_mtime for s in saidas)


def escrever_lista() -> None:
    """Grava assets/imagens.js: { id: [largura, altura] } da miniatura de cada imagem."""
    medidas = {}
    for miniatura in sorted(SAIDA.glob("*-800.webp")):
        with Image.open(miniatura) as im:
            medidas[miniatura.name[: -len("-800.webp")]] = list(im.size)
    texto = (
        "// Arquivo gerado automaticamente por tools/otimizar_imagens.py. Não edite à mão.\n"
        "// Largura e altura da miniatura de cada imagem, para a página não 'pular' ao carregar.\n"
        f"const IMAGENS = {json.dumps(medidas, indent=2, ensure_ascii=False)};\n"
    )
    LISTA.write_text(texto, encoding="utf-8")
    print(f"{LISTA.relative_to(RAIZ)} atualizado ({len(medidas)} imagens)")


def imagem_de_compartilhamento() -> None:
    """Imagem 1200x630 que aparece quando o link é compartilhado (WhatsApp, redes)."""
    destino = RAIZ / "img" / "compartilhar.jpg"
    capa = ORIGINAIS / "livro-fechado.jpg"
    if destino.exists() or not capa.exists():
        return
    with Image.open(capa) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im = ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.35))
        im.save(destino, "JPEG", quality=85)


def logo_pequeno() -> None:
    """Versão pequena do logo, com fundo transparente, para o cabeçalho e a aba."""
    destino = RAIZ / "img" / "logo-192.png"
    logo = RAIZ / "img" / "logo.png"
    if destino.exists() or not logo.exists():
        return
    with Image.open(logo) as im:
        cinza = im.convert("L")
        cinza.thumbnail((192, 192), Image.LANCZOS)
        branco = Image.new("RGBA", cinza.size, (236, 233, 228, 255))
        branco.putalpha(cinza)
        branco.save(destino, optimize=True)


if __name__ == "__main__":
    SAIDA.mkdir(parents=True, exist_ok=True)
    for arquivo in sorted(ORIGINAIS.iterdir()):
        if arquivo.suffix.lower() not in FORMATOS:
            continue
        id_ = simplificar(arquivo.stem)
        if precisa_otimizar(arquivo, id_):
            print(f"{arquivo.name}  ->  id \"{id_}\"")
            otimizar(arquivo, id_)
    escrever_lista()
    imagem_de_compartilhamento()
    logo_pequeno()
