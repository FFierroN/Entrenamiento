# Genera los íconos cuadrados de la app a partir de icons/logo.jpg.
# El logo se centra sobre un fondo oscuro con degradado y sus bordes se funden
# suavemente, dejando margen para que Android lo recorte en círculo ("maskable").
# Uso (desde la carpeta del proyecto): powershell -ExecutionPolicy Bypass -File tools/generar-iconos.ps1
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Drawing2D;
public static class Icono {
    static int Lerp(int a, int b, double t) { return (int)Math.Round(a + (b - a) * t); }
    public static Bitmap Crear(Bitmap src, int size, Color centro, Color borde, double ancho, double fundido) {
        // 1. Logo escalado
        int w = (int)(size * ancho), h = (int)(w * (double)src.Height / src.Width);
        var logo = new Bitmap(w, h);
        using (var g = Graphics.FromImage(logo)) {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.DrawImage(src, 0, 0, w, h);
        }
        int ox = (size - w) / 2, oy = (size - h) / 2;
        double f = size * fundido, rmax = size * 0.7071;
        var outBmp = new Bitmap(size, size);
        for (int y = 0; y < size; y++) for (int x = 0; x < size; x++) {
            // 2. Fondo: degradado radial del centro al borde
            double t = Math.Min(1, Math.Sqrt(Math.Pow(x - size / 2.0, 2) + Math.Pow(y - size / 2.0, 2)) / rmax);
            Color bg = Color.FromArgb(Lerp(centro.R, borde.R, t), Lerp(centro.G, borde.G, t), Lerp(centro.B, borde.B, t));
            Color c = bg;
            int lx = x - ox, ly = y - oy;
            if (lx >= 0 && ly >= 0 && lx < w && ly < h) {
                // 3. Mezcla del logo, con bordes fundidos
                double d = Math.Min(Math.Min(lx, w - 1 - lx), Math.Min(ly, h - 1 - ly));
                double a = Math.Min(1, d / f); a = a * a * (3 - 2 * a);
                Color p = logo.GetPixel(lx, ly);
                c = Color.FromArgb(Lerp(bg.R, p.R, a), Lerp(bg.G, p.G, a), Lerp(bg.B, p.B, a));
            }
            outBmp.SetPixel(x, y, c);
        }
        logo.Dispose();
        return outBmp;
    }
}
"@

$root = Split-Path $PSScriptRoot -Parent
$src = [System.Drawing.Bitmap]::new((Join-Path $root "icons/logo.jpg"))
$centro = [System.Drawing.ColorTranslator]::FromHtml("#1c1e1d")
$borde = [System.Drawing.ColorTranslator]::FromHtml("#121413")

foreach ($size in 180, 192, 512) {
    $bmp = [Icono]::Crear($src, $size, $centro, $borde, 0.9, 0.08)
    $name = if ($size -eq 180) { "apple-touch-icon.png" } else { "icon-$size.png" }
    $bmp.Save((Join-Path $root "icons/$name"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "icons/$name"
}
$src.Dispose()
