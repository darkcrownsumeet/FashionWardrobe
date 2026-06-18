Add-Type -AssemblyName System.Drawing

$files = @(
    "d:\Fashion\FashionWardrobe\assets\img\wedding\Bandhgala Suit.png",
    "d:\Fashion\FashionWardrobe\assets\img\casual\Beanie.png",
    "d:\Fashion\FashionWardrobe\assets\img\casual\Casual Boots.png",
    "d:\Fashion\FashionWardrobe\assets\img\party\Chelsea Boots.png",
    "d:\Fashion\FashionWardrobe\assets\img\gym\Compression Shorts.png",
    "d:\Fashion\FashionWardrobe\assets\img\gym\Male Gym Duffle Bag.png",
    "d:\Fashion\FashionWardrobe\assets\img\formal\Laptop Bag.png",
    "d:\Fashion\FashionWardrobe\assets\img\gym\Sports Slider.png",
    "d:\Fashion\FashionWardrobe\assets\img\formal\Suit Vest.png",
    "d:\Fashion\FashionWardrobe\assets\img\vacation\Swim Trunks.png",
    "d:\Fashion\FashionWardrobe\assets\img\gym\Male Tank Top.png",
    "d:\Fashion\FashionWardrobe\assets\img\formal\Male Trench Coat.png",
    "d:\Fashion\FashionWardrobe\assets\img\wedding\Tuxedo Shirt.png",
    "d:\Fashion\FashionWardrobe\assets\img\party\Velvet Blazer.webp",
    "d:\Fashion\FashionWardrobe\assets\img\gym\Male Zip-Up Track Jacket.png"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        try {
            $img = [System.Drawing.Image]::FromFile($file)
            
            $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
            $gfx = [System.Drawing.Graphics]::FromImage($bmp)
            $gfx.Clear([System.Drawing.Color]::White)
            $gfx.DrawImage($img, 0, 0, $img.Width, $img.Height)
            
            $newPath = $file -replace '\.(png|webp)$', '.jpg'
            $bmp.Save($newPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            
            $gfx.Dispose()
            $bmp.Dispose()
            $img.Dispose()
            
            Remove-Item $file -Force
            Write-Host "Converted: $newPath"
        } catch {
            Write-Host "Error converting $($file): $_"
        }
    } else {
        Write-Host "File not found: $file"
    }
}
