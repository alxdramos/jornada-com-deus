#!/usr/bin/env bash
# Baixa e extrai as dependências do sistema necessárias para o Playwright rodar no WSL2
# Sem necessidade de sudo — extrai os .deb localmente em /tmp/playwright-libs
set -e

LIBS_DIR="/tmp/playwright-libs"
MARKER="$LIBS_DIR/.installed"

# Verifica se as libs já estão instaladas
if [ -f "$MARKER" ]; then
  exit 0
fi

echo "🔧 Instalando dependências do Playwright para WSL2..."
mkdir -p "$LIBS_DIR"
cd /tmp

apt-get download \
  libnspr4 \
  libnss3 \
  libasound2t64 \
  libatk1.0-0t64 \
  libcups2t64 \
  2>&1

for f in libnspr4_*.deb libnss3_*.deb libasound2t64_*.deb libatk1.0-0t64_*.deb libcups2t64_*.deb; do
  [ -f "$f" ] && dpkg -x "$f" "$LIBS_DIR/"
done

touch "$MARKER"
echo "✅ Dependências instaladas em $LIBS_DIR"
