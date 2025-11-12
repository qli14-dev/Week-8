// ===================================
// EMOTIONAL NARRATIVE SCENE
// The Choice - An Interactive Story
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let room, character1, character2, particles;
let clock, ambientSound, isSceneActive = false;
let choiceMade = false;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0;

// Lighting references
let mainLight, fillLight, rimLight, emotionalLight, flickerLight;

// Constants
const CAMERA_MOVE_SPEED = 0.015;
const MOUSE_SENSITIVITY = 0.0002;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

function init() {
    // Remove loading screen after a delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.style.display = 'none', 1000);
    }, 1500);

    // Initialize Three.js components
    initThreeJS();
    createEmotionalLighting();
    createRoom();
    createCharacters();
    createParticles();
    createAtmosphericElements();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd4b5a0, 8, 25);
    scene.background = new THREE.Color(0xd4b5a0);

    // Camera setup - positioned to view both characters
    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.6, 6);
    camera.lookAt(0, 1.5, 0);

    // Renderer setup
    const canvas = document.getElementById('scene-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Raycaster for interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Clock for animations
    clock = new THREE.Clock();
}

// ===================================
// EMOTIONAL LIGHTING SYSTEM
// ===================================

function createEmotionalLighting() {
    // Soft ambient light - warm and melancholic
    const ambientLight = new THREE.AmbientLight(0xffd4b5, 0.4);
    scene.add(ambientLight);

    // Main soft light from above - creates intimacy
    mainLight = new THREE.DirectionalLight(0xffd9b3, 0.8);
    mainLight.position.set(0, 5, 2);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.camera.left = -8;
    mainLight.shadow.camera.right = 8;
    mainLight.shadow.camera.top = 8;
    mainLight.shadow.camera.bottom = -8;
    scene.add(mainLight);

    // Fill light - soft warmth from the side
    fillLight = new THREE.PointLight(0xffcba4, 0.6, 15);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Rim light for depth and emotion
    rimLight = new THREE.DirectionalLight(0xffb89d, 0.4);
    rimLight.position.set(3, 2, -2);
    scene.add(rimLight);

    // Emotional pulsing light - represents tension
    emotionalLight = new THREE.PointLight(0xffd4a3, 0.3, 12);
    emotionalLight.position.set(0, 2.5, 0);
    emotionalLight.userData.originalIntensity = 0.3;
    scene.add(emotionalLight);

    // Flickering light for atmosphere
    flickerLight = new THREE.PointLight(0xffe4c4, 0.2, 8);
    flickerLight.position.set(2, 3, -2);
    flickerLight.userData.baseIntensity = 0.2;
    scene.add(flickerLight);

    // Store for animation
    scene.userData.lights = {
        main: mainLight,
        fill: fillLight,
        rim: rimLight,
        emotional: emotionalLight,
        flicker: flickerLight
    };
}

// ===================================
// ROOM ENVIRONMENT
// ===================================

function createRoom() {
    room = new THREE.Group();

    // Floor - warm wooden tones
    const floorGeometry = new THREE.PlaneGeometry(12, 12);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a87c,
        roughness: 0.85,
        metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);

    // Walls - soft, calming colors
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5e6d3,
        roughness: 0.9,
        metalness: 0.05
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 5),
        wallMaterial
    );
    backWall.position.set(0, 2.5, -6);
    backWall.receiveShadow = true;
    room.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 5),
        wallMaterial
    );
    leftWall.position.set(-6, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    room.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 5),
        wallMaterial
    );
    rightWall.position.set(6, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    room.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 12),
        new THREE.MeshStandardMaterial({
            color: 0xfff5e6,
            roughness: 0.9
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    ceiling.receiveShadow = true;
    room.add(ceiling);

    // Window with soft light
    const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 0.15),
        new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.7
        })
    );
    windowFrame.position.set(-5.92, 2.5, 2);
    windowFrame.rotation.y = Math.PI / 2;
    room.add(windowFrame);

    // Window glass - translucent
    const windowGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.7),
        new THREE.MeshPhysicalMaterial({
            color: 0xffd4a3,
            transparent: true,
            opacity: 0.25,
            roughness: 0.1,
            transmission: 0.9
        })
    );
    windowGlass.position.set(-5.85, 2.5, 2);
    windowGlass.rotation.y = Math.PI / 2;
    room.add(windowGlass);

    scene.add(room);
}

