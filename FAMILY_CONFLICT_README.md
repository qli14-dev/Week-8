# Family Choice - Interactive 3D Narrative

An immersive 3D interactive narrative experience centered on family conflict and emotional choices.

## Overview

This project presents a deeply emotional story where the user experiences a family argument and must make a meaningful choice that shapes the outcome. The experience features full 3D environments built with Three.js, complete camera controls, and rich interactive elements.

## Features

### Initial Scene - "The Argument"
- **Setting**: Dimly lit living room during a tense family argument
- **Atmosphere**:
  - Dark, moody lighting with flickering lamps
  - Stormy window with lightning effects
  - Trembling objects on the table (cup, books) showing physical tension
  - Family figures in confrontational poses
  - Heavy, oppressive ambient sound

### Choice System
After witnessing the initial conflict, two glowing choices appear:

#### Option 1: "Communicate"
- **Theme**: Reconciliation through dialogue
- **Scene Changes**:
  - Environment brightens with warm, golden sunlight
  - Storm clears outside the window
  - Family members sit together peacefully on the couch
  - Floating dialogue bubbles showing mutual understanding
  - Warm piano notes and peaceful ambience
  - Soft particle effects creating a dreamlike atmosphere
- **Interactive Elements**:
  - Click on family members to see their thoughts
  - Warm lighting that responds to interactions
  - Gentle animations showing emotional healing

#### Option 2: "Run Away"
- **Theme**: Solitude and self-discovery
- **Scene Changes**:
  - Transitions to a dark, futuristic city at night
  - Lonely street illuminated by neon signs and street lamps
  - Rain particles falling continuously
  - The user's character walks alone into the distance
  - Echoing footsteps and distant city sounds
- **Interactive Elements**:
  - Click on puddles to see memory reflections
  - Neon signs flicker dynamically
  - Rain creates atmosphere of isolation
  - Buildings with randomly lit windows suggest life moving on without you
  - Endless path representing both freedom and uncertainty

## Technical Implementation

### Technologies Used
- **Three.js r128**: 3D rendering engine
- **OrbitControls**: Full camera control (drag to rotate, scroll to zoom)
- **Custom Shaders**: For atmospheric effects and lighting
- **Web Audio API**: For ambient sounds and effects

### Key Features
1. **Dynamic Lighting System**:
   - Argument scene: Dim, flickering lights
   - Communicate scene: Warm, golden sunlight
   - Run Away scene: Neon lights and street lamps

2. **Interactive Objects**:
   - Clickable family members with dialogue
   - Trembling objects showing tension
   - Memory puddles with reflections
   - Responsive environmental elements

3. **Smooth Transitions**:
   - Fade in/out effects between scenes
   - Scene clearing and reconstruction
   - Camera position transitions

4. **Animations**:
   - Character gestures and movements
   - Particle systems (dust, rain)
   - Environmental effects (lightning, neon flicker)
   - Walking animations

## How to Use

### Running the Project
1. Open `family-conflict.html` in a web browser
2. Click "Begin" on the introduction screen
3. Use mouse to control the camera:
   - **Drag**: Rotate camera view
   - **Scroll**: Zoom in/out
   - **Click**: Interact with objects

### Making Your Choice
1. Observe the initial argument scene
2. When choices appear, select:
   - **Communicate**: Experience reconciliation and emotional healing
   - **Run Away**: Experience solitude and self-discovery

### Interactions
- **Communicate Scene**: Click on family members to see dialogue bubbles
- **Run Away Scene**: Click on puddles to trigger memory effects
- Explore each scene to discover small details and Easter eggs

## Emotional Design

### Color Psychology
- **Argument**: Dark blues and grays (tension, conflict)
- **Communicate**: Warm golds and oranges (warmth, healing)
- **Run Away**: Cool blues and purples with neon accents (loneliness, uncertainty)

### Sound Design
- **Argument**: Heavy, tense ambient noise
- **Communicate**: Soft piano, peaceful home sounds
- **Run Away**: Echoing footsteps, distant traffic, rain

### Camera Work
- Each scene has carefully positioned camera angles to evoke specific emotions
- User has full control to explore and observe details
- Smooth transitions maintain immersion

## Files

- `family-conflict.html` - Main HTML structure
- `family-conflict.css` - Styling and UI animations
- `family-conflict.js` - Three.js implementation and scene logic

## Future Enhancements

Potential additions:
- Voice acting for dialogue
- More detailed character models
- Additional branching choices
- Save/load system for revisiting choices
- VR support for deeper immersion
- Mobile touch controls
- More environmental details (photos, personal items)

## Credits

Created as an interactive narrative experience exploring family dynamics and emotional choice.

Built with Three.js and modern web technologies.

---

**Theme**: This experience explores the universal human challenge of conflict resolution - whether to stay and communicate through difficulties, or to leave and forge one's own path. Both choices are valid, and both lead to meaningful, distinct emotional outcomes.
