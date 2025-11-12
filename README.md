# 🌟 Dreamlike Memory Scene

An immersive 3D interactive experience that transports you back to a nostalgic high school memory. Built with Three.js, this web-based experience combines beautiful visuals, smooth interactions, and a dreamlike atmosphere.

![Dreamlike Memory Scene](https://img.shields.io/badge/Three.js-r128-blue) ![Status](https://img.shields.io/badge/status-ready-green)

## ✨ Features

### Visual Experience
- **Nostalgic 3D Classroom**: A beautifully rendered classroom with warm, golden lighting
- **Dreamlike Atmosphere**: Soft pastels, glowing effects, and ethereal particle systems
- **Realistic Lighting**: Multiple light sources including golden sunlight streaming through windows
- **Subtle Reflections**: Physically-based materials with realistic glass and water effects
- **Warm Color Palette**: Pastel tones and soft golden hues create a memory-like ambiance

### Interactions
- **Letter Introduction**: Click an old letter to enter the memory world
- **Interactive Water Glass**: Click the desk to drink water with smooth animations
- **Mouse-Based Camera**: Move your mouse left and right to explore the classroom
- **Floating Particles**: Watch light particles drift through the air
- **Ambient Animations**: Subtle breathing effects and gentle movements

### Audio (Optional)
- **Ambient Soundscape**: Continuous background atmosphere
- **Water Sounds**: Realistic drinking sound effects
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

1. **Start**: Click the old letter to enter the memory world
2. **Look Around**: Move your mouse left and right to explore the classroom
3. **Interact**: Click on the water glass on the desk to drink water
4. **Immerse**: Enjoy the floating particles, gentle animations, and nostalgic atmosphere

## 🎵 Adding Audio (Optional)

The experience includes audio support for enhanced immersion. To add audio files:

1. Create three audio files in MP3 format:
   - `ambient.mp3` - Soft ambient background music or nature sounds (2-3 minutes, looped)
   - `water.mp3` - Water drinking sound effect (2-3 seconds)
   - `transition.mp3` - Gentle transition sound (3-5 seconds)

2. Place them in the root directory alongside `index.html`

3. **Recommended Audio**:
   - **Ambient**: Soft piano, gentle rain, or classroom ambience
   - **Water**: Glass clink and liquid drinking sounds
   - **Transition**: Soft whoosh or gentle chime

4. **Free Audio Resources**:
   - [Freesound.org](https://freesound.org)
   - [Free Music Archive](https://freemusicarchive.org)
   - [Incompetech](https://incompetech.com)

**Note**: The experience works perfectly without audio files. The application will gracefully handle missing audio.

## 📁 Project Structure

```
Week-8/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Three.js scene and interactions
├── README.md           # This file
└── (optional audio files)
    ├── ambient.mp3     # Background ambient sound
    ├── water.mp3       # Water drinking sound
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

### 1. Letter Introduction
- Elegant typography with serif fonts
- Floating animation with glow effects
- Smooth fade transition to 3D scene
- Poetic content that sets the mood

### 2. 3D Classroom Environment
- Wooden floor with realistic materials
- Cream-colored walls
- Chalkboard on the back wall
- Three windows with golden sunlight
- Proper shadow casting and receiving

### 3. Lighting System
- **Ambient Light**: Soft warm base lighting
- **Sun Light**: Directional light with shadows
- **Fill Light**: Point light for softer shadows
- **Rim Light**: Adds depth and dimension
- **Atmosphere Light**: Animated pulsing effect

### 4. Interactive Elements
- **Water Glass**: Click to trigger drinking animation
  - Glass lifts up
  - Water level decreases
  - Glass returns to desk
  - Water automatically refills
- **Camera Control**: Smooth mouse-based movement
- **Particle System**: 200 floating light particles

### 5. Visual Effects
- Particle system with additive blending
- Realistic glass materials with transmission
- Water with transparency and refraction
- Window light rays
- Subtle ambient animations

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
- Try reducing particle count in `app.js` (line ~308)
- Disable shadows by setting `renderer.shadowMap.enabled = false`
- Reduce shadow map resolution

### Mouse Controls Not Working
- Wait for the scene to fully load
- Click the letter first to enter the scene
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
- [ ] More interactive objects (books, pencils, etc.)
- [ ] Multiple classroom scenes
- [ ] VR support with WebXR
- [ ] Procedural audio generation
- [ ] Seasonal variations
- [ ] Student desk interactions
- [ ] Time of day changes
- [ ] Save/load camera positions
- [ ] Screenshot functionality

## 💬 Feedback

Enjoy exploring your memories! Feel free to customize and expand upon this experience.

---

**Made with ❤️ and nostalgia**
