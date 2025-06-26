#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Hardcoded Azure Web App settings
RESOURCE_GROUP="LV"
APP_NAME="luckyapi"

echo "📦 Publishing .NET project..."
dotnet publish -c Release -o ./publish

echo "📄 Creating ZIP package..."
cd publish
zip -r ../site.zip *
cd ..

echo "🚀 Deploying to Azure Web App '$APP_NAME' in resource group '$RESOURCE_GROUP'..."
az webapp deployment source config-zip \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --src ./site.zip

echo "✅ Deployment complete!"
