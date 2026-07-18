# ZzFXMicro vendored dependency

- Upstream: https://github.com/KilledByAPixel/ZzFX
- Version: 1.3.2
- License: MIT (`LICENSE`)
- File: `ZzFXMicro.min.js`

The vendored file has one compatibility-only adjustment: the audio context is created lazily on first playback, accepts both `AudioContext` and legacy `webkitAudioContext`, and remains unavailable when neither exists. Villspor handles resume failures and then uses its oscillator fallback without breaking page load.
