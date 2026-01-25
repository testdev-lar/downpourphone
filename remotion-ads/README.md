# Downpour Social Media Ads

Remotion-powered video ads for the Downpour emotional release journaling app.

## Getting Started

```bash
# Install dependencies
npm install

# Open the Remotion Studio (visual preview)
npm start
```

This will open [http://localhost:3000](http://localhost:3000) where you can preview and edit your videos.

## Available Compositions

| ID | Duration | Description |
|----|----------|-------------|
| `DownpourAd` | 15 seconds | Full ad with complete journey |
| `DownpourTeaser` | 6 seconds | Quick teaser version |
| `DownpourStory` | 10 seconds | Instagram/TikTok Story format |

All compositions are **1080x1920** (9:16 vertical) for Instagram Reels / TikTok.

## Rendering Videos

```bash
# Render main ad as MP4
npx remotion render DownpourAd out/downpour-ad.mp4

# Render teaser
npx remotion render DownpourTeaser out/downpour-teaser.mp4

# Render as GIF (for previews)
npx remotion render DownpourAd out/downpour-ad.gif --image-format=png
```

## Customization

### Edit Text Content
Open `src/DownpourAd.tsx` to modify:
- Tagline text
- Example journal entry
- Call-to-action URL

### Edit Timing
The timeline is in frames (30fps):
- 0-90: Logo intro
- 90-150: Tagline
- 150-240: Journal entry dissolves
- 240-360: Sky clears
- 360-450: Final message + CTA

### Color Palette
Colors are defined in `src/components/Sky.tsx` matching Downpour's theme:
- Stormy: `#1a1d23`, `#232730`, `#2d333b`
- Clear: `#60a5fa`, `#93c5fd`, `#fef3c7`
- Accent: `#a8b5c9`

## Structure

```
src/
├── DownpourAd.tsx      # Main composition
├── Root.tsx            # Remotion entry point
├── index.ts            # Register compositions
└── components/
    ├── Rain.tsx        # Animated raindrops
    ├── Lightning.tsx   # Lightning flash effect
    ├── Sky.tsx         # Gradient sky background
    ├── Mountains.tsx   # Silhouette mountains
    ├── Logo.tsx        # Downpour cloud icon
    ├── TextReveal.tsx  # Animated text
    └── DissolveCard.tsx # Journal entry that fades
```
