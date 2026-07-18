# ZzFXMicro vendored dependency

- Upstream: https://github.com/KilledByAPixel/ZzFX
- Version: 1.3.2
- License: MIT (`LICENSE`)
- File: `ZzFXMicro.min.js`

The vendored file has one compatibility-only adjustment: audio-context creation accepts both `AudioContext` and legacy `webkitAudioContext`, and safely leaves the context unavailable when neither exists. Villspor then uses its oscillator fallback without breaking page load.
