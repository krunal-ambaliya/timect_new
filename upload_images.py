import os
import sys
from pathlib import Path
import json

# Try to load environment variables from a .env or .env.local file if python-dotenv is installed
try:
    from dotenv import load_dotenv
    # Load from project root .env or .env.local
    root_dir = Path(__file__).parent
    load_dotenv(root_dir / '.env')
    load_dotenv(root_dir / '.env.local')
except ImportError:
    pass

# Try to import the cloudinary library
try:
    import cloudinary
    import cloudinary.uploader
except ImportError:
    print("Error: The 'cloudinary' library is not installed.")
    print("Please install it by running the following command:")
    print("    pip install cloudinary python-dotenv")
    sys.exit(1)

def configure_cloudinary():
    # Attempt to read credentials from environment variables
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
    api_key = os.environ.get("CLOUDINARY_API_KEY")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET")

    # If not found in env, look at next.config or prompt/ask for user entry
    if not all([cloud_name, api_key, api_secret]):
        print("Cloudinary configuration not fully found in environment variables.")
        print("Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.")
        print("\nYou can also enter them manually now (press Enter to skip):")
        
        if not cloud_name:
            cloud_name = input("Cloud Name: ").strip()
        if not api_key:
            api_key = input("API Key: ").strip()
        if not api_secret:
            api_secret = input("API Secret: ").strip()

    if not all([cloud_name, api_key, api_secret]):
        print("\nError: Missing Cloudinary credentials. Cannot proceed with upload.")
        sys.exit(1)

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    print("Cloudinary configured successfully.")

def upload_images():
    # Base directories
    base_dir = Path(__file__).parent
    images_dir = base_dir / "public" / "images"

    if not images_dir.exists() or not images_dir.is_dir():
        print(f"Error: Public images directory '{images_dir}' not found.")
        sys.exit(1)

    # Supported image extensions
    image_extensions = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
    
    # Gather all image files
    image_files = []
    for file in images_dir.iterdir():
        if file.is_file() and file.suffix.lower() in image_extensions:
            image_files.append(file)

    if not image_files:
        print(f"No image files found in '{images_dir}'.")
        return

    print(f"Found {len(image_files)} images to upload to the 'timect' folder on Cloudinary.")

    mappings = {}
    success_count = 0
    failure_count = 0

    for i, file_path in enumerate(image_files, 1):
        # We will use the clean filename (without suffix) as the public_id,
        # but replace spaces and special characters with underscores to be safe.
        clean_name = file_path.stem.replace(" ", "_").replace("(", "").replace(")", "")
        
        print(f"[{i}/{len(image_files)}] Uploading {file_path.name}...")
        
        try:
            # Upload to Cloudinary under folder "timect"
            response = cloudinary.uploader.upload(
                str(file_path),
                folder="timect",
                public_id=clean_name,
                overwrite=True,
                resource_type="image"
            )
            
            # Retrieve secure URL
            cloudinary_url = response.get("secure_url")
            relative_local_path = f"/images/{file_path.name}"
            mappings[relative_local_path] = cloudinary_url
            
            print(f"   Success: {cloudinary_url}")
            success_count += 1
        except Exception as e:
            print(f"   Failed to upload {file_path.name}. Error: {e}")
            failure_count += 1

    # Save mapping file in src/data or root if src/data doesn't exist
    mapping_dir = base_dir / "src" / "data"
    if not mapping_dir.exists():
        mapping_dir = base_dir

    mapping_file = mapping_dir / "cloudinary_mapping.json"
    try:
        with open(mapping_file, "w", encoding="utf-8") as f:
            json.dump(mappings, f, indent=2)
        print(f"\nSaved image URL mappings to '{mapping_file.relative_to(base_dir)}'")
    except Exception as e:
        print(f"\nCould not save mapping file. Error: {e}")

    print("\nUpload Summary:")
    print(f"Total processed: {len(image_files)}")
    print(f"Successful uploads: {success_count}")
    print(f"Failed uploads: {failure_count}")

if __name__ == "__main__":
    configure_cloudinary()
    upload_images()
