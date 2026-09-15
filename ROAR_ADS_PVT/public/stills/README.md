# Add photos from the codebase

1. Put JPG/JPEG, PNG, WebP or AVIF photos in `frontend/public/stills/` (subfolders also work). Use web-optimised files with unique names.
2. Open `/manage`. Under **Our Story photos** or **Hero banners**, refresh **Photos from the codebase**.
3. Choose a file from the list and click **Use in Our Story** or **Add banner**.
4. The first three story photos appear in the collage: left, top right, bottom right. Use the arrow buttons to arrange them. Other photos remain saved in the editor but are not repeated in another public section.
5. Click **Save changes**. The selection is stored in MongoDB; files and default arrays alone do not overwrite saved owner content.

Alternatively, enter `/stills/your-photo.jpg` in the URL/path field, or upload an image with the existing upload control. Files in this folder are public; do not put private assets here.

Selecting an existing story photo moves it to the first position without duplicating it. Removing a photo from the editor does not delete its codebase file. Keep files in place while saved content references them.

The imported ZIP contains nine originals as `*-1600.jpg`, plus `*-640.jpg` thumbnail variants. The picker shows each photograph once. Custom local paths are served unchanged; resized variants are never guessed.