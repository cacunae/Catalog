param(
  [string]$OutputDir = "..\public\mock\real"
)

$ErrorActionPreference = "Stop"

$destination = Join-Path $PSScriptRoot $OutputDir
New-Item -ItemType Directory -Path $destination -Force | Out-Null

$productsApi = "https://dummyjson.com/products?limit=30&select=id,title,thumbnail,images"
$apiResponse = Invoke-RestMethod -Uri $productsApi -Method Get

if (-not $apiResponse.products -or $apiResponse.products.Count -lt 20) {
  throw "No se pudieron obtener suficientes imagenes de producto desde dummyjson."
}

$downloads = @()

for ($i = 1; $i -le 18; $i++) {
  $file = "product-{0}.jpg" -f $i.ToString("00")
  $product = $apiResponse.products[$i - 1]
  $url = if ($product.thumbnail) { $product.thumbnail } else { $product.images[0] }
  $downloads += @{ file = $file; url = $url }
}

$detailA = $apiResponse.products[18]
$detailB = $apiResponse.products[19]
$downloads += @{ file = "detail-01.jpg"; url = $(if ($detailA.images[0]) { $detailA.images[0] } else { $detailA.thumbnail }) }
$downloads += @{ file = "detail-02.jpg"; url = $(if ($detailB.images[0]) { $detailB.images[0] } else { $detailB.thumbnail }) }

foreach ($item in $downloads) {
  $targetPath = Join-Path $destination $item.file
  Write-Host "Downloading $($item.file)..."
  Invoke-WebRequest -Uri $item.url -OutFile $targetPath
}

Write-Host "Done. Images saved to: $destination"
