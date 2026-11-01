#!/bin/zsh
set -e
cd -- "$(dirname -- "$0")"
if ! command -v npm >/dev/null 2>&1; then
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
  fi
fi
if ! command -v npm >/dev/null 2>&1; then
  printf 'Node.js / npm bulunamadı. Önce Node.js kurun.\n'
  read -r '?Kapatmak için Enter: '
  exit 1
fi
if [ ! -d node_modules ]; then
  npm ci
fi
if [ ! -f dist/index.html ]; then
  npm run build:web
fi
if curl --silent --fail --max-time 2 http://localhost:8081/ >/dev/null 2>&1; then
  printf '8081 adresinde bir önizleme zaten açık. Tarayıcı açılıyor.\n'
  open 'http://localhost:8081/'
  exit 0
fi
printf 'WearWeather açılıyor. Önizlemenin çalışması için bu Terminal penceresini açık tutun.\n'
npm run preview -- --open
