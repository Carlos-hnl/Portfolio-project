"""
Gera versões leves (WebP) das obras para o site.

Como usar:
  1. Coloque a imagem original em img/originais/ com um nome simples,
     sem espaços nem acentos (ex.: minha-obra.jpg).
  2. Rode na pasta do projeto:   python tools/otimizar_imagens.py
     (precisa do Pillow:  pip install pillow)
  3. As versões prontas aparecem em img/obras/:
       minha-obra-800.webp   -> miniatura usada nas grades
       minha-obra-1600.webp  -> versão grande usada na página da obra
"""

from pathlib import Path
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGINAIS = RAIZ / "img" / "originais"
SAIDA = RAIZ / "img" / "obras"
TAMANHOS = [800, 1600]  # maior lado, em pixels
QUALIDADE = 82


def otimizar(arquivo: Path) -> None:
    with Image.open(arquivo) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        for tamanho in TAMANHOS:
            copia = im.copy()
            copia.thumbnail((tamanho, tamanho), Image.LANCZOS)
            destino = SAIDA / f"{arquivo.stem}-{tamanho}.webp"
            copia.save(destino, "WEBP", quality=QUALIDADE, method=6)
            print(f"{destino.relative_to(RAIZ)}  {copia.size[0]}x{copia.size[1]}  "
                  f"{destino.stat().st_size // 1024} KB")


def imagem_de_compartilhamento() -> None:
    """Imagem 1200x630 que aparece quando o link é compartilhado (WhatsApp, redes)."""
    capa = ORIGINAIS / "livro-fechado.jpg"
    if not capa.exists():
        return
    with Image.open(capa) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im = ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.35))
        im.save(RAIZ / "img" / "compartilhar.jpg", "JPEG", quality=85)


def logo_pequeno() -> None:
    """Versão pequena do logo para o cabeçalho e o ícone da aba."""
    logo = RAIZ / "img" / "logo.png"
    if not logo.exists():
        return
    with Image.open(logo) as im:
        # O traço branco vira a única parte visível; o fundo preto fica transparente
        cinza = im.convert("L")
        cinza.thumbnail((192, 192), Image.LANCZOS)
        branco = Image.new("RGBA", cinza.size, (236, 233, 228, 255))
        branco.putalpha(cinza)
        branco.save(RAIZ / "img" / "logo-192.png", optimize=True)


if __name__ == "__main__":
    SAIDA.mkdir(parents=True, exist_ok=True)
    for arquivo in sorted(ORIGINAIS.iterdir()):
        if arquivo.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            otimizar(arquivo)
    imagem_de_compartilhamento()
    logo_pequeno()
