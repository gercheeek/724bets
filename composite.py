from PIL import Image, ImageEnhance, ImageFilter

# Load background
bg = Image.open('public/images/casino_neon_bg.jpg').convert('RGBA')

# Load foreground (Haluk Levent)
fg = Image.open('public/images/haluk_fixed.png').convert('RGBA')

# Calculate sizes
bg_w, bg_h = bg.size

# We want Haluk to be about 85% of the height of the background
target_fg_h = int(bg_h * 0.95)
ratio = target_fg_h / fg.size[1]
target_fg_w = int(fg.size[0] * ratio)

fg = fg.resize((target_fg_w, target_fg_h), Image.Resampling.LANCZOS)

# Position: align right, slightly above bottom
# Let's put him on the right side.
offset_x = bg_w - target_fg_w - 50 # 50px from right
offset_y = bg_h - target_fg_h

# Create a drop shadow for better blending
shadow = Image.new('RGBA', fg.size, (0, 0, 0, 0))
# Copy alpha channel from fg
shadow.putalpha(fg.getchannel('A'))
# Darken shadow
shadow_enhancer = ImageEnhance.Brightness(shadow)
shadow = shadow_enhancer.enhance(0.0)
# Blur shadow
shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))

# Create a composite layer
composite = Image.new('RGBA', bg.size, (0, 0, 0, 0))
composite.paste(bg, (0, 0))

# Paste shadow with slight offset
composite.paste(shadow, (offset_x - 10, offset_y + 10), shadow)

# Paste foreground
composite.paste(fg, (offset_x, offset_y), fg)

# Add a slight green vignette/gradient on the left so text pops
# We can skip complex gradients and just save the image
final = composite.convert('RGB')
final.save('public/images/haluk_slider_final.jpg', quality=95)
print("Composite created successfully!")
