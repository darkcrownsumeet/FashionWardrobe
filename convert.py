import os
from PIL import Image

files = [
    r"d:\Fashion\FashionWardrobe\assets\img\wedding\Bandhgala Suit.png",
    r"d:\Fashion\FashionWardrobe\assets\img\casual\Beanie.png",
    r"d:\Fashion\FashionWardrobe\assets\img\casual\Casual Boots.png",
    r"d:\Fashion\FashionWardrobe\assets\img\party\Chelsea Boots.png",
    r"d:\Fashion\FashionWardrobe\assets\img\gym\Compression Shorts.png",
    r"d:\Fashion\FashionWardrobe\assets\img\gym\Male Gym Duffle Bag.png",
    r"d:\Fashion\FashionWardrobe\assets\img\formal\Laptop Bag.png",
    r"d:\Fashion\FashionWardrobe\assets\img\gym\Sports Slider.png",
    r"d:\Fashion\FashionWardrobe\assets\img\formal\Suit Vest.png",
    r"d:\Fashion\FashionWardrobe\assets\img\vacation\Swim Trunks.png",
    r"d:\Fashion\FashionWardrobe\assets\img\gym\Male Tank Top.png",
    r"d:\Fashion\FashionWardrobe\assets\img\formal\Male Trench Coat.png",
    r"d:\Fashion\FashionWardrobe\assets\img\wedding\Tuxedo Shirt.png",
    r"d:\Fashion\FashionWardrobe\assets\img\party\Velvet Blazer.webp",
    r"d:\Fashion\FashionWardrobe\assets\img\gym\Male Zip-Up Track Jacket.png"
]

for file in files:
    if os.path.exists(file):
        try:
            img = Image.open(file)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # Create a white background image
                bg = Image.new('RGB', img.size, (255, 255, 255))
                # Paste the image using the alpha channel as mask
                if img.mode == 'P':
                    img = img.convert('RGBA')
                bg.paste(img, mask=img.split()[3]) # 3 is the alpha channel
                img = bg
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            new_path = os.path.splitext(file)[0] + '.jpg'
            img.save(new_path, 'JPEG', quality=90)
            img.close()
            os.remove(file)
            print(f"Converted: {new_path}")
        except Exception as e:
            print(f"Error converting {file}: {e}")
    else:
        print(f"Not found: {file}")
