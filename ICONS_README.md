# App Icons

## Desktop App Icons

The desktop app can use custom icons for different platforms:

- **Windows**: `frontend/public/icon.ico` (256x256 or multi-size .ico)
- **macOS**: `frontend/public/icon.icns` (512x512@2x)
- **Linux**: `frontend/public/icon.png` (512x512 PNG)

## Creating Icons

### From a PNG Image

If you have a logo or image (recommended 1024x1024 PNG):

#### 1. Create Windows .ico
Use an online converter or ImageMagick:
```bash
# Using ImageMagick
convert logo.png -define icon:auto-resize=256,128,64,48,32,16 frontend/public/icon.ico
```

#### 2. Create macOS .icns
Use online converter or iconutil (macOS only):
```bash
# Create iconset folder
mkdir MyIcon.iconset
sips -z 16 16     logo.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     logo.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     logo.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     logo.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   logo.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   logo.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   logo.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   logo.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   logo.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 logo.png --out MyIcon.iconset/icon_512x512@2x.png

# Create icns file
iconutil -c icns MyIcon.iconset -o frontend/public/icon.icns
```

#### 3. Create Linux PNG
Simple copy or resize:
```bash
cp logo.png frontend/public/icon.png
# or resize to 512x512
convert logo.png -resize 512x512 frontend/public/icon.png
```

## Default Behavior

If no icon files are found, Electron will use its default icon.

## Icon Guidelines

### Racing Car Manager Logo Suggestions

For a racing car management app, consider:
- Race car silhouette
- Checkered flag
- Steering wheel
- Racing helmet
- Combination of racing elements

### Design Requirements
- **Simplicity**: Clear at small sizes (16x16)
- **Contrast**: Works on both light and dark backgrounds
- **Brand**: Represents racing/motorsport
- **Professional**: Clean, modern design

### Recommended Tools
- **Vector**: Adobe Illustrator, Inkscape (free)
- **Raster**: Adobe Photoshop, GIMP (free)
- **Online**: Canva, Figma

## Quick Icon Creation Services

### Free Online Tools
- [ICO Convert](https://icoconvert.com/) - Convert PNG to ICO
- [CloudConvert](https://cloudconvert.com/png-to-icns) - Convert PNG to ICNS
- [Favicon.io](https://favicon.io/) - Generate icons from text/emoji

### Professional Services
- [Fiverr](https://www.fiverr.com/) - Hire a designer
- [99designs](https://99designs.com/) - Logo design contests

## Temporary Solution

Until custom icons are created, you can use emoji or text-based icons:

### Racing-themed Emojis
- 🏎️ Race car
- 🏁 Checkered flag
- 🏆 Trophy

Convert emoji to PNG using services like:
- [Emoji to PNG](https://emojitopng.com/)

Then follow the icon creation steps above.

## Icon Sizes Reference

### Windows (.ico)
- 256x256 (primary)
- 128x128
- 64x64
- 48x48
- 32x32
- 16x16

### macOS (.icns)
- 512x512@2x (1024x1024)
- 512x512
- 256x256@2x (512x512)
- 256x256
- 128x128@2x (256x256)
- 128x128
- 32x32@2x (64x64)
- 32x32
- 16x16@2x (32x32)
- 16x16

### Linux (.png)
- 512x512 (recommended)
- Transparency supported
