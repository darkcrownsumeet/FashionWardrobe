Add-Type -AssemblyName System.Drawing
$srcPath = "d:\Fashion\FashionWardrobe\assets\img\styles\style_male_wedding_traditional.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)
$rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 3100)
$cropped = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $cropped.Width, $cropped.Height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$img.Dispose()
$cropped.Save($srcPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Dispose()
