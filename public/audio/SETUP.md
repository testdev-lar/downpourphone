# Audio Setup Guide

## Quick Start

1. Download the following MP3 files and place them in this directory:

   ```
   rain-light.mp3     - Soft, steady rain (loopable, ~20-30s)
   rain-heavy.mp3     - Heavy rain with distant thunder (loopable, ~20-30s)
   rain-archive.mp3   - Muffled, underwater rain (loopable, ~20-30s)
   release.mp3        - Soft chime/water drop sound (~1-2s)
   ```

2. Recommended sources (all free/royalty-free):
   - Pixabay: https://pixabay.com/sound-effects/search/rain%20loop/
   - Mixkit: https://mixkit.co/free-sound-effects/rain/

3. Test the app:
   ```bash
   npm run dev
   ```

## Audio File Requirements

### Format
- MP3 (preferred) or OGG
- Bitrate: 128-256 kbps
- Sample rate: 44.1kHz or 48kHz

### Ambient Files (rain-light, rain-heavy, rain-archive)
- Duration: 20-30 seconds
- Seamless loop (start and end should match)
- Volume: Low (ambient background, not distracting)
- File size: Under 500KB each

### Release Sound (release.mp3)
- Duration: 1-2 seconds
- Short and subtle
- File size: Under 100KB

## Where to Download

### Option 1: Pixabay (Recommended - No Attribution)
1. Visit: https://pixabay.com/sound-effects/search/rain%20loop/
2. Filter by: Duration 30s - 2mins
3. Download:
   - "Light Rain" for rain-light.mp3
   - "Heavy Rain" or "Storm" for rain-heavy.mp3
   - "Calm Rain" for rain-archive.mp3
   - Search for "water drop" or "chime" for release.mp3

### Option 2: Mixkit (Free for Commercial Use)
1. Visit: https://mixkit.co/free-sound-effects/rain/
2. Download:
   - "Light rain loop" (15s) for rain-light.mp3
   - "Rain and thunder storm" (29s) for rain-heavy.mp3
   - "Rain long loop" (57s) for rain-archive.mp3
   - Search for "water drop" for release.mp3

### Option 3: Generate with AI (Alternative)
Use AI music generators like:
- Suno AI
- Udio
- AudioLDM

Prompt suggestions:
- "ambient rain sound, loopable, soft, gentle, 30 seconds"
- "heavy rain with distant thunder, atmospheric, loopable, 30 seconds"
- "underwater muffled rain, deep, calm, loopable, 30 seconds"
- "soft water drop sound, gentle, 1 second"

## Testing Audio Files

Before using in the app, verify:

1. **Loop Seamlessness**
   - Open in audio player
   - Enable repeat/loop
   - Listen for clicks or pops at loop point
   - Start and end should blend perfectly

2. **Volume Levels**
   - All three ambient tracks should have similar volume
   - Not too loud (this is background ambience)
   - Release sound should be slightly louder but still subtle

3. **Consistency**
   - All rain sounds should feel like the same "world"
   - Light, heavy, and archive should be variations, not completely different styles

## Placeholder Testing

If you want to test the app without audio files:
- The app will gracefully handle missing audio files
- Audio controls will still be visible
- No errors will occur

## Troubleshooting

### Audio not playing?
- Check file format (must be MP3 or OGG)
- Check file size (too large may cause issues)
- Check browser console for errors
- Ensure files are in correct directory: `public/audio/`

### Audio sounds distorted?
- Check bitrate (try 128kbps or 192kbps)
- Re-download from source
- Try different audio files

### Loop has click/pop?
- Try different audio file
- Some loops are better than others
- Use audio editing software to trim start/end for perfect loop

## File Checklist

- [ ] rain-light.mp3 downloaded
- [ ] rain-heavy.mp3 downloaded
- [ ] rain-archive.mp3 downloaded
- [ ] release.mp3 downloaded
- [ ] All files tested for seamless looping
- [ ] Volume levels are appropriate
- [ ] Files placed in `public/audio/` directory

## Support

If you need help finding audio files, check the README.md in the project root for more resources.
