# 3D Interactive Storytelling: A Life-Changing Academic Choice

An immersive WebGL experience exploring the emotional journey of choosing between studying at home or abroad.

## Overview

This interactive 3D scene allows users to explore two distinct emotional paths representing a pivotal academic decision. Through interactive memory fragments, atmospheric visuals, and thoughtful storytelling, users experience the joy and belonging of staying home versus the growth and solitude of studying abroad.

## Features

### Initial Scene
- Two glowing portals representing life paths
- Calm, anticipatory atmosphere
- Smooth camera controls for exploration

### Path 1: Study in Home Country
- **Atmosphere**: Warm, vibrant, colorful
- **Lighting**: Warm orange and yellow tones
- **Memory Fragments**: 6 interactive crystals containing:
  - Late night study sessions with friends
  - Family dinner gatherings
  - Festival celebrations
  - Sunset bike rides
  - Classroom moments
  - Birthday surprises
- **Theme**: Belonging, warmth, connection, joy

### Path 2: Study Abroad
- **Atmosphere**: Cool, misty, introspective
- **Lighting**: Cool blues and purples
- **Memory Fragments**: 6 interactive crystals containing:
  - First night alone in a new place
  - Walking unknown streets
  - Late night solo studying
  - Small acts of courage
  - Midnight reflections
  - Finding your voice
- **Theme**: Growth, solitude, courage, transformation

### Interactive Elements
- **Click portals** to enter a path
- **Click memory fragments** to view detailed memories
- **Drag mouse** to rotate camera and explore
- **Scroll** to zoom in/out
- **Progress tracking** shows memories discovered
- **Final reflection sphere** appears after viewing all memories
- **Merge sequence** symbolizes how all choices shape us

## How to Use

1. **Open the file**: Simply open `academic-choice.html` in a modern web browser
2. **Choose a portal**: Click on either "Study in Home Country" or "Study Abroad"
3. **Explore memories**: Click on floating crystal fragments to read memories
4. **Navigate**: Drag to rotate the camera, scroll to zoom
5. **Complete the journey**: View all 6 memories to unlock the final reflection
6. **Reflect**: Click the final glowing sphere to see the merge sequence

## Technical Details

### Technologies Used
- **Three.js** (r128): 3D rendering engine
- **WebGL**: Hardware-accelerated graphics
- **Vanilla JavaScript**: Interactive logic
- **CSS3**: UI overlays and transitions

### Key Components
- **OrbitControls**: Custom implementation for camera movement
- **Raycasting**: Mouse interaction detection
- **Particle systems**: Atmospheric effects
- **Dynamic lighting**: Scene-specific mood lighting
- **Material shaders**: Emissive and transparent effects

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with WebGL support

## File Structure

```
academic-choice.html          # Main application (self-contained)
README-ACADEMIC-CHOICE.md    # This documentation
```

## Customization

### Adding New Memories
Edit the `homeCountryMemories` or `abroadMemories` arrays in the JavaScript:

```javascript
{
    title: "Memory Title",
    description: "Memory description...",
    position: { x: -6, y: 2, z: -2 },
    color: 0xffaa44
}
```

### Adjusting Atmosphere
Modify fog density and colors:

```javascript
scene.fog.color.setHex(0x2a1a0a);  // Fog color
scene.fog.density = 0.015;          // Fog thickness
```

### Changing Portal Colors
Update portal creation:

```javascript
const homePortal = createPortal(
    new THREE.Vector3(-4, 2, 0),
    0xff6b6b,  // Color (hex)
    'Study in Home Country'
);
```

## User Experience Flow

1. **Introduction** → Title and calm scene with two portals
2. **Choice** → User clicks a portal to commit to a path
3. **Exploration** → User discovers and interacts with memory fragments
4. **Progress** → Visual feedback as memories are collected
5. **Completion** → Final sphere appears when all memories viewed
6. **Reflection** → Merge sequence with contemplative message

## Performance Notes

- Optimized for desktop and tablet
- Smooth 60fps performance on modern hardware
- Responsive design adapts to window size
- Efficient rendering with fog culling

## Themes Explored

### Home Country Path
- Community and belonging
- Cultural connection
- Familiar comfort
- Shared experiences
- Joy and celebration

### Study Abroad Path
- Personal growth
- Independence
- Courage and resilience
- Self-discovery
- Solitude as transformation

### Universal Message
Both paths are valid. Every choice shapes who we become. There is beauty in both the warmth of home and the challenge of the unknown.

## Credits

Created as an interactive storytelling experience exploring the emotional dimensions of life-changing academic decisions.

---

**Note**: This is a self-contained HTML file with no external dependencies except the Three.js CDN. It can be opened directly in a browser or hosted on any web server.
