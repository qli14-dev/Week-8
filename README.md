# 🍜 Dreamlike Restaurant Memory Scene

An immersive 3D interactive narrative experience that transports you back to a nostalgic childhood memory. Click a phone to play music and journey into a dreamlike restaurant where you once ate noodles as a child. Built with Three.js, this web-based experience combines beautiful visuals, smooth interactions, and a warm nostalgic atmosphere.

![Dreamlike Memory Scene](https://img.shields.io/badge/Three.js-r128-blue) ![Status](https://img.shields.io/badge/status-ready-green)

## ✨ Features

### Visual Experience
- **Dreamlike Restaurant**: A beautifully rendered restaurant with warm, golden lighting
- **Nostalgic Atmosphere**: Soft golden tones, glowing lanterns, and ethereal particle systems
- **Realistic Lighting**: Multiple light sources including overhead pendant lamps and ambient lighting
- **Steam Effects**: Gentle steam rising from hot noodle bowl
- **Warm Color Palette**: Golden tones and warm hues create a comforting memory-like ambiance
- **Background Tables**: Multiple tables in the background create depth and atmosphere

### Narrative Experience
- **Phone Introduction**: Click a phone displaying a music app to begin your journey
- **Smooth Transition**: Cinematic fade from the present (phone) into the memory (restaurant)
- **Memory Through Music**: The song triggers the transition into the dreamlike memory world

### Interactions
- **Interactive Phone**: Click the phone to play music and enter the memory
- **Clickable Noodles**: Click the noodle bowl to eat with smooth eating animations
- **Mouse-Based Camera**: Move your mouse left and right to explore the restaurant
- **Steam Particles**: Watch gentle steam rise from the hot noodles
- **Ambient Particles**: Golden light particles drift through the air
- **Ambient Animations**: Subtle breathing effects and gentle movements

### Audio (Optional)
- **Background Music**: Nostalgic melody that plays when entering the memory
- **Conversation Sounds**: Faint echoes of restaurant conversations
- **Eating Sounds**: Realistic eating sound effects
- **Transition Audio**: Smooth audio cues during scene changes

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (required for Three.js to load properly)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Week-8
   ```

2. **Start a local web server**

   **Option A: Using Python (recommended)**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

   **Option D: Using VS Code**
   - Install the "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Open your browser**
   - Navigate to `http://localhost:8000`
   - You should see the loading screen, followed by the letter introduction

## 🎮 How to Use

1. **Start**: Click the phone to play music and enter the memory world
2. **Transition**: Watch as you smoothly transition from the present into a dreamlike restaurant memory
3. **Look Around**: Move your mouse left and right to explore the restaurant
4. **Interact**: Click on the noodle bowl to eat the noodles
5. **Immerse**: Enjoy the steam effects, floating particles, gentle animations, and nostalgic atmosphere

## 🎵 Adding Audio (Optional)

The experience includes audio support for enhanced immersion. To add audio files:

1. Create four audio files in MP3 format:
   - `music.mp3` - Nostalgic background music that plays during the memory (2-3 minutes, looped)
   - `conversation.mp3` - Faint restaurant conversation ambience (2-3 minutes, looped)
   - `eating.mp3` - Eating/slurping noodle sounds (2-3 seconds)
   - `transition.mp3` - Gentle transition sound (3-5 seconds)

2. Place them in the root directory alongside `index.html`

3. **Recommended Audio**:
   - **Music**: Soft piano melody, nostalgic music box, or gentle acoustic guitar
   - **Conversation**: Muffled restaurant chatter, distant voices (low volume)
   - **Eating**: Noodle slurping, chopsticks clicking, gentle eating sounds
   - **Transition**: Soft whoosh, gentle chime, or dreamy sound effect

4. **Free Audio Resources**:
   - [Freesound.org](https://freesound.org)
   - [Free Music Archive](https://freemusicarchive.org)
   - [Incompetech](https://incompetech.com)
   - [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)

**Note**: The experience works perfectly without audio files. The application will gracefully handle missing audio.

## 📁 Project Structure

```
Week-8/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Three.js scene and interactions
├── README.md           # This file
└── (optional audio files)
    ├── music.mp3       # Background nostalgic music
    ├── conversation.mp3 # Restaurant ambient conversation
    ├── eating.mp3      # Eating sound effect
    └── transition.mp3  # Scene transition sound
```

## 🎨 Customization

### Changing Colors

Edit the color values in `app.js`:

```javascript
// Scene background
scene.background = new THREE.Color(0xffe4c4);

// Fog color
scene.fog = new THREE.Fog(0xffd4a3, 10, 50);

// Light colors
const sunLight = new THREE.DirectionalLight(0xffd89b, 1.5);
```

### Adjusting Camera Sensitivity

In `app.js`, modify these constants:

```javascript
const CAMERA_MOVE_SPEED = 0.02;      // How fast camera follows mouse
const MOUSE_SENSITIVITY = 0.0003;     // Mouse movement sensitivity
```

### Adding More Objects

You can add more interactive objects by:
1. Creating geometry and materials in a function
2. Adding `userData.clickable = true` to make it clickable
3. Handling clicks in the `onMouseClick` function

## 🛠️ Technical Details

### Technologies Used
- **Three.js r128**: 3D rendering and scene management
- **WebGL**: Hardware-accelerated 3D graphics
- **Web Audio API**: Sound management
- **CSS3**: Animations and transitions
- **Vanilla JavaScript**: No frameworks required

### Performance Optimizations
- Shadow map optimization with PCFSoftShadowMap
- Efficient particle system with BufferGeometry
- Tone mapping for better color reproduction
- Fog for depth perception and performance
- Device pixel ratio capping for mobile devices

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (reduced performance, touch support limited)

## 🎯 Features Breakdown

### 1. Phone Introduction
- Modern smartphone UI with music app
- Spinning vinyl record animation
- Pulsing play button with glow effects
- Smooth fade transition to 3D scene
- Floating animation creates dreamlike feel

### 2. 3D Restaurant Environment
- Wooden floor with warm brown tones
- Cream-colored walls
- Round main table with realistic materials
- Background tables create depth
- Red decorative lanterns
- Proper shadow casting and receiving

### 3. Lighting System
- **Ambient Light**: Warm golden base lighting
- **Overhead Light**: Central pendant lamp with subtle flicker
- **Side Lights**: Multiple point lights for atmosphere
- **Fill Light**: Directional light for softer shadows
- **Atmosphere Light**: Animated pulsing effect
- **Lantern Glow**: Emissive lanterns add warm accent lighting

### 4. Interactive Elements
- **Noodle Bowl**: Click to trigger eating animation
  - Bowl tilts slightly
  - Noodles shrink and rotate
  - Noodles automatically restore
  - Nostalgic message appears
- **Camera Control**: Smooth mouse-based movement
- **Steam Particles**: 100 rising steam particles from hot noodles
- **Ambient Particles**: 150 floating golden light particles

### 5. Visual Effects
- Dual particle systems (steam and ambient) with additive blending
- Realistic bowl and broth materials
- Curved noodle geometry using Bezier curves
- Chopsticks positioned beside the bowl
- Steam rising from hot noodles
- Decorative lanterns with emissive glow
- Subtle ambient animations throughout the scene

## 🐛 Troubleshooting

### Black Screen or Blank Page
- Make sure you're running a local web server
- Check browser console for errors (F12)
- Verify Three.js is loading from CDN

### Audio Not Playing
- Audio files are optional
- Check browser console for error messages
- Some browsers require user interaction before playing audio
- Ensure audio files are in the correct format (MP3)

### Poor Performance
- Try reducing particle counts in `app.js` (steam: line ~433, ambient: line ~476)
- Disable shadows by setting `renderer.shadowMap.enabled = false`
- Reduce shadow map resolution
- Reduce number of background tables

### Mouse Controls Not Working
- Wait for the scene to fully load
- Click the phone first to enter the scene
- Check if JavaScript is enabled

## 📱 Mobile Support

The experience is optimized for desktop but works on mobile devices with limitations:
- Touch support is basic (tap to interact)
- Camera controls use touch movement
- Performance may vary based on device
- Audio may require user interaction to start

## 🎓 Learning Resources

If you want to learn more about the technologies used:
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Credits

- **Three.js**: Amazing 3D library by Ricardo Cabello (mrdoob)
- **Inspiration**: Nostalgic memories of school days
- **Design**: Dreamlike aesthetics and warm color theory

## 🚀 Future Enhancements

Potential features to add:
- [ ] More interactive objects (tea cup, menu, plates, etc.)
- [ ] Multiple restaurant memories
- [ ] Other customers in the background
- [ ] VR support with WebXR
- [ ] Procedural audio generation
- [ ] Different times of day (lunch, dinner)
- [ ] Waiter/waitress character
- [ ] More food items
- [ ] Save/load camera positions
- [ ] Screenshot functionality
- [ ] Photo album mode

## 💬 Feedback

Enjoy exploring your memories! Feel free to customize and expand upon this experience.

---

**Made with ❤️ and nostalgia**
