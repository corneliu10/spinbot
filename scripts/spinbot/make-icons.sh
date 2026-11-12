#!/usr/bin/env bash
# Makes the Spinbot app icons from the Spinrun S-cube mark (the owner's Spinrun brand).
# Needs: rsvg-convert (brew install librsvg), iconutil (macOS), uv (for Pillow, to write .ico).
#
#   bash scripts/spinbot/make-icons.sh
#
# Writes build/icon-production.png (Windows/Linux, full tile), build/icon-production-macos-safe-area.png
# (macOS Dock image, inside the macOS grid), build/icon-production.icns, build/icon-production.ico,
# build/icon.ico, build/icon.svg, the menu bar template build/macos/tray/*, and the Icon Composer layer.
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT=build
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The Spinrun S-cube, viewBox 0 0 512 512 (from corneliu10/spinrun packages/ui/src/logo/Logo.tsx).
MARK='M242.14,8.00L57.02,114.88Q43.17,122.88 57.02,130.88L242.14,237.76Q256.00,245.76 269.86,237.76L454.98,130.88Q468.83,122.88 454.98,114.88L269.86,8.00Q256.00,0.00 242.14,8.00Z M45.20,274.24L230.32,381.12Q244.18,389.12 244.18,373.12L244.18,323.20Q244.18,307.20 230.32,299.20L104.32,226.45Q90.46,218.45 90.46,202.45L90.46,193.49Q90.46,177.49 76.61,169.49L45.20,151.36Q31.34,143.36 31.34,159.36L31.34,250.24Q31.34,266.24 45.20,274.24Z M31.34,336.85L31.34,373.12Q31.34,389.12 45.20,397.12L230.32,504.00Q244.18,512.00 244.18,496.00L244.18,459.73Q244.18,443.73 230.32,435.73L45.20,328.85Q31.34,320.85 31.34,336.85Z M466.80,192.32L281.68,299.20Q267.82,307.20 267.82,323.20L267.82,373.12Q267.82,389.12 281.68,381.12L407.68,308.37Q421.54,300.37 421.54,316.37L421.54,338.99Q421.54,354.99 407.68,362.99L281.68,435.73Q267.82,443.73 267.82,459.73L267.82,496.00Q267.82,512.00 281.68,504.00L466.80,397.12Q480.66,389.12 480.66,373.12L480.66,200.32Q480.66,184.32 466.80,192.32Z'

# tile <canvas> <offset> <size> <file>: white rounded tile, black mark at 66% of the tile (as Spinrun's icon).
tile() {
  local canvas=$1 off=$2 size=$3 file=$4
  local rx; rx=$(awk "BEGIN{printf \"%.1f\", $size*112/512}")
  local s; s=$(awk "BEGIN{printf \"%.6f\", $size/512*0.66}")
  local c; c=$(awk "BEGIN{printf \"%.1f\", $off+$size/2}")
  cat > "$file" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="$canvas" height="$canvas" viewBox="0 0 $canvas $canvas">
  <title>Spinbot</title>
  <rect x="$off" y="$off" width="$size" height="$size" rx="$rx" fill="#ffffff"/>
  <path fill="#000000" fill-rule="evenodd" transform="translate($c $c) scale($s) translate(-256 -256)" d="$MARK"/>
</svg>
EOF
}

tile 1600 0 1600 "$TMP/full.svg"
tile 1600 156 1288 "$TMP/safe.svg"
tile 1024 0 1024 "$OUT/icon.svg"

rsvg-convert -w 1600 -h 1600 "$TMP/full.svg" -o "$OUT/icon-production.png"
rsvg-convert -w 1600 -h 1600 "$TMP/safe.svg" -o "$OUT/icon-production-macos-safe-area.png"

# .icns from the macOS-grid image.
ICONSET="$TMP/icon.iconset"; mkdir -p "$ICONSET"
for s in 16 32 128 256 512; do
  rsvg-convert -w $s -h $s "$TMP/safe.svg" -o "$ICONSET/icon_${s}x${s}.png"
  rsvg-convert -w $((s*2)) -h $((s*2)) "$TMP/safe.svg" -o "$ICONSET/icon_${s}x${s}@2x.png"
done
iconutil -c icns "$ICONSET" -o "$OUT/icon-production.icns"

# .ico from the full tile.
for s in 16 24 32 48 64 128 256; do rsvg-convert -w $s -h $s "$TMP/full.svg" -o "$TMP/ico-$s.png"; done
uv run --no-project --quiet --with pillow -- python -I - "$TMP" "$OUT/icon-production.ico" <<'PY'
import sys
from PIL import Image
tmp, out = sys.argv[1], sys.argv[2]
sizes = [16, 24, 32, 48, 64, 128, 256]
imgs = [Image.open(f"{tmp}/ico-{s}.png").convert("RGBA") for s in sizes]
imgs[-1].save(out, format="ICO", sizes=[(s, s) for s in sizes], append_images=imgs[:-1])
PY
cp "$OUT/icon-production.ico" "$OUT/icon.ico"

# Menu bar template: the mark alone, black on transparent; macOS colors it.
cat > "$OUT/macos/tray/tray-template.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="-24 -24 560 560">
  <title>Spinbot menu bar icon</title>
  <path fill="#000000" fill-rule="evenodd" d="$MARK"/>
</svg>
EOF
rsvg-convert -w 18 -h 18 "$OUT/macos/tray/tray-template.svg" -o "$OUT/macos/tray/trayTemplate.png"
rsvg-convert -w 36 -h 36 "$OUT/macos/tray/tray-template.svg" -o "$OUT/macos/tray/trayTemplate@2x.png"

# Icon Composer layer (for a later build with Xcode): the mark, black on transparent.
cat > "$TMP/mark.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512"><path fill="#000" fill-rule="evenodd" d="$MARK"/></svg>
EOF
rsvg-convert -w 1024 -h 1024 "$TMP/mark.svg" -o "$OUT/icon-production.icon/Assets/eyes.png"
echo "icons written"
