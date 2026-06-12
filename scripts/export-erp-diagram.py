"""Export ERP diagram PNGs for dark and light themes using Pillow."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets"
SIZE = 800
CX = CY = 400

MODULES = [
  ("Management", 155, 285, "#c9a04a", "#c9a04a", "top-left"),
  ("Production", 300, 145, "#d4a853", "#d4a853", "top"),
  ("Finance", 620, 190, "#b8923f", "#b8923f", "top-right"),
  ("Logistic", 655, 495, "#2db8a4", "#2db8a4", "bottom-right"),
  ("Sales", 460, 645, "#24b8a5", "#24b8a5", "bottom"),
  ("Human Resources", 240, 625, "#3dbda8", "#3dbda8", "bottom-left"),
]

THEMES = {
  "erp-diagram-dark.png": {
    "bg": (0, 0, 0, 0),
    "ring_inner": (212, 168, 83, 28),
    "ring_mid": (45, 212, 191, 16),
    "ring_stroke": (212, 168, 83, 50),
    "ring_stroke2": (45, 212, 191, 38),
    "hub_bg": (212, 168, 83, 48),
    "hub_border": (212, 168, 83, 120),
    "hub_text": (240, 200, 120, 255),
    "hub_sub": (157, 155, 184, 255),
    "label_bg": (20, 20, 34, 240),
    "label_text": (240, 200, 120, 255),
    "label_text_teal": (45, 212, 191, 255),
    "shadow": (0, 0, 0, 80),
    "dot": (255, 255, 255, 255),
  },
  "erp-diagram-light.png": {
    "bg": (0, 0, 0, 0),
    "ring_inner": (184, 134, 46, 34),
    "ring_mid": (13, 148, 136, 22),
    "ring_stroke": (184, 134, 46, 60),
    "ring_stroke2": (13, 148, 136, 48),
    "hub_bg": (184, 134, 46, 40),
    "hub_border": (184, 134, 46, 110),
    "hub_text": (138, 96, 32, 255),
    "hub_sub": (74, 72, 96, 255),
    "label_bg": (255, 255, 255, 250),
    "label_text": (138, 96, 32, 255),
    "label_text_teal": (13, 122, 110, 255),
    "shadow": (0, 0, 0, 28),
    "dot": (255, 255, 255, 255),
  },
}


def hex_to_rgb(color: str) -> tuple[int, int, int]:
  color = color.lstrip("#")
  return tuple(int(color[i:i + 2], 16) for i in (0, 2, 4))


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
  candidates = [
    "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
  ]
  for path in candidates:
    try:
      return ImageFont.truetype(path, size)
    except OSError:
      continue
  return ImageFont.load_default()


def bezier_points(p0, p1, p2, steps=40):
  pts = []
  for i in range(steps + 1):
    t = i / steps
    u = 1 - t
    x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]
    y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
    pts.append((x, y))
  return pts


def draw_thick_curve(draw, p0, p1, p2, color, width=24):
  pts = bezier_points(p0, p1, p2)
  for i in range(len(pts) - 1):
    draw.line((pts[i], pts[i + 1]), fill=hex_to_rgb(color), width=width, joint="curve")


def draw_ring_gradient(draw, theme):
  for radius, color in ((360, theme["ring_inner"]), (300, theme["ring_mid"])):
    draw.ellipse((CX - radius, CY - radius, CX + radius, CY + radius), fill=color)
  draw.ellipse((CX - 300, CY - 300, CX + 300, CY + 300), outline=theme["ring_stroke"], width=2)
  draw.ellipse((CX - 240, CY - 240, CX + 240, CY + 240), outline=theme["ring_stroke2"], width=1)


def draw_icon(draw, kind, x, y):
  w = (255, 255, 255, 255)
  if kind == "top":
    draw.regular_polygon((x, y, 15), 8, outline=w, width=2)
    draw.line((x + 9, y + 9, x + 17, y + 17), fill=w, width=2)
    draw.line((x + 17, y + 9, x + 9, y + 17), fill=w, width=2)
  elif kind == "top-right":
    draw.rounded_rectangle((x - 14, y - 16, x + 6, y + 10), radius=2, outline=w, width=2)
    draw.rounded_rectangle((x - 6, y - 10, x + 14, y + 16), radius=2, outline=w, width=2)
    draw.ellipse((x + 6, y, x + 22, y + 16), outline=w, width=2)
    draw.text((x + 11, y + 1), "$", fill=w, font=load_font(11, True))
  elif kind == "bottom-right":
    draw.rounded_rectangle((x - 22, y - 8, x + 8, y + 10), radius=3, outline=w, width=2)
    draw.line((x + 8, y - 8, x + 18, y - 8, x + 24, y + 2, x + 24, y + 10, x - 22, y + 10), fill=w, width=2)
    draw.ellipse((x - 18, y + 6, x - 8, y + 16), outline=w, width=2)
    draw.ellipse((x + 12, y + 6, x + 22, y + 16), outline=w, width=2)
    draw.line((x + 28, y - 2, x + 40, y - 2), fill=w, width=2)
  elif kind == "bottom":
    for i, h in enumerate((24, 16, 20, 26)):
      bx = x - 18 + i * 12
      draw.line((bx, y + 10, bx, y + 10 - h), fill=w, width=2)
    draw.line((x - 18, y - 14, x - 6, y - 6, x + 6, y - 10, x + 18, y - 16), fill=w, width=2)
  elif kind == "bottom-left":
    draw.ellipse((x - 6, y - 16, x + 6, y - 4), outline=w, width=2)
    draw.arc((x - 16, y - 2, x + 16, y + 18), 20, 160, fill=w, width=2)
    draw.ellipse((x - 24, y - 8, x - 12, y + 4), outline=w, width=2)
    draw.ellipse((x + 12, y - 8, x + 24, y + 4), outline=w, width=2)
  else:
    draw.ellipse((x - 6, y - 14, x + 6, y - 2), outline=w, width=2)
    draw.ellipse((x - 20, y + 6, x - 8, y + 18), outline=w, width=2)
    draw.ellipse((x + 8, y + 6, x + 20, y + 18), outline=w, width=2)
    draw.line((x, y - 2, x - 10, y + 8), fill=w, width=2)
    draw.line((x, y - 2, x + 10, y + 8), fill=w, width=2)


def label_box(draw, text, cx, cy, stroke, theme, is_teal=False):
  font = load_font(13, True)
  bbox = draw.textbbox((0, 0), text, font=font)
  tw = bbox[2] - bbox[0]
  w, h = tw + 28, 34
  left, top = cx - w / 2, cy
  text_color = theme["label_text_teal"] if is_teal else theme["label_text"]
  draw.rounded_rectangle((left, top, left + w, top + h), radius=17, fill=theme["label_bg"], outline=hex_to_rgb(stroke), width=2)
  draw.text((left + 14, top + 8), text, fill=text_color, font=font)


def render(theme_name, theme):
  img = Image.new("RGBA", (SIZE, SIZE), theme["bg"])
  draw = ImageDraw.Draw(img)
  draw_ring_gradient(draw, theme)

  curves = [
    ((400, 310), (250, 200), (155, 285), "#c9a04a"),
    ((400, 280), (340, 170), (300, 145), "#d4a853"),
    ((430, 300), (560, 210), (620, 190), "#b8923f"),
    ((440, 420), (590, 470), (655, 495), "#2db8a4"),
    ((420, 450), (450, 580), (460, 645), "#24b8a5"),
    ((360, 420), (260, 540), (240, 625), "#3dbda8"),
  ]
  for p0, p1, p2, color in curves:
    draw_thick_curve(draw, p0, p1, p2, color)

  draw.ellipse((CX - 95, CY - 95, CX + 95, CY + 95), fill=theme["hub_bg"], outline=theme["hub_border"], width=2)
  draw.text((CX, CY - 30), "ERP", fill=theme["hub_text"], font=load_font(42, True), anchor="mm")
  draw.text((CX, CY + 18), "Enterprise resource planning", fill=theme["hub_sub"], font=load_font(11), anchor="mm")

  labels = {
    "top-left": (95, 218, False),
    "top": (372, 82, False),
    "top-right": (672, 132, False),
    "bottom-right": (702, 558, True),
    "bottom": (416, 703, True),
    "bottom-left": (142, 683, True),
  }
  dots = {
    "top-left": (95, 235),
    "top": (355, 105),
    "top-right": (665, 155),
    "bottom-right": (700, 545),
    "bottom": (420, 690),
    "bottom-left": (175, 670),
  }

  for name, x, y, fill, stroke, pos in MODULES:
    draw.ellipse((x - 52, y - 48, x + 52, y + 56), fill=theme["shadow"])
    draw.ellipse((x - 52, y - 52, x + 52, y + 52), fill=hex_to_rgb(fill))
    draw_icon(draw, pos, x, y)
    dx, dy = dots[pos]
    draw.ellipse((dx - 5, dy - 5, dx + 5, dy + 5), fill=theme["dot"])
    lx, ly, is_teal = labels[pos]
    label_box(draw, name, lx + (70 if pos == "top-left" else 0), ly, stroke, theme, is_teal)

  out = OUT_DIR / theme_name
  img.save(out, "PNG")
  print(f"Wrote {out}")


def main():
  for name, theme in THEMES.items():
    render(name, theme)


if __name__ == "__main__":
  main()
