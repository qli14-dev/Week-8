# 🌊 Seaside Sunset - A Dreamlike Escape

An immersive 3D interactive beach experience that transports you to a peaceful seaside sunset. Built with Three.js, this web-based experience combines stunning visuals, gentle wave animations, and a tranquil atmosphere that makes you feel like you're resting by the ocean.

![Seaside Sunset Scene](https://img.shields.io/badge/Three.js-r128-blue) ![Status](https://img.shields.io/badge/status-ready-green)

## ✨ Features

### Visual Experience
- **Dreamlike Beach Scene**: A beautifully rendered beach with golden sand and gentle waves
- **Sunset Atmosphere**: Warm golden and purple hues create a magical sunset ambiance
- **Animated Ocean Waves**: Realistic wave animations with multiple wave patterns
- **Character on Beach**: A peaceful figure lying on the sand, watching the horizon
- **Drifting Clouds**: Soft, golden clouds slowly moving across the sunset sky
- **Flying Seagulls**: Animated birds gracefully soaring over the ocean
- **Golden Sun**: A glowing sun on the horizon with pulsing atmospheric effects
- **Particle System**: Floating particles simulate ocean breeze and atmosphere

### Interactions
- **Seashell Trigger**: Click a beautiful seashell to begin your journey to the beach
- **Ocean Wave Sounds**: Procedurally generated ocean ambience using Web Audio API
- **Mouse-Based Camera**: Move your mouse to look around the beach and ocean
- **Smooth Transitions**: Elegant fade effects between screens
- **Ambient Animations**: Breathing character, pulsing sun, and flowing waves

### Audio
- **Ocean Waves**: Realistic wave sounds generated using oscillators
- **Seashell Sound**: Initial ocean sound when clicking the seashell
- **Dynamic Audio**: Wave sounds that modulate for a natural ocean ambience

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
   - You should see the loading screen, followed by the seashell introduction

## 🎮 How to Use

1. **Start**: Click the pink seashell to enter the beach scene
2. **Listen**: Hear the ocean waves as they wash ashore
3. **Look Around**: Move your mouse to explore the beach, ocean, and sunset sky
4. **Relax**: Watch the character lying on the sand, clouds drifting, and waves rolling
5. **Immerse**: Let the warm sunset colors and gentle sounds transport you

## 📁 Project Structure

```
Week-8/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Three.js scene and interactions
├── README.md           # This file
└── package.json        # Project metadata
```

## 🎨 Scene Elements

### 1. Seashell Introduction
- Beautiful animated seashell with spiral design
- Pink and coral gradient colors
- Floating and pulsing animations
- Glowing atmospheric effects
- Sunset gradient background

### 2. Beach Environment
- **Sand**: Procedurally generated terrain with gentle dunes
- **Pebbles**: Scattered stones for natural detail
- **Warm Colors**: Sandy brown tones with golden highlights
- **Shadows**: Realistic shadow casting from the character and objects

### 3. Ocean with Animated Waves
- **Wave Animation**: Multi-layered sine wave patterns
- **Realistic Motion**: Waves that roll and crest naturally
- **Reflective Water**: Physically-based material with metallic reflections
- **Transparency**: Semi-transparent water shows depth
- **Continuous Movement**: Waves that never stop flowing

### 4. Character
- Lying peacefully on the sand
- Made from capsule and sphere geometries
- Subtle breathing animation
- Casts shadows on the beach
- Positioned to watch the sunset horizon

### 5. Sunset Sky
- **Gradient Sky**: Shader-based sky transitioning from purple to orange
- **Glowing Sun**: Golden sun sphere on the horizon
- **Sun Glow**: Pink atmospheric glow around the sun
- **Animated Movement**: Subtle sun position changes
- **Fog Effect**: Atmospheric perspective with sunset-colored fog

### 6. Clouds
- 15 unique cloud formations
- Made from clustered spheres
- Semi-transparent with golden sunset tint
- Drift slowly across the sky
- Subtle vertical bobbing motion

### 7. Seagulls
- Simple bird shapes with wings
- Animated wing flapping
- Follow curved flight paths
- Wrap around for continuous presence
- White coloring stands out against sunset

### 8. Lighting System
- **Ambient Light**: Warm orange base lighting
- **Sun Light**: Golden directional light with shadows
- **Hemisphere Light**: Natural sky-to-ground gradient
- **Horizon Light**: Pink glow from the sunset
- **Rim Light**: Purple accent for depth
- **Atmosphere Light**: Animated pulsing ambient light

### 9. Particle System
- 300 floating particles
- Simulate dust and ocean mist
- Golden color matching the sunset
- Wrap around for continuous effect
- Gentle movement suggesting ocean breeze

## 🛠️ Technical Details

### Technologies Used
- **Three.js r128**: 3D rendering and scene management
- **WebGL**: Hardware-accelerated 3D graphics
- **Web Audio API**: Procedural ocean sound generation
- **GLSL Shaders**: Custom sky gradient shader
- **CSS3**: Animations and transitions
- **Vanilla JavaScript**: No frameworks required

### Advanced Features
- **Wave Simulation**: Multi-frequency sine waves for realistic ocean motion
- **Procedural Audio**: Real-time ocean wave sound synthesis
- **Custom Shaders**: Sky gradient using vertex and fragment shaders
- **Physical Materials**: PBR materials for realistic water and surfaces
- **Tone Mapping**: ACES Filmic tone mapping for beautiful colors
- **Shadow Mapping**: PCF soft shadows for realistic depth

### Performance Optimizations
- Efficient geometry with appropriate polygon counts
- BufferGeometry for particles
- Shadow map optimization
- Fog for atmospheric depth and performance
- Device pixel ratio capping for mobile
- Geometry instancing where applicable

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (reduced performance, basic touch support)

## 🎯 Customization

### Changing Sunset Colors

Edit colors in `app.js`:

```javascript
// Sky gradient
topColor: { value: new THREE.Color(0xa855f7) }     // Purple sky
bottomColor: { value: new THREE.Color(0xff9a56) }  // Orange horizon

// Sun color
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });

// Ocean color
const oceanMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1e90ff });
```

### Adjusting Wave Animation

In `app.js`, modify these constants:

```javascript
const WAVE_SPEED = 0.5;      // Speed of wave animation
const WAVE_HEIGHT = 0.3;     // Height of waves
```

### Camera Control

Adjust camera sensitivity:

```javascript
const CAMERA_MOVE_SPEED = 0.015;     // How fast camera follows mouse
targetCameraX = mouseX * 2;           // Horizontal movement range
targetCameraY = mouseY * 0.5;         // Vertical movement range
```

### Adding More Elements

You can expand the scene by:
1. Adding more beach objects (rocks, shells, driftwood)
2. Creating additional characters or animals
3. Adding a pier or boat in the distance
4. Including beach vegetation (palm trees, grass)
5. Creating tide pools with reflections

## 🐛 Troubleshooting

### Black Screen or Blank Page
- Make sure you're running a local web server
- Check browser console for errors (F12)
- Verify Three.js is loading from CDN
- Try a different browser

### Audio Not Playing
- Some browsers block audio until user interaction
- Check browser console for Web Audio API errors
- Try clicking the seashell again
- Ensure your browser supports Web Audio API

### Poor Performance
- Reduce particle count in `app.js` (line 476)
- Lower ocean geometry resolution (line 269)
- Disable shadows: `renderer.shadowMap.enabled = false`
- Reduce number of clouds or seagulls

### Waves Not Animating
- Check that `isSceneActive` is true
- Ensure the animation loop is running
- Look for JavaScript errors in console

### Camera Not Moving
- Wait for scene to fully load
- Click the seashell first to enter the scene
- Move mouse more dramatically
- Check if JavaScript is enabled

## 📱 Mobile Support

The experience works on mobile devices with some limitations:
- Touch movement controls the camera
- Tap the seashell to start
- Performance depends on device capabilities
- Audio may require user interaction
- Best viewed in landscape orientation

## 🎓 Learning Resources

Learn more about the technologies:
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [GLSL Shader Tutorial](https://thebookofshaders.com/)

## 🌊 Scene Details

### Wave Physics
The ocean uses a combination of sine and cosine waves at different frequencies to create realistic water motion:

```javascript
const wave1 = Math.sin(x * 0.1 + time * WAVE_SPEED) * WAVE_HEIGHT;
const wave2 = Math.cos(y * 0.15 + time * WAVE_SPEED * 0.7) * WAVE_HEIGHT * 0.5;
const wave3 = Math.sin((x + y) * 0.08 + time * WAVE_SPEED * 1.3) * WAVE_HEIGHT * 0.3;
```

### Audio Synthesis
Ocean sounds are created using multiple oscillators with modulating frequencies:

```javascript
// Creates rich, layered ocean ambience
oscillator.frequency.value = 50 + index * 30 + Math.sin(time * 0.5 + index) * 10;
```

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Credits

- **Three.js**: Amazing 3D library by Ricardo Cabello (mrdoob)
- **Inspiration**: The peaceful beauty of seaside sunsets
- **Design**: Warm sunset color theory and dreamlike aesthetics
- **Audio**: Procedural sound generation techniques

## 🚀 Future Enhancements

Potential features to add:
- [ ] Interactive shells and starfish on the beach
- [ ] Tide animation (water moving in and out)
- [ ] Beach bonfire with particle effects
- [ ] Footprints in the sand
- [ ] More detailed character with swimming animation
- [ ] Underwater view transition
- [ ] Night mode with moon and stars
- [ ] Multiple beach locations
- [ ] VR support with WebXR
- [ ] Screenshot/photo mode
- [ ] Weather variations (clear, cloudy, stormy)
- [ ] Time-of-day transitions

## 💬 Feedback

Enjoy your dreamlike escape to the seaside! Feel free to customize and expand upon this peaceful experience.

---

**Made with 🌊 and peaceful vibes**
