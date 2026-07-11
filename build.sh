#!/usr/bin/env bash

# Download the installer script explicitly
curl -sSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh

# Run the installer for .NET 8.0
bash dotnet-install.sh --channel 8.0

# Set environment variables so the build process can find dotnet
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools

# Verify installation
dotnet --version

# Run your project build commands
dotnet tool restore
dotnet fable src/App.fsproj -o build --run vite build