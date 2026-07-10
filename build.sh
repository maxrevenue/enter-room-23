#!/usr/bin/env bash
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 8.0
export PATH="$HOME/.dotnet:$PATH"
dotnet tool restore
dotnet fable src/App.fsproj -o build --run vite build
