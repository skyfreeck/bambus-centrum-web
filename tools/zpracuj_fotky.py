"""Připraví fotky pro web: otočí podle EXIF, ořízne na poměr stran, zmenší,
odstraní metadata (včetně GPS polohy) a uloží jako progresivní JPG.
Použití: python zpracuj_fotky.py vstup.jpg cil.jpg 4:5 [delsi_strana]"""
import sys
from PIL import Image, ImageOps

def process(src, dst, ratio, long_side=None):
    rw, rh = (int(x) for x in ratio.split(":"))
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    w, h = im.size
    target = rw / rh
    if w / h > target:                      # moc široká → ořez do stran
        nw = int(h * target); left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:                                   # moc vysoká → ořez nahoře a dole
        nh = int(w / target); top = (h - nh) // 2
        im = im.crop((0, top, w, top + nh))
    long_side = long_side or (2000 if rh >= rw else 2400)
    scale = long_side / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(dst, "JPEG", quality=80, optimize=True, progressive=True)  # bez EXIF = bez GPS
    return im.size

if __name__ == "__main__":
    a = sys.argv
    print(process(a[1], a[2], a[3], int(a[4]) if len(a) > 4 else None))