// ===================================
// CHARACTER CREATION
// ===================================

function createCharacters() {
    // Character 1 (Left side - slightly turned)
    character1 = createCharacter(0x6b8e9f, -1.2, 0);
    character1.rotation.y = Math.PI / 8;
    character1.name = 'character1';
    scene.add(character1);

    // Character 2 (Right side - facing character 1)
    character2 = createCharacter(0xd4a574, 1.2, 0);
    character2.rotation.y = -Math.PI / 8;
    character2.name = 'character2';
    scene.add(character2);
}

function createCharacter(color, x, z) {
    const character = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.25, 0.8, 8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.2;
    body.castShadow = true;
    body.receiveShadow = true;
    character.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd4a3,
        roughness: 0.6,
        metalness: 0.05
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.78;
    head.castShadow = true;
    head.receiveShadow = true;
    character.add(head);

    // Store head reference for animations
    character.userData.head = head;

    // Eyes (simple spheres for emotional connection)
    const eyeGeometry = new THREE.SphereGeometry(0.025, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        roughness: 0.3,
        emissive: 0x1a1a1a,
        emissiveIntensity: 0.3
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.06, 1.82, 0.15);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.06, 1.82, 0.15);
    character.add(rightEye);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.08, 0.6, 6, 12);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7
    });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 1.15, 0);
    leftArm.rotation.z = Math.PI / 12;
    leftArm.castShadow = true;
    character.add(leftArm);
    character.userData.leftArm = leftArm;

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 1.15, 0);
    rightArm.rotation.z = -Math.PI / 12;
    rightArm.castShadow = true;
    character.add(rightArm);
    character.userData.rightArm = rightArm;

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.1, 0.7, 6, 12);

    const leftLeg = new THREE.Mesh(legGeometry, armMaterial);
    leftLeg.position.set(-0.15, 0.45, 0);
    leftLeg.castShadow = true;
    character.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, armMaterial);
    rightLeg.position.set(0.15, 0.45, 0);
    rightLeg.castShadow = true;
    character.add(rightLeg);

    character.position.set(x, 0, z);

    // Animation data
    character.userData.originalY = 0;
    character.userData.breathPhase = Math.random() * Math.PI * 2;

    return character;
}

// ===================================
// ATMOSPHERIC ELEMENTS
// ===================================

function createParticles() {
    const particleCount = 150;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 1] = Math.random() * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

        velocities.push({
            x: (Math.random() - 0.5) * 0.008,
            y: (Math.random() - 0.5) * 0.008,
            z: (Math.random() - 0.5) * 0.008
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd4a3,
        size: 0.04,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData.velocities = velocities;
    scene.add(particles);
}

function createAtmosphericElements() {
    // Soft volumetric light effect (simulated with transparent planes)
    const lightRayGeometry = new THREE.PlaneGeometry(0.3, 4);
    const lightRayMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd4a3,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
    });

    for (let i = 0; i < 5; i++) {
        const lightRay = new THREE.Mesh(lightRayGeometry, lightRayMaterial);
        lightRay.position.set(
            -5.8,
            3 + Math.random() * 0.5,
            2 + (Math.random() - 0.5) * 2
        );
        lightRay.rotation.y = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        lightRay.rotation.z = (Math.random() - 0.5) * 0.2;
        scene.add(lightRay);
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Letter click to enter scene
    const letterScreen = document.getElementById('letter-screen');
    const letter = document.querySelector('.letter');

    letter.addEventListener('click', () => {
        enterEmotionalScene();
    });

    // Mouse movement for camera control
    window.addEventListener('mousemove', onMouseMove);

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Choice button listeners
    const breakupBtn = document.getElementById('breakup-btn');
    const hugBtn = document.getElementById('hug-btn');

    breakupBtn.addEventListener('click', () => {
        if (!choiceMade) {
            choiceMade = true;
            executeBreakup();
        }
    });

    hugBtn.addEventListener('click', () => {
        if (!choiceMade) {
            choiceMade = true;
            executeHug();
        }
    });
}

