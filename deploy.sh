#!/bin/bash

# Script para deploy automatizado com versionamento

set -e

CURRENT_VERSION=$(cat VERSION)
REGISTRY="dncarbonell/ffmpeg-api"

echo "Versão atual: v$CURRENT_VERSION"

# Função para incrementar versão
increment_version() {
    local version=$1
    local type=$2
    
    IFS='.' read -r major minor patch <<< "$version"
    
    case $type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            echo "Tipo de versão inválido. Use: major, minor, patch"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Verificar se foi passado o tipo de versão
if [ $# -eq 0 ]; then
    echo "Uso: $0 <major|minor|patch> [descrição]"
    echo "Exemplo: $0 minor 'Adicionado endpoint base64'"
    exit 1
fi

VERSION_TYPE=$1
DESCRIPTION=${2:-"Atualização automática"}

# Calcular nova versão
NEW_VERSION=$(increment_version $CURRENT_VERSION $VERSION_TYPE)

echo "Nova versão: v$NEW_VERSION"

# Atualizar arquivo VERSION
echo $NEW_VERSION > VERSION

# Build das imagens Docker
echo "Building Docker images..."
docker build -t $REGISTRY:v$NEW_VERSION .
docker build -t $REGISTRY:v$NEW_VERSION-homolog .

# Push para registry
echo "Pushing to registry..."
docker push $REGISTRY:v$NEW_VERSION
docker push $REGISTRY:v$NEW_VERSION-homolog

# Atualizar VERSIONING.md
DATE=$(date +%Y-%m-%d)
sed -i "/### Histórico de Versões/a | v$NEW_VERSION | $VERSION_TYPE | $DESCRIPTION | $DATE |" VERSIONING.md

echo "Deploy concluído!"
echo "Versão v$NEW_VERSION disponível em:"
echo "- Produção: $REGISTRY:v$NEW_VERSION"
echo "- Homologação: $REGISTRY:v$NEW_VERSION-homolog"
echo ""
echo "⚠️  LEMBRETE: Se você adicionou novos endpoints, verifique se:"
echo "   - public/index.html foi atualizado com a nova documentação"
echo "   - CLAUDE.md foi atualizado com os novos endpoints"
echo "   - Todos os exemplos de URL usam a porta correta (8765)"