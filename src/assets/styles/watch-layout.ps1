# SCSS Layout Watch ve Compile Scripti
# Sadece scss/layout klasöründeki dosyaları izler ve css klasörüne derler (.css ve .min.css)

$scssPath = "ui\fonts\fonts.scss"
$cssPath = "css\ui\fonts"

# CSS klasörü yoksa oluştur
if (-not (Test-Path $cssPath)) {
    New-Item -ItemType Directory -Path $cssPath | Out-Null
    Write-Host "CSS klasörü oluşturuldu: $cssPath" -ForegroundColor Green
}

# Sass'ın yüklü olup olmadığını kontrol et
$sassInstalled = Get-Command sass -ErrorAction SilentlyContinue

if (-not $sassInstalled) {
    Write-Host "Sass bulunamadı. Yükleniyor..." -ForegroundColor Yellow
    npm install -g sass
}

Write-Host "Layout klasörü izleniyor: $scssPath -> $cssPath" -ForegroundColor Cyan
Write-Host "Çıktı: .css ve .min.css dosyaları" -ForegroundColor Cyan
Write-Host "Durdurmak için Ctrl+C tuşlarına basın" -ForegroundColor Gray
Write-Host ""

# Her SCSS dosyası için hem normal hem minified derleme fonksiyonu
function Compile-SCSS {
    param($scssFile)
    
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($scssFile)
    $cssFile = Join-Path $cssPath "$fileName.css"
    $cssMinFile = Join-Path $cssPath "$fileName.min.css"
    
    # Normal CSS derle
    & sass "$scssFile" "$cssFile" --style expanded --no-source-map 2>&1 | Out-Null
    
    # Minified CSS derle
    & sass "$scssFile" "$cssMinFile" --style compressed --no-source-map 2>&1 | Out-Null
}

Write-Host "`nWatch işlemi başladı" -ForegroundColor Green

try {
    while ($true) {
        Start-Sleep -Seconds 1.5
        
        # Tüm SCSS dosyalarını derle
        Get-ChildItem -Path $scssPath -Filter "*.scss" | ForEach-Object {
            Compile-SCSS $_.FullName
        }
    }
}
finally {
    Write-Host "`nDurduruluyor..." -ForegroundColor Yellow
    Write-Host "Temizlendi." -ForegroundColor Green
}
