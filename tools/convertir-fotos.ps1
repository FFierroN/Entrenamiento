# Convierte fotos descargadas a JPG de máximo 600 px de ancho (fondo blanco si tenían transparencia).
# Uso: powershell -ExecutionPolicy Bypass -File tools/convertir-fotos.ps1 <carpeta-origen> <carpeta-destino>
param($origen, $destino)
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $destino | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq "image/jpeg"
$params = [System.Drawing.Imaging.EncoderParameters]::new(1)
$params.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]80)
foreach ($f in Get-ChildItem $origen -Filter *.src) {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $w = [Math]::Min(600, $img.Width); $h = [int]($img.Height * $w / $img.Width)
    $bmp = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $bmp.Save((Join-Path $destino ($f.BaseName + ".jpg")), $codec, $params)
    $g.Dispose(); $bmp.Dispose(); $img.Dispose()
    Write-Output "$($f.BaseName).jpg ${w}x${h}"
}
