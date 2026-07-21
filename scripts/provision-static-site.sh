#!/usr/bin/env bash
set -euo pipefail

RESOURCE_GROUP="gatherloop-rg"
LOCATION="southafricanorth"
STORAGE_ACCOUNT="gatherloopsite$RANDOM" #Eg. gatherloopsite18025

az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
# ↑ a "resource group" is just a folder/container Azure uses to group
#   everything belonging to this project together, so it's easy to find
#   (and delete) as one unit later.

az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2
# ↑ this creates the actual storage account — the "filing cabinet" from
#   our earlier analogy. Standard_LRS = cheapest redundancy tier, fine
#   for this project.

az storage blob service-properties update \
  --account-name "$STORAGE_ACCOUNT" \
  --static-website \
  --index-document index.html \
  --404-document index.html
# ↑ this is the one command that actually switches the filing cabinet
#   into "static website mode" and tells it which file to hand out
#   as the homepage.

ENDPOINT=$(az storage account show \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --query "primaryEndpoints.web" -o tsv)

echo "Static site endpoint: $ENDPOINT"