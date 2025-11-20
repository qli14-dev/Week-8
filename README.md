# 🎭 Family Choice – Interactive 3D Narrative

A choice-driven immersive 3D experience where your decisions shape completely different emotional worlds. Built with Three.js, this interactive narrative explores the profound impact of choosing communication versus solitude during a family conflict.

![Three.js](https://img.shields.io/badge/Three.js-r128-blue) ![Status](https://img.shields.io/badge/status-complete-green) ![Interactive](https://img.shields.io/badge/type-interactive%20narrative-purple)

## ✨ Overview

**Family Choice** is an emotional 3D journey that begins in a tense living room during a family argument. You're presented with two choices that lead to dramatically different worlds:

- **COMMUNICATE** → A warm, forgiving family reunion filled with golden light
- **LEAVE** → A lonely journey through a dark futuristic city at night

Each path features unique:
- 3D environments and atmospheres
- Interactive elements
- Emotional tones
- Visual effects
- Soundscapes

## 🌍 The Three Worlds

### 1. **The Argument** (Opening Scene)
A dim, tense living room where emotions run high:
- Flickering overhead lights
- Dark, muted colors (grays and blues)
- Shaking objects reflecting emotional turbulence
- Silhouetted family members
- Heavy, oppressive atmosphere
- Two glowing choice buttons appear after 3 seconds

### 2. **COMMUNICATE** (Warm Ending)
Choose to stay and talk. Transform into a bright, healing moment:
- **Visual Atmosphere**: Golden sunlight, warm pastels, soft dust particles
- **Family**: Three family members with welcoming body language
- **Interactions**:
  - Tap family members → animations + heartwarming messages
  - Drag across screen → create glowing warmth particles
  - Messages appear: "It's okay", "We're here", "Let's talk"
- **Lighting**: Warm golden tones, soft shadows, forgiving ambiance
- **Mood**: Hopeful, healing, together

### 3. **LEAVE** (Solitude Ending)
Choose to walk away. Enter a vast, lonely cyberpunk city:
- **Visual Atmosphere**: Dark blues, neon lights, fog, rain-wet pavement
- **Environment**: Towering skyscrapers disappearing into mist, 30+ buildings
- **Character**: Lone figure with backpack, symbolizing departure
- **Interactions**:
  - Drag to rotate camera → 360° view around character
  - Tap neon lights → flicker and glitch effects
  - Tap ground → character walks forward with footstep animation
  - Moving fog particles
- **Lighting**: Cold neon (pink, cyan, purple, yellow), minimal warmth
- **Mood**: Isolated, contemplative, open-ended

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (required for Three.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Week-8
   ```

2. **Start a local server**

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Node.js:**
   ```bash
   npx http-server -p 8000
   ```

   **VS Code:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open browser**
   ```
   http://localhost:8000
   ```

## 🎮 How to Experience

### Initial Screens
1. **Loading Screen** (1.5s) - "Loading your story..."
2. **Intro Screen** - "Family Choice: A moment that changed everything"
3. Click **"Begin Your Story"** button

### The Argument Scene
- Watch the tense living room environment
- Objects shake, lights flicker
- After 3 seconds, two choices appear

### Making Your Choice

**Option 1: COMMUNICATE**
- Click the warm-colored button
- Experience the transformation to golden light
- Tap on family members to see messages
- Drag your mouse/finger to create particle effects
- Feel the warmth and healing

**Option 2: LEAVE**
- Click the cold-colored button
- Enter the dark cyberpunk city
- Drag to look around (360° camera)
- Tap neon lights to make them flicker
- Tap the ground to walk forward
- Experience solitude

## 🎨 Interactive Features

### Argument Scene
- ⚡ Flickering overhead light
- 📦 Shaking objects (table, vase)
- 👥 Trembling silhouettes
- 🌫️ Oppressive fog

### Communicate Scene
- 👨‍👩‍👧 **Clickable Family Members**: Tap to see animations + messages
- ✨ **Particle Creation**: Drag to spread golden warmth
- 💬 **Message System**: "It's okay", "We're here", "Let's talk"
- 🎹 **Piano Chimes**: Gentle sounds on interaction
- ☀️ **Golden Particles**: 150 floating dust motes
- 🪟 **Sunlit Window**: Warm light streaming through

### Leave Scene
- 🎥 **360° Camera**: Drag to orbit around character
- 🌃 **30 Skyscrapers**: Varying heights with neon lights
- 💡 **Clickable Lights**: Tap to trigger flicker effects
- 👣 **Walking System**: Tap ground to move forward
- 🌫️ **Dynamic Fog**: 100 particles drifting through streets
- 🎒 **Character Detail**: Backpack symbolizing journey

## 📁 Project Structure

```
Week-8/
├── index.html          # HTML structure with all UI elements
├── style.css           # Comprehensive styling for all scenes
├── app.js              # Three.js scenes, interactions, animations
├── package.json        # Project metadata
├── README.md           # This file
└── (optional audio)
    ├── ambient-tense.mp3    # Tense family argument ambience
    ├── ambient-warm.mp3     # Warm family reunion sounds
    ├── ambient-city.mp3     # Dark city night atmosphere
    ├── piano-chime.mp3      # Interaction sound (communicate)
    └── footstep.mp3         # Walking sound (leave)
```

## 🎵 Audio Design (Optional)

The experience includes audio hooks for enhanced immersion. Add MP3 files:

### Recommended Sounds

**ambient-tense.mp3** (Argument Scene)
- Heavy breathing, muffled voices
- Tense strings or low drones
- 30-60 seconds, looped
- Volume: 30%

**ambient-warm.mp3** (Communicate Scene)
- Soft wind, gentle room tone
- Warm ambient pad
- Distant friendly chatter
- 60-90 seconds, looped
- Volume: 40%

**ambient-city.mp3** (Leave Scene)
- Distant traffic hum
- Wind between buildings
- Electronic ambience
- Occasional car horn
- 90-120 seconds, looped
- Volume: 30%

**piano-chime.mp3** (Interaction)
- Gentle piano note or chime
- 1-2 seconds
- Volume: 50%

**footstep.mp3** (Walking)
- Single footstep on pavement
- Echo/reverb
- 0.5-1 seconds
- Volume: 60%

### Free Audio Resources
- [Freesound.org](https://freesound.org)
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)
- [Zapsplat](https://www.zapsplat.com/)

**Note**: The experience works perfectly without audio.

## 🛠️ Technical Details

### Technologies
- **Three.js r128**: 3D rendering engine
- **WebGL**: Hardware-accelerated graphics
- **Web Audio API**: Sound management
- **CSS3**: UI animations and transitions
- **Vanilla JavaScript**: No frameworks

### 3D Scene Features
- **Advanced Lighting**:
  - Argument: Single harsh point light
  - Communicate: Multiple warm lights (directional, point, ambient)
  - Leave: Minimal ambient + colored neon point lights

- **Materials**:
  - PBR (Physically Based Rendering)
  - Glass with transmission
  - Metallic surfaces in city
  - Proper roughness values

- **Particles**:
  - BufferGeometry for performance
  - Additive blending
  - Custom velocities
  - Auto-cleanup system

- **Interactions**:
  - Raycasting for click detection
  - Touch support (mobile)
  - Smooth camera transitions
  - Animation queuing

### Performance Optimizations
- Shadow map optimization (2048x2048)
- Particle count balancing
- Fog for depth and culling
- Efficient material reuse
- Device pixel ratio capping
- Geometry disposal on scene change

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile (works, but desktop recommended)

## 🎯 Design Philosophy

### Emotional Contrast
Each choice creates a **completely different emotional world**:

| Aspect | COMMUNICATE | LEAVE |
|--------|-------------|-------|
| **Color Palette** | Golden, warm pastels | Dark blues, neon accents |
| **Lighting** | Soft, forgiving, warm | Harsh, cold, flickering |
| **Atmosphere** | Healing, together | Isolated, contemplative |
| **Interactions** | Intimate, personal | Distant, environmental |
| **Message** | Connection heals | Freedom has a cost |

### Visual Language
- **Argument**: Instability (shaking, flickering)
- **Communicate**: Warmth (gold, soft edges, particles)
- **Leave**: Vastness (scale, fog, endless city)

## 🔧 Customization

### Change Scene Colors

**app.js - Communicate Scene:**
```javascript
scene.background = new THREE.Color(0xffe4c4); // Warm peach
scene.fog = new THREE.Fog(0xffd4a3, 10, 30);  // Golden fog
```

**app.js - Leave Scene:**
```javascript
scene.background = new THREE.Color(0x0a0a15); // Dark blue-black
scene.fog = new THREE.Fog(0x0a0a15, 10, 80);  // Deep fog
```

### Adjust Interaction Sensitivity

```javascript
// Camera rotation speed (Leave scene)
targetCameraRotationY -= deltaX * 0.005; // Lower = slower

// Particle creation rate (Communicate scene)
// Modify in onMouseMove function
```

### Add More Buildings

In `createFuturisticCity()`:
```javascript
for (let i = 0; i < 50; i++) { // Increase from 30 to 50
    // ...building creation code
}
```

## 🐛 Troubleshooting

### Scene Not Loading
- ✓ Check local server is running
- ✓ Open browser console (F12) for errors
- ✓ Verify Three.js CDN loads (check Network tab)

### Interactions Not Working
- ✓ Click "Begin Your Story" first
- ✓ Wait for choice buttons to appear (3 seconds)
- ✓ Choose a path before interacting

### Performance Issues
- Lower particle counts in `app.js`
- Reduce building count (Leave scene)
- Disable shadows: `renderer.shadowMap.enabled = false`

### Audio Not Playing
- Audio files are optional
- Browsers may block autoplay
- Check volume settings
- Verify file formats (MP3)

## 📱 Mobile Experience

The narrative works on mobile with adaptations:
- Touch to select choices
- Drag gestures for interactions
- Tap for clicking objects
- Reduced particle counts automatically
- Responsive UI sizing

**Best experienced on desktop for full visual fidelity.**

## 🎓 Learning Outcomes

This project demonstrates:
- **Narrative Design**: Choice-driven storytelling in 3D
- **Scene Management**: Multiple distinct 3D environments
- **Emotional Design**: Using color, light, and space for mood
- **Interaction Design**: Context-appropriate interactions per scene
- **Performance**: Optimizing 3D for web browsers
- **UX Flow**: Guiding users through an experience

## 🌟 Key Code Sections

### Scene Switching
`app.js:412-428` - `choosePath()` function manages transitions

### Family Interaction
`app.js:857-902` - Click detection and message system

### City Camera Control
`app.js:1115-1130` - Orbital camera around character

### Particle Systems
- `app.js:592-623` - Floating dust (Communicate)
- `app.js:625-655` - Interactive warmth particles
- `app.js:820-851` - City fog (Leave)

## 🚀 Future Enhancements

- [ ] More choice branches (3-4 paths)
- [ ] Voice acting for messages
- [ ] VR support (WebXR)
- [ ] Save/replay choices
- [ ] Procedural city generation
- [ ] Day/night cycle in city
- [ ] Weather effects
- [ ] Character customization
- [ ] Multiplayer shared choices

## 💡 Inspiration

This experience explores:
- The weight of our choices
- How environments reflect emotions
- The contrast between connection and isolation
- Visual storytelling through 3D space
- Interactive emotional narratives

## 📝 License

Open source for educational purposes.

## 🙏 Credits

- **Three.js**: Ricardo Cabello (mrdoob) and contributors
- **Concept**: Exploring family dynamics through interactive 3D
- **Design**: Emotional contrast through visual language

## 💬 Experience Notes

> "Every choice creates a different world. One filled with warmth and healing, the other with vast possibility and solitude. Neither is wrong—both are human."

---

**Made with ❤️ and thoughtful design**

*Which path will you choose?*
