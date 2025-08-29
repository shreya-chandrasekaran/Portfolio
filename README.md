# Shreya CAD Portfolio — with Videos & Photos

This starter supports:
- Interactive 3D models (`.glb`) via `<model-viewer>`
- Project **videos** (HTML5 `<video>`) in modals
- **Photo galleries** in modals

## Where to put files
- 3D models: `/models`
  - `camera_clip_prototype.glb`
  - `camera_clip_conceptA.glb`
  - `camera_clip_conceptB.glb`
  - `shopping_cart.glb`
  - `art_centre_gallery.glb` (optional)
- Images: `/img`
  - Posters/thumbnails: `*_poster.jpg`
  - Camera clip photos: `camera_clip_photo1.jpg`, `camera_clip_photo2.jpg`, etc.
  - Piano cover: `piano_cover.jpg`
- Videos: `/media`
  - `camera_clip_motion.mp4` (Fusion motion study)
  - `mini_piano_demo.mp4`

## Add/replace content
- Edit `index.html`. Each project card has 2–3 bullet points already—replace with yours.
- To add/remove photos in the camera clip modal, add/remove `<img>` lines in the `gallery-grid`.
- To replace videos, keep the filenames or update the `<source src="...">` path.

## Video format & size tips
- Use **MP4 (H.264 video + AAC audio)** for widest browser support.
- Keep each file under **~100 MB** to avoid push rejections; GitHub warns above 50 MB and rejects pushes above 100 MB. Larger assets can use **Git LFS** or an external host (YouTube unlisted) if needed.
- If your video is big, compress to 720p with a tool like **HandBrake** or `ffmpeg`:
  - HandBrake: Preset “Fast 720p30”
  - ffmpeg: `ffmpeg -i input.mov -vf scale=-2:720 -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k output.mp4`

## Go live
1. Create a GitHub repo (e.g., `shreya-portfolio`).
2. Upload all files (drag‑drop via browser is OK for files <=25 MB; use Desktop app or CLI for larger).
3. Repo **Settings → Pages → Deploy from a branch → main** → Save.
4. Share: `https://<your-username>.github.io/<repo-name>/`.

## Notes
- GitHub Pages published site must be **≤1 GB** total; bandwidth soft limit **100 GB/month**.
- If videos are heavy or you expect lots of views, consider hosting videos on **YouTube (unlisted)** and embedding with an `<iframe>` instead of storing large MP4s in the repo.