function onMouseMove(event) {
    if (!isSceneActive || choiceMade) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = mouseX * 1.2;
    targetCameraY = mouseY * 0.6;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SCENE TRANSITIONS
// ===================================

function enterEmotionalScene() {
    const letterScreen = document.getElementById('letter-screen');
    const canvas = document.getElementById('scene-canvas');
    const uiOverlay = document.getElementById('ui-overlay');
    const choiceButtons = document.getElementById('choice-buttons');
    const transitionSound = document.getElementById('transition-sound');
    const ambientSoundElement = document.getElementById('ambient-sound');

    // Play transition sound
    if (transitionSound) {
        transitionSound.volume = 0.4;
        transitionSound.play().catch(e => console.log('Transition sound error:', e));
    }

    // Fade out letter screen
    letterScreen.classList.add('hidden');

    // Fade in 3D scene
    setTimeout(() => {
        canvas.classList.add('visible');
        uiOverlay.classList.remove('hidden');
        isSceneActive = true;

        // Show choice buttons after a moment
        setTimeout(() => {
            choiceButtons.classList.remove('hidden');
        }, 2000);

        // Start ambient sound
        if (ambientSoundElement) {
            ambientSoundElement.volume = 0.2;
            ambientSoundElement.play().catch(e => console.log('Ambient sound error:', e));
        }
    }, 500);
}

// ===================================
// CHOICE IMPLEMENTATIONS
// ===================================

function executeBreakup() {
    const choiceButtons = document.getElementById('choice-buttons');
    const breakupMessage = document.getElementById('breakup-message');
    const endingMessage = document.getElementById('ending-message');
    const ambientSoundElement = document.getElementById('ambient-sound');
    const footstepsSound = document.getElementById('footsteps-sound');
    const doorCloseSound = document.getElementById('door-close-sound');

    // Hide choice buttons
    choiceButtons.style.opacity = '0';
    setTimeout(() => choiceButtons.classList.add('hidden'), 500);

    // Show breakup message
    breakupMessage.classList.remove('hidden');
    setTimeout(() => breakupMessage.classList.add('hidden'), 4000);

    // Fade out ambient sound
    if (ambientSoundElement) {
        const fadeOut = setInterval(() => {
            if (ambientSoundElement.volume > 0.05) {
                ambientSoundElement.volume -= 0.02;
            } else {
                ambientSoundElement.pause();
                clearInterval(fadeOut);
            }
        }, 100);
    }

    // Animate lighting - dim the room
    animateBreakupLighting();

    // Character 2 walks away
    setTimeout(() => {
        // Play footsteps
        if (footstepsSound) {
            footstepsSound.volume = 0.5;
            footstepsSound.play().catch(e => console.log('Footsteps error:', e));
        }

        animateWalkAway();

        // Play door close sound
        setTimeout(() => {
            if (doorCloseSound) {
                doorCloseSound.volume = 0.6;
                doorCloseSound.play().catch(e => console.log('Door close error:', e));
            }
        }, 3000);

        // Show ending message
        setTimeout(() => {
            endingMessage.querySelector('.fade-text').textContent = 'Alone in the silence...';
            endingMessage.classList.remove('hidden');
        }, 4000);
    }, 2000);
}

function executeHug() {
    const choiceButtons = document.getElementById('choice-buttons');
    const hugMessage = document.getElementById('hug-message');
    const endingMessage = document.getElementById('ending-message');
    const ambientSoundElement = document.getElementById('ambient-sound');
    const pianoSound = document.getElementById('piano-sound');

    // Hide choice buttons
    choiceButtons.style.opacity = '0';
    setTimeout(() => choiceButtons.classList.add('hidden'), 500);

    // Show hug message
    hugMessage.classList.remove('hidden');
    setTimeout(() => hugMessage.classList.add('hidden'), 4000);

    // Fade out ambient sound, fade in piano
    if (ambientSoundElement) {
        const fadeOut = setInterval(() => {
            if (ambientSoundElement.volume > 0.05) {
                ambientSoundElement.volume -= 0.02;
            } else {
                ambientSoundElement.pause();
                clearInterval(fadeOut);
            }
        }, 100);
    }

    setTimeout(() => {
        if (pianoSound) {
            pianoSound.volume = 0;
            pianoSound.play().catch(e => console.log('Piano error:', e));

            // Fade in piano
            const fadeIn = setInterval(() => {
                if (pianoSound.volume < 0.25) {
                    pianoSound.volume += 0.01;
                } else {
                    clearInterval(fadeIn);
                }
            }, 100);
        }
    }, 1000);

    // Animate lighting - warm glow
    animateHugLighting();

    // Characters embrace
    setTimeout(() => {
        animateEmbrace();

        // Camera circles around
        animateCameraCircle();

        // Show ending message
        setTimeout(() => {
            endingMessage.querySelector('.fade-text').textContent = 'In love, we find our way home...';
            endingMessage.classList.remove('hidden');
        }, 4000);
    }, 2000);
}

// ===================================
// BREAKUP ANIMATIONS
// ===================================

function animateBreakupLighting() {
    const lights = scene.userData.lights;
    const duration = 4000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Dim all lights
        lights.main.intensity = 0.8 - progress * 0.6;
        lights.fill.intensity = 0.6 - progress * 0.5;
        lights.rim.intensity = 0.4 - progress * 0.35;
        lights.emotional.intensity = 0.3 - progress * 0.28;

        // Make scene colder (less warm)
        const coldColor = new THREE.Color(0x8b9aa3);
        const warmColor = new THREE.Color(0xffd9b3);
        lights.main.color.lerpColors(warmColor, coldColor, progress);

        // Darken background
        const darkBg = new THREE.Color(0xa0958b);
        const lightBg = new THREE.Color(0xd4b5a0);
        scene.background.lerpColors(lightBg, darkBg, progress);
        scene.fog.color.lerpColors(lightBg, darkBg, progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function animateWalkAway() {
    const duration = 4000;
    const startTime = Date.now();
    const startZ = character2.position.z;
    const startRotY = character2.rotation.y;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Move away slowly
        character2.position.z = startZ + progress * 8;

        // Turn towards exit
        character2.rotation.y = startRotY + progress * Math.PI;

        // Slight walking animation
        const walkCycle = Math.sin(progress * Math.PI * 8);
        character2.position.y = Math.abs(walkCycle) * 0.05;

        // Fade out
        character2.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = 1 - progress * 0.7;
                child.material.transparent = true;
            }
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ===================================
// HUG ANIMATIONS
// ===================================

function animateHugLighting() {
    const lights = scene.userData.lights;
    const duration = 4000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Brighten and warm up lights
        lights.main.intensity = 0.8 + progress * 0.4;
        lights.fill.intensity = 0.6 + progress * 0.5;
        lights.emotional.intensity = 0.3 + progress * 0.5;

        // Warm golden glow
        const goldenColor = new THREE.Color(0xffe4b3);
        const normalColor = new THREE.Color(0xffd9b3);
        lights.main.color.lerpColors(normalColor, goldenColor, progress);
        lights.fill.color.set(0xffd4a3);

        // Brighten background
        const brightBg = new THREE.Color(0xffd4a3);
        const normalBg = new THREE.Color(0xd4b5a0);
        scene.background.lerpColors(normalBg, brightBg, progress);
        scene.fog.color.lerpColors(normalBg, brightBg, progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function animateEmbrace() {
    const duration = 3000;
    const startTime = Date.now();

    const char1StartX = character1.position.x;
    const char1StartZ = character1.position.z;
    const char1StartRotY = character1.rotation.y;

    const char2StartX = character2.position.x;
    const char2StartZ = character2.position.z;
    const char2StartRotY = character2.rotation.y;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        // Move characters closer
        character1.position.x = char1StartX + easeProgress * 0.5;
        character1.position.z = char1StartZ + easeProgress * 0.3;
        character1.rotation.y = char1StartRotY - easeProgress * (Math.PI / 8);

        character2.position.x = char2StartX - easeProgress * 0.5;
        character2.position.z = char2StartZ + easeProgress * 0.3;
        character2.rotation.y = char2StartRotY + easeProgress * (Math.PI / 8);

        // Raise and move arms for embrace
        if (progress > 0.3) {
            const armProgress = (progress - 0.3) / 0.7;

            // Character 1 arms
            character1.userData.leftArm.rotation.z = Math.PI / 12 - armProgress * (Math.PI / 3);
            character1.userData.leftArm.rotation.x = armProgress * (Math.PI / 6);
            character1.userData.rightArm.rotation.z = -Math.PI / 12 + armProgress * (Math.PI / 3);
            character1.userData.rightArm.rotation.x = armProgress * (Math.PI / 6);

            // Character 2 arms
            character2.userData.leftArm.rotation.z = Math.PI / 12 - armProgress * (Math.PI / 3);
            character2.userData.leftArm.rotation.x = armProgress * (Math.PI / 6);
            character2.userData.rightArm.rotation.z = -Math.PI / 12 + armProgress * (Math.PI / 3);
            character2.userData.rightArm.rotation.x = armProgress * (Math.PI / 6);
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function animateCameraCircle() {
    const duration = 8000;
    const startTime = Date.now();
    const startX = camera.position.x;
    const startZ = camera.position.z;
    const radius = 6;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Circle around characters
        const angle = progress * Math.PI * 0.6; // 108 degrees
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = 1.6 + Math.sin(progress * Math.PI) * 0.3;

        // Always look at the center point between characters
        camera.lookAt(0, 1.5, 0);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ===================================
// ANIMATION LOOP
// ===================================

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (isSceneActive && !choiceMade) {
        // Smooth camera movement based on mouse
        camera.position.x += (targetCameraX - camera.position.x) * CAMERA_MOVE_SPEED;
        camera.position.y += (1.6 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
        camera.lookAt(0, 1.5, 0);
    }

    if (isSceneActive) {
        // Breathing animation for characters
        if (character1 && !choiceMade) {
            const breath1 = Math.sin(elapsedTime * 0.8 + character1.userData.breathPhase) * 0.015;
            character1.scale.y = 1 + breath1;

            // Subtle head movement (looking at each other)
            character1.userData.head.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
            character1.userData.head.rotation.x = Math.sin(elapsedTime * 0.4) * 0.05;
        }

        if (character2 && !choiceMade) {
            const breath2 = Math.sin(elapsedTime * 0.9 + character2.userData.breathPhase) * 0.015;
            character2.scale.y = 1 + breath2;

            // Subtle head movement
            character2.userData.head.rotation.y = Math.sin(elapsedTime * 0.35) * 0.1;
            character2.userData.head.rotation.x = Math.sin(elapsedTime * 0.45) * 0.05;
        }

        // Emotional light pulsing
        if (emotionalLight && !choiceMade) {
            emotionalLight.intensity = emotionalLight.userData.originalIntensity +
                                      Math.sin(elapsedTime * 0.6) * 0.15;
        }

        // Flickering light effect
        if (flickerLight) {
            const flicker = Math.random() > 0.95 ? Math.random() * 0.1 : 0;
            flickerLight.intensity = flickerLight.userData.baseIntensity +
                                    Math.sin(elapsedTime * 2) * 0.08 + flicker;
        }

        // Animate particles
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime + i) * 0.0008;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 6) positions[i * 3] = -6;
                if (positions[i * 3] < -6) positions[i * 3] = 6;
                if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 5;
                if (positions[i * 3 + 2] > 6) positions[i * 3 + 2] = -6;
                if (positions[i * 3 + 2] < -6) positions[i * 3 + 2] = 6;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y = elapsedTime * 0.03;
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c💔 The Choice - An Emotional Journey 🤗', 'color: #ffd4a3; font-size: 20px; font-weight: bold;');
console.log('%cEvery choice shapes our path...', 'color: #ffd4a3; font-size: 14px;');
