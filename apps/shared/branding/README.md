# Shared branding

One icon set for the whole site. The homepage manifest, the PWA install prompt
and every mini app's favicon all point here, so the logo changes in one place.

`build-combined.js` copies this folder to `dist/branding/`, and the root Vite
dev server serves it at the same path, so `/branding/...` resolves the same way
in development and in the deployed site.

| File | Used for |
| --- | --- |
| `icon-192.png`, `icon-512.png` | Web app manifest (`purpose: any`) |
| `icon-192-maskable.png`, `icon-512-maskable.png` | Manifest `purpose: maskable` — Android/Fire OS launcher |
| `apple-touch-icon.png` (180) | iOS/iPadOS home screen |
| `favicon-32.png`, `favicon-64.png` | Browser tabs, in every app |

## Regenerating

Master artwork: `assets/logo/logo-master.png` (1024x1024, opaque `#51A2B2`
background). Replace that file and re-run the generator to change the logo
everywhere.

The maskable variants inset the artwork to 86% on a solid background. Android
masks the icon to a circle of 80% diameter and crops whatever falls outside, so
a full-bleed version would lose the top of the hair and the chin.

There is no image library in this workspace, so the icons were produced with
System.Drawing via PowerShell (Windows). Run from the repo root:

```powershell
Add-Type -AssemblyName System.Drawing
$src = "assets\logo\logo-master.png"; $out = "apps\shared\branding"
$master = [System.Drawing.Image]::FromFile((Resolve-Path $src))
$bg = [System.Drawing.ColorTranslator]::FromHtml("#51A2B2")
function New-Icon($size, $scale, $name) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear($bg)
  $inner = [int][math]::Round($size * $scale); $off = [int][math]::Round(($size - $inner) / 2)
  $g.DrawImage($master, $off, $off, $inner, $inner); $g.Dispose()
  $bmp.Save((Join-Path (Resolve-Path $out) $name), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
New-Icon 192 1.0 "icon-192.png";  New-Icon 512 1.0 "icon-512.png"
New-Icon 180 1.0 "apple-touch-icon.png"
New-Icon 32  1.0 "favicon-32.png"; New-Icon 64 1.0 "favicon-64.png"
New-Icon 192 0.86 "icon-192-maskable.png"; New-Icon 512 0.86 "icon-512-maskable.png"
$master.Dispose()
```

If the background colour of the master changes, update `$bg` here to match, so
the maskable variants keep bleeding to the edges.

The manifest's `background_color` deliberately does *not* follow the icon: it
is the homepage's own dark navy, so the launch splash fades straight into the
app instead of flashing teal first.
