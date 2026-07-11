#!/usr/bin/env bash

# Install .NET 8.0
curl -sSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
bash dotnet-install.sh --channel 10.0

# Set environment variables
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools

# Verify installation
dotnet --version

# Restore tools and run Fable
dotnet tool restore
dotnet tool run fable src/App.fsproj -o build --run vite build