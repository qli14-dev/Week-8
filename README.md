# 💔 Family Choice – Interactive 3D Narrative

An emotionally immersive 3D interactive experience centered on family conflict, emotional choice, and the diverging paths of communication versus solitude.

![Three.js](https://img.shields.io/badge/Three.js-r128-blue) ![Status](https://img.shields.io/badge/status-complete-green) ![Interactive](https://img.shields.io/badge/narrative-branching-purple)

## 🎭 Story Overview

Experience a powerful narrative journey that begins in a dimly lit living room during a heated family argument. As tension fills the air and emotions overflow, you face a critical choice that will shape your emotional journey:

- **💬 Communicate**: Stay and work through the conflict, leading to warmth, reconciliation, and healing
- **🚶 Leave**: Walk away into the unknown night, experiencing solitude, uncertainty, and reflection

## ✨ Features

### Three Distinct 3D Scenes

#### 1. **The Argument** - Living Room Conflict
- Dark, tense atmosphere with dim lighting
- Trembling objects reflecting emotional tension
- Storm visible through the window
- Flickering TV light and heavy ambience
- Interactive photo frame and coffee table items
- Particle effects conveying unspoken tension
- Realistic shadows and moody lighting

#### 2. **Communicate Path** - Family Reconciliation
- Warm, golden sunlight streaming through windows
- Family sitting together on a couch in understanding
- Soft, healing atmosphere with bright colors
- Interactive family members with dialogue bubbles
- Golden dust particles floating in sunbeams
- Gentle animations showing breathing and warmth
- Soft piano sounds and light chimes (audio-ready)

#### 3. **Leave Path** - Dark City Night
- Vast futuristic cityscape at night
- Lonely character with backpack walking forward
- Neon lights and tall buildings in fog
- Rain particles and cold wind effects
- Flickering neon signs in the distance
- Memory fragments appearing as text
- Echoing footsteps and ambient city sounds (audio-ready)

### Interactive Elements

- **Full Camera Control**: Move your mouse to look around and explore each scene
- **Clickable Objects**: Interact with family members, photos, and environmental items
- **Dynamic Animations**:
  - Trembling objects during tension
  - Family members nodding when clicked
  - Walking character animation
  - Particle systems responding to scene mood
  - Lightning flashes in the storm
  - Neon light flickering
- **Atmospheric Sound** (prepared for audio files):
  - Tense ambient sounds for argument scene
  - Warm home ambience for reconciliation
  - Cold city sounds and wind for the leaving path
  - Chimes and piano notes for positive interactions

### Emotional Design

Each scene is crafted to evoke specific emotions through:
- **Lighting**: From harsh cold lights to warm golden sunbeams to neon city glows
- **Color Palettes**: Dark blues for tension, warm golds for healing, cold neons for isolation
- **Particle Effects**: Representing emotional states through movement and color
- **Sound Design**: Layered ambient sounds to deepen immersion (audio files optional)
- **Text & Dialogue**: Carefully chosen words that appear at key emotional moments

## 🎮 User Experience Flow

```
Loading Screen (1.5s)
    ↓
Intro Screen → Click "Begin Your Journey"
    ↓
Argument Scene (3D living room, tension building, 3s)
    ↓
Choice Appears: [Communicate] or [Leave]
    ↓
    ├─→ Communicate Path
    │   └─→ Warm reconciliation scene
    │       - Family together
    │       - Golden lighting
    │       - Dialogue bubbles
    │       - Healing atmosphere
    │
    └─→ Leave Path
        └─→ Dark city night scene
            - Lone character walking
            - Neon cityscape
            - Memory fragments
            - Isolation & reflection
```

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Week-8
   ```

2. **Start a local web server**

   **Option A: Using npm (recommended)**
   ```bash
   npm start
   ```

   **Option B: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option C: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```

   **Option D: Using VS Code**
   - Install the "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Open your browser**
   - Navigate to `http://localhost:8000`
   - Experience the journey!

## 🎨 Scene Details

### Scene 1: The Argument (Living Room)

**Visual Design:**
- Background Color: Dark purple-gray (#2a2a3e)
- Lighting: Cold overhead light, flickering TV, window glow
- Fog: Heavy, claustrophobic (10-30 units)
- Floor: Dark wood texture
- Walls: Dim purple-gray

**Interactive Objects:**
- Coffee cup (trembles when clicked)
- Photo frame (reveals memory text)
- Coffee table (subtle breathing animation)

**Atmosphere:**
- Tense, uncertain, heavy
- Storm visible through window
- Occasional lightning flashes
- 100 particles representing tension

### Scene 2A: Communicate (Reconciliation)

**Visual Design:**
- Background Color: Warm beige (#ffe4c4)
- Lighting: Golden sunlight, soft fills, warm atmosphere
- Fog: Light golden haze (15-40 units)
- Floor: Warm wooden tone
- Walls: Cream with warm lighting

**Interactive Objects:**
- Family member 1: Shows "I understand now..."
- Family member 2: Shows "We're here for you."
- Center figure: Shows "Thank you for listening."

**Atmosphere:**
- Warm, hopeful, healing
- Dialogue bubbles appear over time
- 150 golden particles (dust in sunlight)
- Family breathing gently together

### Scene 2B: Leave (Dark City)

**Visual Design:**
- Background Color: Deep night blue (#0a0a1a)
- Lighting: Cold moonlight, neon signs, street lamp
- Fog: Heavy urban fog (20-80 units)
- Ground: Wet street (reflective)
- Buildings: 20 tall skyscrapers with lit windows

**Interactive Objects:**
- None (emphasis on isolation)
- Character automatically walks forward

**Atmosphere:**
- Lonely, reflective, uncertain
- 200 rain particles falling
- 8 flickering neon lights (various colors)
- Memory fragments appearing as text:
  - "Old laughter echoes in the puddles..."
  - "Warmth feels like a distant dream..."
  - "The city lights blur like tears..."
  - "Every step forward, further from home..."

## 🛠️ Technical Implementation

### Technologies Used
- **Three.js (r128)**: 3D rendering and scene management
- **WebGL**: Hardware-accelerated graphics
- **Vanilla JavaScript**: No framework dependencies (~1300 lines)
- **CSS3**: Animations and UI styling (~550 lines)
- **HTML5**: Structure and audio element preparation

### Key Technical Features

**3D Engine:**
- Multiple scene management with state transitions
- Real-time particle systems (100-200 particles per scene)
- Dynamic lighting with shadow mapping
- Raycasting for object interaction
- Smooth camera controls with mouse tracking
- Scene cleanup and memory management

**Performance Optimizations:**
- Efficient particle systems with BufferGeometry
- Shadow map optimization (2048x2048)
- Tone mapping for realistic lighting (ACES Filmic)
- Anti-aliasing for smooth edges
- Pixel ratio limiting for better mobile performance
- Fog for depth perception and draw distance optimization

**Animation System:**
- RequestAnimationFrame loop at 60fps target
- Smooth camera lerping (linear interpolation)
- Per-scene animation functions
- Particle velocity systems
- Object-specific animations (trembling, breathing, walking)

## 📁 Project Structure

```
Week-8/
├── index.html          # Main HTML structure with all UI overlays
│                       # (128 lines - intro, choices, scene UIs)
├── app.js              # Complete 3D engine and narrative logic
│                       # (1325 lines - scenes, interactions, animations)
├── style.css           # Comprehensive styling for all scenes
│                       # (548 lines - responsive, animated)
├── package.json        # Project metadata and npm scripts
└── README.md          # This comprehensive documentation
```

## 🎵 Audio Design (Extensible)

The HTML includes audio elements ready for sound files. Simply add these files to enable full audio:

### Required Audio Files (all optional)

1. **ambient-argument** - Heavy, tense ambient sound (looped)
2. **ambient-home** - Warm home ambience with gentle tones (looped)
3. **ambient-city** - Cold city night sounds with distant traffic (looped)
4. **wind-sound** - Cold wind blowing (looped)
5. **chime-sound** - Light chimes for positive interactions (one-shot)
6. **piano-sound** - Soft piano notes for reconciliation (one-shot)
7. **footstep-sound** - Echoing footsteps (one-shot)
8. **transition-sound** - Scene transition effect (one-shot)

### Audio Implementation
The sound system is fully implemented in JavaScript and will gracefully handle missing files:

```javascript
// Example: Playing a sound
playSound('chime'); // Will play if file exists, log if missing
```

### Recommended Audio Sources
- [Freesound.org](https://freesound.org) - Free sound effects
- [Free Music Archive](https://freemusicarchive.org) - Ambient music
- [Incompetech](https://incompetech.com) - Royalty-free music

## 🎯 Design Philosophy

This project explores **emotional storytelling through interactive 3D environments**. Each choice leads to a genuinely different experience, not just visually but emotionally:

### The Two Paths

**Communicate Path** represents:
- Comfort through connection
- Emotional healing through dialogue
- The warmth of family bonds
- Reconciliation and understanding
- Growth through togetherness

**Leave Path** represents:
- Growth through solitude
- Self-reflection in isolation
- The courage to walk an uncertain path
- Freedom and independence
- Bittersweet nostalgia

**Neither path is portrayed as "right" or "wrong"** - they are simply different valid responses to a difficult emotional moment. The experience honors both choices equally.

## 🎮 Interactive Controls

### Mouse Controls
- **Move Mouse Left/Right**: Rotate camera horizontally
- **Move Mouse Up/Down**: Adjust camera vertical angle
- **Click Objects**: Trigger interactions

### Argument Scene Interactions
- Click **photo frame**: Shows "A photo of happier times..."
- Click **coffee cup**: Triggers trembling animation
- General exploration of tense environment

### Communicate Scene Interactions
- Click **family members**: Shows dialogue and nod animation
- Click **anyone** three times to hear all messages
- Chime sound plays with each interaction

### Leave Scene Interactions
- **Automatic**: Character walks forward
- **Passive**: Watch rain fall, neon lights flicker
- **Read**: Memory fragments appear over time

## 🔧 Customization Guide

### Changing Scene Colors

Edit scene backgrounds in `app.js`:

```javascript
// Argument scene
scene.background = new THREE.Color(0x2a2a3e); // Your color

// Communicate scene
scene.background = new THREE.Color(0xffe4c4); // Your color

// Leave scene
scene.background = new THREE.Color(0x0a0a1a); // Your color
```

### Modifying Dialogue

Edit the dialogue messages in `showDialogueBubbles()`:

```javascript
const messages = [
    { text: "Your custom message", delay: 0 },
    { text: "Another message", delay: 1500 },
    { text: "Final message", delay: 3000 }
];
```

### Adjusting Camera Behavior

Modify camera constants:

```javascript
const CAMERA_MOVE_SPEED = 0.03;    // Lower = slower, smoother
const MOUSE_SENSITIVITY = 0.0005;   // Lower = less sensitive
```

### Adding New Interactive Objects

1. Create the 3D object:
```javascript
const newObject = new THREE.Mesh(geometry, material);
```

2. Make it clickable:
```javascript
newObject.userData.clickable = true;
newObject.userData.type = 'custom-type';
```

3. Add to interactive array:
```javascript
interactiveObjects.push(newObject);
```

4. Handle clicks in `handleObjectClick()`:
```javascript
if (clickable.userData.type === 'custom-type') {
    // Your interaction code
}
```

### Changing Particle Counts

```javascript
// Argument scene - line ~380
const particleCount = 100; // Increase for more particles

// Communicate scene - line ~710
const particleCount = 150; // Adjust as needed

// Leave scene (rain) - line ~940
const particleCount = 200; // More = heavier rain
```

## 📱 Responsive Design

The experience adapts beautifully to different screen sizes:

### Desktop (768px+)
- Full immersive experience
- Side-by-side choice buttons
- Large text and generous spacing
- Optimal particle counts

### Tablet (480-768px)
- Stacked choice buttons
- Adjusted text sizes
- Maintained visual quality
- Optimized interactions

### Mobile (< 480px)
- Compact layouts
- Touch-friendly buttons
- Smaller text but readable
- Reduced particle counts for performance

## 🐛 Troubleshooting

### Black Screen or Blank Page
- Ensure you're running a local web server (not `file://`)
- Check browser console for errors (F12)
- Verify Three.js CDN is accessible
- Clear browser cache and reload

### Choice Buttons Don't Appear
- Wait for the full 3-second argument scene
- Check if JavaScript is enabled
- Look for console errors

### Poor Performance / Lag
- Reduce particle counts in `app.js`
- Disable shadows: `renderer.shadowMap.enabled = false`
- Reduce shadow map size to 1024
- Close other browser tabs

### Interactions Not Working
- Ensure you've clicked "Begin Your Journey"
- Wait for scene to fully load
- Try clicking directly on objects (not backgrounds)
- Check if raycasting is working (console logs)

### Audio Not Playing
- Audio files are completely optional
- Browser may block autoplay - try clicking first
- Check console for audio error messages
- Verify file formats are MP3

## 🎓 Learning Outcomes

This project demonstrates advanced concepts in:

### Web Development
- Three.js scene graph management
- WebGL rendering pipeline
- Event handling and user interaction
- State management without frameworks
- Audio API preparation

### 3D Graphics
- Lighting systems (ambient, directional, point)
- Shadow mapping and optimization
- Particle systems with BufferGeometry
- Material properties (PBR shading)
- Camera controls and animation

### Interactive Narrative
- Branching storylines
- Emotional design through color and light
- Environmental storytelling
- User agency and choice consequence
- Mood creation through technical means

### Design Principles
- Emotional color theory
- Atmospheric lighting
- UI/UX for interactive experiences
- Responsive design patterns
- Accessibility considerations

## 🌟 Advanced Features

### Scene Management System
```javascript
const SCENES = {
    ARGUMENT: 'argument',
    COMMUNICATE: 'communicate',
    LEAVE: 'leave'
};
```
Tracks current scene state and manages transitions.

### Dynamic Particle Systems
Each scene has unique particle behavior:
- **Argument**: Slow, drifting (tension)
- **Communicate**: Floating, glowing (warmth)
- **Leave**: Falling rain (coldness)

### Smart Object Cleanup
```javascript
function clearScene() {
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    particles = [];
    interactiveObjects = [];
}
```
Prevents memory leaks between scene transitions.

## 📊 Performance Metrics

Typical performance on modern hardware:

- **Frame Rate**: 60 FPS (target)
- **Memory Usage**: ~50-80 MB
- **Load Time**: < 2 seconds
- **Scene Transition**: ~1 second

### Optimization Strategies Applied

1. **Geometry Instancing**: Reusing geometries where possible
2. **BufferGeometry**: For all meshes and particles
3. **Shadow Map Pooling**: Shared shadow maps
4. **Fog-Based Culling**: Objects fade at distance
5. **Pixel Ratio Capping**: `Math.min(devicePixelRatio, 2)`

## 🚀 Future Enhancement Ideas

Potential additions to expand the experience:

- [ ] Save system (remember choice made)
- [ ] Multiple argument scenarios
- [ ] Voice acting for dialogue
- [ ] VR support with WebXR
- [ ] Procedural city generation
- [ ] Weather system for Leave path
- [ ] Family customization
- [ ] Multiple endings per path
- [ ] Achievement system
- [ ] Photo mode / screenshots
- [ ] Social sharing
- [ ] Analytics to track choice ratios

## 📄 License

MIT License - Free to use for learning, modification, and inspiration.

## 🙏 Acknowledgments

- **Three.js**: Created by Ricardo Cabello (mrdoob) and contributors
- **Inspiration**: Personal experiences with family dynamics
- **Design Philosophy**: Emotional storytelling through technology
- **Color Theory**: Research on emotional responses to color and light

## 💬 Feedback & Support

This is an artistic experiment in interactive emotional storytelling. The goal is to make players *feel* something through the power of 3D environments, color, lighting, and choice.

**What will you choose?**

---

**Made with 💔, code, and emotion.**

*"Every family argument is a crossroads. Every choice shapes who we become."*
