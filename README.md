# 💔🤗 The Choice - An Emotional Journey

An immersive 3D interactive narrative experience exploring the profound impact of emotional choices. Built with Three.js, this web-based experience combines beautiful visuals, meaningful interactions, and a deeply emotional atmosphere to tell a story of love, loss, and consequence.

![The Choice](https://img.shields.io/badge/Three.js-r128-blue) ![Status](https://img.shields.io/badge/status-ready-green) ![Type](https://img.shields.io/badge/type-narrative-purple)

## ✨ Features

### Emotional Narrative
- **Two Diverging Paths**: Make a single choice that changes everything
- **Break Up Ending**: Experience the melancholic beauty of letting go
- **Hug Ending**: Witness the warmth of forgiveness and reconnection
- **Meaningful Consequences**: Each choice leads to a completely different emotional journey

### Visual Experience
- **Intimate 3D Room**: A softly lit space with warm, calming tones
- **Living Characters**: Two humanoid figures with breathing animations and eye contact
- **Dynamic Lighting**: Lights that respond to your choices (dimming for sadness, glowing for love)
- **Atmospheric Particles**: Floating light particles that enhance the dreamlike quality
- **Cinematic Camera**: Smooth mouse-controlled viewing and automatic camera circling

### Interactive Elements
- **Letter Introduction**: Click an emotional letter to enter the scene
- **Choice Buttons**: Select "Break Up" 💔 or "Hug" 🤗
- **Breathing Animations**: Characters breathe and move subtly, feeling alive
- **Eye Contact**: Subtle head movements simulate emotional connection
- **Flickering Lights**: Random light flickers add tension and atmosphere

### Break Up Path 💔
- Room gradually dims to cold, dark tones
- Background music fades to silence
- Partner slowly walks away into the distance
- Footsteps echo in the emptiness
- Door closing sound marks the finality
- User left alone in quiet solitude
- Ending message: "Alone in the silence..."

### Hug Path 🤗
- Room brightens with warm golden glow
- Gentle piano music fades in
- Characters move closer and embrace
- Arms raise in a tender hug animation
- Camera circles around the couple
- Colors shift to brighter, warmer tones
- Ending message: "In love, we find our way home..."

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

1. **Start**: Click the emotional letter to enter the scene
2. **Look Around**: Move your mouse to explore the room and observe the characters
3. **Wait**: Let the scene breathe - watch the characters' subtle movements
4. **Choose**: When the buttons appear, select either "Break Up" 💔 or "Hug" 🤗
5. **Experience**: Watch as your choice transforms the entire scene
6. **Reflect**: Consider how small choices create profound consequences

## 🎵 Adding Audio (Optional)

The experience includes audio support for enhanced emotional immersion. To add audio files:

1. Create audio files in MP3 format:
   - `ambient.mp3` - Soft ambient background (melancholic, calm)
   - `piano.mp3` - Gentle piano music for the hug ending
   - `footsteps.mp3` - Walking away footsteps sound
   - `door-close.mp3` - Door closing sound
   - `transition.mp3` - Scene transition sound

2. Place them in the root directory alongside `index.html`

3. **Recommended Audio**:
   - **Ambient**: Soft strings, gentle rain, or quiet room ambience
   - **Piano**: Warm, hopeful piano melody (e.g., Chopin, Debussy)
   - **Footsteps**: Slow footsteps on wooden floor
   - **Door Close**: Heavy door closing with echo
   - **Transition**: Soft whoosh or gentle chime

4. **Free Audio Resources**:
   - [Freesound.org](https://freesound.org)
   - [Free Music Archive](https://freemusicarchive.org)
   - [Incompetech](https://incompetech.com)
   - [Pixabay Audio](https://pixabay.com/music/)

**Note**: The experience works perfectly without audio files. The application will gracefully handle missing audio.

## 📁 Project Structure

```
Week-8/
├── index.html          # Main HTML structure and UI
├── style.css           # Styling and animations
├── app.js              # Three.js scene and narrative logic
├── README.md           # This file
└── (optional audio files)
    ├── ambient.mp3     # Background ambient sound
    ├── piano.mp3       # Piano music for hug ending
    ├── footsteps.mp3   # Walking away sound
    ├── door-close.mp3  # Door closing sound
    └── transition.mp3  # Scene transition sound
```

## 🎨 Customization

### Changing Character Colors

Edit the color values in `app.js` (line 251-257):

```javascript
// Character 1 (Left) - blue-grey tones
character1 = createCharacter(0x6b8e9f, -1.2, 0);

// Character 2 (Right) - warm brown tones
character2 = createCharacter(0xd4a574, 1.2, 0);
```

### Adjusting Lighting Mood

In `app.js`, modify the lighting (lines 96-145):

```javascript
// Make it warmer
const ambientLight = new THREE.AmbientLight(0xffd4b5, 0.4);

// Make it cooler/sadder
const ambientLight = new THREE.AmbientLight(0xb5c4d4, 0.3);
```

### Changing Animation Speed

Adjust timing in the animation functions:

```javascript
// Embrace animation duration (line 745)
const duration = 3000; // milliseconds

// Camera circle duration (line 796)
const duration = 8000; // milliseconds
```

## 🛠️ Technical Details

### Technologies Used
- **Three.js r128**: 3D rendering and scene management
- **WebGL**: Hardware-accelerated 3D graphics
- **Web Audio API**: Sound management with cross-fading
- **CSS3**: Animations and button styling
- **Vanilla JavaScript**: No frameworks required

### Advanced Features
- **Procedural Characters**: Humanoid figures built with capsule and sphere geometry
- **Breathing Simulation**: Sine wave animation for realistic chest movement
- **Eye Contact Simulation**: Subtle head rotations toward each other
- **Dynamic Lighting**: Color and intensity lerping based on emotional state
- **Smooth Transitions**: Easing functions for natural movement
- **Audio Cross-fading**: Gradual volume transitions between soundscapes

### Performance Optimizations
- Shadow map optimization with PCFSoftShadowMap (2048x2048)
- Efficient particle system with BufferGeometry (150 particles)
- Tone mapping for cinematic color reproduction (ACES Filmic)
- Fog for depth perception and atmosphere
- Device pixel ratio capping for mobile devices
- Material reuse for character body parts

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (reduced performance, touch support basic)

## 🎯 Narrative Design

### The Premise
Two people stand in a quiet room, facing a crossroads in their relationship. The tension is palpable, but so is the love. The user must make a choice that will determine their future together.

### Emotional Themes
1. **Tension and Intimacy**: The initial scene balances closeness with distance
2. **Consequence**: Small actions have profound impacts
3. **Loss vs. Love**: The duality of letting go and holding on
4. **Silence and Sound**: Audio cues amplify emotional moments
5. **Light and Shadow**: Visual metaphors for emotional states

### Design Philosophy
- **Show, Don't Tell**: Visual storytelling through lighting and movement
- **Subtlety**: Small details (breathing, eye contact) create connection
- **Contrast**: Opposite endings highlight the weight of choice
- **Atmosphere**: Every element reinforces the emotional tone
- **Agency**: The user's choice genuinely matters

## 🐛 Troubleshooting

### Characters Not Appearing
- Check browser console for errors (F12)
- Verify Three.js is loading from CDN
- Ensure WebGL is supported in your browser

### Choice Buttons Not Appearing
- Wait 2 seconds after entering the scene
- Make sure JavaScript is enabled
- Check if the UI overlay loaded correctly

### Audio Not Playing
- Audio files are optional
- Some browsers require user interaction before playing audio
- Check volume levels and mute status
- Verify audio files are MP3 format

### Animation Stuttering
- Close other browser tabs
- Reduce particle count in `app.js` (line 360)
- Try a different browser
- Check CPU/GPU usage

### Lights Not Changing During Choices
- Wait for animations to complete
- Check browser console for errors
- Ensure the scene fully loaded before making choice

## 📱 Mobile Support

The experience works on mobile devices with some limitations:
- Touch to look around (basic gyroscope support)
- Tap buttons to make choices
- Reduced particle count recommended
- Audio requires user interaction to start
- Performance varies by device capability

## 🎓 Learning Resources

If you want to learn more about the technologies used:
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Journey Course](https://threejs-journey.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Interactive Storytelling](https://narratology.net/)
- [Emotion in Game Design](https://www.gamedeveloper.com/design/designing-for-emotion)

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Credits

- **Three.js**: Amazing 3D library by Ricardo Cabello (mrdoob)
- **Inspiration**: The profound impact of small choices in relationships
- **Design**: Emotional storytelling through interactive media

## 🎭 The Deeper Meaning

This experience explores how a single moment, a single choice, can define the trajectory of our relationships and lives. The contrast between the two endings isn't meant to say one choice is "right" — both breaking up and staying together can be acts of love, depending on the circumstances.

The scene is designed to make you feel:
- **Connection**: Through breathing, eye contact, and proximity
- **Tension**: Through lighting, silence, and the weight of choice
- - **Consequence**: Through dramatic visual and audio transformations
- **Empathy**: By experiencing both possible futures

## 🚀 Future Enhancements

Potential features to add:
- [ ] Third choice option (talk it out)
- [ ] Multiple relationship scenarios
- [ ] Save/replay different endings
- [ ] Voice acting or dialogue
- [ ] VR support with WebXR
- [ ] More character customization
- [ ] Branching narrative with multiple decision points
- [ ] Social sharing of choices/endings
- [ ] Analytics on which ending people choose more often

## 💬 Reflection Questions

After experiencing both endings, consider:
- Which ending did you choose first? Why?
- How did the visual and audio changes affect your emotions?
- What does this experience say about the nature of choice?
- How might you apply this to real-life relationships?
- Did the breathing and eye contact make the characters feel alive?

---

**Made with 💔 and 🤗 — Every choice matters**
