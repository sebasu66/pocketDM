$ErrorActionPreference = 'Stop'
$site = 'https://pocketdm-prototipos.web.app/'
$target = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\combate'
New-Item -Path $target -ItemType Directory -Force | Out-Null
Invoke-WebRequest -Uri $site -UseBasicParsing -OutFile (Join-Path $target 'index.html')
$expected = '697635B637EEAF6EDC8C6B21B4743730E574CBE56C10A8FD5228231E8550FA68'
$actual = (Get-FileHash (Join-Path $target 'index.html') -Algorithm SHA256).Hash
if ($actual -ne $expected) { throw "HTML publicado no coincide con la copia auditada: $actual" }
$files = @(
  'assets/bg-hellfrost.jpg',
  'assets/card-bloquear.jpg',
  'assets/card-desviar.jpg',
  'assets/card-golpe.jpg',
  'assets/card-mover.jpg',
  'assets/card-tajo.jpg',
  'assets/enemy-caballero.jpg',
  'assets/enemy-lobo.jpg',
  'assets/enemy-mago.jpg',
  'assets/head-hero.jpg',
  'assets/head-mago.jpg',
  'assets/hero.jpg',
  'assets/lane-stone.jpg',
  'assets/sfx/card-deal.ogg',
  'assets/sfx/card-place.ogg',
  'assets/sfx/card-riffle.ogg',
  'assets/sfx/impact.ogg',
  'assets/sfx/lose.ogg',
  'assets/sfx/move.ogg',
  'assets/sfx/pain.ogg',
  'assets/sfx/select.ogg',
  'assets/sfx/turn.ogg',
  'assets/sfx/win.ogg'
)
foreach ($relative in $files) {
  $local = Join-Path $target ($relative -replace '/', '\')
  $dir = Split-Path $local -Parent
  New-Item -Path $dir -ItemType Directory -Force | Out-Null
  $remote = $site + $relative
  Invoke-WebRequest -Uri $remote -UseBasicParsing -OutFile $local
  Write-Output "DESCARGADO $relative"
}
Write-Output "OK: combate conservado con SHA-256 $actual y $($files.Length) assets."
