# Downpour

A minimalist emotional release journaling app.

## What is Downpour?

Downpour is a mobile-first PWA that lets you write down what's weighing on you, then watch it dissolve into rain. It's not about reflection - it's about release.

## Features

- **Two modes**: Light (280 chars) for quick vents, Heavy (600 chars) for deeper processing
- **Emotion tagging**: Optional tags to help you understand patterns
- **Release animation**: Watch your words dissolve and fade away
- **Archive**: A "puddle" where everything lands if you want to look back
- **Atmospheric audio**: Soft rain sounds that adapt to your mode
- **Offline-first**: Works completely offline using localStorage
- **PWA**: Installable on your phone, works like a native app

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Audio Files

The app requires audio files in `public/audio/`:

- `rain-light.mp3` - Soft, steady rain (loopable)
- `rain-heavy.mp3` - Heavier rain with distant thunder (loopable)
- `rain-archive.mp3` - Muffled, underwater-like rain (loopable)
- `release.mp3` - Soft chime/water drop sound (short)

### Recommended Sources

- **Pixabay**: https://pixabay.com/sound-effects/search/rain%20loop/
- **Mixkit**: https://mixkit.co/free-sound-effects/rain/

Download these files and place them in `public/audio/`. The files should be:
- MP3 format (or OGG)
- 20-30 seconds for ambient loops (seamless looping)
- Under 1MB each for fast loading
- Royalty-free / CC0 licensed

## App Icons

The app uses SVG icons in `public/icons/`. To generate PNG versions for the PWA manifest:

1. Use the SVG files as a base
2. Export to these sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
3. Tools you can use:
   - Online: https://cloudconvert.com/svg-to-png
   - Command line: `inkscape --export-type=png --export-filename=icon-192x192.png icon-192x192.svg`

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Tailwind CSS** - Utility-first CSS framework
- **vite-plugin-pwa** - PWA support with Workbox
- **Web Audio API** - For audio playback and crossfading

## Project Structure

```
downpour/
├── public/
│   ├── audio/           # Audio files (you need to add these)
│   └── icons/          # App icons (SVG files included)
├── src/
│   ├── components/      # Reusable components
│   ├── composables/    # Vue composables (logic reuse)
│   ├── views/         # Screen components
│   ├── App.vue        # Main app component
│   ├── main.js       # Entry point
│   ├── router.js      # Vue Router configuration
│   └── style.css     # Global styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Deployment

### PWA

The app is configured as a PWA. After building:

1. Upload the `dist/` folder to any static hosting service
2 - Vercel, Netlify, GitHub Pages, etc.
3. The service worker will handle offline functionality

### Play Store (Future)

To publish to the Google Play Store:

1. Ensure the PWA is live and working
2. Use **Bubblewrap CLI** to wrap the PWA as an Android App Bundle (.aab)
3. Create a Google Play Developer Console project
4. Upload the .aab file
5. Add screenshots and metadata
6. Submit for review

For more details: https://developers.google.com/codelabs/pwa-in-play

## Data Privacy

Downpour stores all data locally on your device using localStorage. No data is sent to any server. This means:
- Your entries are private and secure
- The app works completely offline
- You can clear your data at any time in Settings

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (PWA installable on iOS)

## License

This is a personal project. Audio files should be royalty-free/CC0 licensed.

## Contact

Built with ❤️ for emotional release.
