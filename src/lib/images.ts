export function getTownHallImageSrc(level?: number | null) {
  return level ? `/images/townhall/th${level}.png` : "/images/townhall/placeholder.png";
}