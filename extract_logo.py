from PIL import Image
import os

source_path = "/home/beebayk/.gemini/antigravity/brain/4b00bc80-0922-42f5-89da-9c84169cc3e1/uploaded_media_1769612471441.jpg"
public_dir = "/home/beebayk/hrpagent/event-landing/public"

if not os.path.exists(source_path):
    print(f"Error: Source file not found: {source_path}")
    exit(1)

try:
    img = Image.open(source_path)
    # The logo is in the top left.
    # Estimated crop: 0,0 to 150, 150 (approx based on image usage)
    # Actually, let's take a safe 200x200 square from top left as a starting point 
    # and maybe process it.
    # Given I can't interactively view, I'll take a reasonable 120x120 crop from top-left offset.
    # The image is a full page screenshot. The logo is likely small top-left.
    # Let's guess top-left 25px offset, 110x110 size.
    
    # Or safer: Grab top-left 250x150 region.
    logo_crop = img.crop((40, 40, 150, 150)) # Very rough guess based on typical UI padding
    
    logo_path = os.path.join(public_dir, "logo.png")
    favicon_path = os.path.join(public_dir, "favicon.ico")

    logo_crop.save(logo_path)
    logo_crop.resize((32, 32)).save(favicon_path)
    
    print(f"Saved logo to {logo_path}")
    print(f"Saved favicon to {favicon_path}")

except Exception as e:
    print(f"Error processing image: {e}")
