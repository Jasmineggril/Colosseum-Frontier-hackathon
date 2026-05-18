Place audio assets for the DreamVault experience here.

Recommended structure (create subfolders):

assets/sounds/
	ui/
		click.mp3
		hover.mp3
		transition.mp3
	cosmic/
		ambient-loop.mp3
	horror/
		ambient-loop.mp3
	fantasy/
		ambient-loop.mp3
	scifi/
		ambient-loop.mp3
	abstract/
		ambient-loop.mp3
	mythological/
		ambient-loop.mp3

Also recommended (optional):
	reveal-swell.mp3
	reveal-whoosh.mp3

Notes:
- Use short loopable ambient stems for the `ambient-loop.mp3` files (30s–3m). Keep them low-volume and unobtrusive.
- UI SFX should be short (<= 0.5s) and subtle.
- Files must be placed under `public/assets/sounds/...` so the app can load them at `/assets/sounds/...` URLs.

If assets are missing the audio system will fail gracefully — it will log warnings and fallback to localStorage-only persistence for dreams.

You can find royalty-free assets on freesound.org, zapsplat.com, or use original sound design.