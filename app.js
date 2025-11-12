// ===================================
// SEASIDE SUNSET DREAMLIKE SCENE
// A 3D Interactive Beach Experience
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let beach, ocean, sky, character, particles;
let clock, isSceneActive = false;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0, targetCameraZ = 0;

// Audio variables
let oceanWavesAudio, seashellAudio, oceanBreezeAudio;

// Constants
const CAMERA_MOVE_SPEED = 0.015;
const MOUSE_SENSITIVITY = 0.0003;
const WAVE_SPEED = 0.5;
const WAVE_HEIGHT = 0.3;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
    setupAudio();
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
    createSunsetLighting();
    createSky();
    createBeach();
    createOcean();
    createCharacter();
    createParticles();
    createSeagulls();
    createClouds();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup with sunset fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xff9a76, 0.03);

    // Camera setup - positioned to view the beach and ocean
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.2, 5);
    camera.lookAt(0, 1, -10);

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
    renderer.toneMappingExposure = 1.3;

    // Raycaster for mouse interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Clock for animations
    clock = new THREE.Clock();
}

// ===================================
// SUNSET LIGHTING SYSTEM
// ===================================

function createSunsetLighting() {
    // Warm ambient light
    const ambientLight = new THREE.AmbientLight(0xffb380, 0.6);
    scene.add(ambientLight);

    // Sun light - golden and warm
    const sunLight = new THREE.DirectionalLight(0xffa500, 1.8);
    sunLight.position.set(-20, 15, -30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);

    // Hemisphere light for natural gradient
    const hemiLight = new THREE.HemisphereLight(0xff9a56, 0x804674, 0.8);
    scene.add(hemiLight);

    // Warm fill light from the horizon
    const horizonLight = new THREE.PointLight(0xff6e94, 1.5, 100);
    horizonLight.position.set(0, 5, -40);
    scene.add(horizonLight);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.8);
    rimLight.position.set(20, 10, -20);
    scene.add(rimLight);

    // Animated atmospheric light
    const atmosphereLight = new THREE.PointLight(0xffb380, 1.2, 30);
    atmosphereLight.position.set(0, 3, -15);
    atmosphereLight.userData.originalY = 3;
    scene.add(atmosphereLight);

    // Store for animation
    scene.userData.atmosphereLight = atmosphereLight;
    scene.userData.sunLight = sunLight;
}

// ===================================
// SKY AND SUNSET
// ===================================

function createSky() {
    // Sky gradient using a large sphere
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0xa855f7) },
            bottomColor: { value: new THREE.Color(0xff9a56) },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide
    });

    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyMesh);

    // Create sun sphere
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.9
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-30, 10, -80);
    scene.add(sun);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6e94,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(sun.position);
    scene.add(glow);

    scene.userData.sun = sun;
    scene.userData.sunGlow = glow;
}

// ===================================
// BEACH ENVIRONMENT
// ===================================

function createBeach() {
    beach = new THREE.Group();

    // Sand plane with texture-like appearance
    const sandGeometry = new THREE.PlaneGeometry(200, 100, 50, 50);
    const sandMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4a460,
        roughness: 0.95,
        metalness: 0.05
    });

    // Add some randomness to sand vertices for natural look
    const positions = sandGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        const x = positions.getX(i);
        const z = positions.getZ(i);

        // Create gentle dunes
        const height = Math.sin(x * 0.1) * 0.3 + Math.cos(z * 0.15) * 0.2;
        positions.setZ(i, z + height);
    }
    positions.needsUpdate = true;
    sandGeometry.computeVertexNormals();

    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = 0;
    sand.receiveShadow = true;
    beach.add(sand);

    // Add some scattered pebbles
    for (let i = 0; i < 30; i++) {
        const pebbleGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
        const pebbleMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.1, 0.3, 0.3 + Math.random() * 0.2),
            roughness: 0.8
        });
        const pebble = new THREE.Mesh(pebbleGeometry, pebbleMaterial);
        pebble.position.set(
            (Math.random() - 0.5) * 20,
            0.05,
            (Math.random() - 0.5) * 10 + 2
        );
        pebble.castShadow = true;
        beach.add(pebble);
    }

    scene.add(beach);
}

// ===================================
// OCEAN WITH WAVES
// ===================================

function createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);

    const oceanMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1e90ff,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.6,
        transmission: 0.3,
        thickness: 2,
        envMapIntensity: 1.5
    });

    ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.2;
    ocean.position.z = -50;
    ocean.receiveShadow = true;

    // Store original positions for wave animation
    const positions = oceanGeometry.attributes.position;
    ocean.userData.originalPositions = [];
    for (let i = 0; i < positions.count; i++) {
        ocean.userData.originalPositions.push({
            x: positions.getX(i),
            y: positions.getY(i),
            z: positions.getZ(i)
        });
    }

    scene.add(ocean);
}

// ===================================
// CHARACTER LYING ON BEACH
// ===================================

function createCharacter() {
    character = new THREE.Group();

    // Body (lying down)
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff9980,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    body.rotation.x = Math.PI / 8;
    body.position.set(0, 0.35, 0);
    body.castShadow = true;
    character.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffb399,
        roughness: 0.6
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(-0.8, 0.45, 0);
    head.castShadow = true;
    character.add(head);

    // Legs (bent)
    const legGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 8, 16);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0xff9980,
        roughness: 0.7
    });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0.8, 0.25, 0.2);
    leftLeg.rotation.z = Math.PI / 2;
    leftLeg.rotation.y = Math.PI / 6;
    leftLeg.castShadow = true;
    character.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.8, 0.25, -0.2);
    rightLeg.rotation.z = Math.PI / 2;
    rightLeg.rotation.y = -Math.PI / 6;
    rightLeg.castShadow = true;
    character.add(rightLeg);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.12, 0.7, 8, 16);

    const leftArm = new THREE.Mesh(armGeometry, legMaterial);
    leftArm.position.set(-0.3, 0.4, 0.4);
    leftArm.rotation.z = Math.PI / 2;
    leftArm.rotation.y = Math.PI / 4;
    leftArm.castShadow = true;
    character.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, legMaterial);
    rightArm.position.set(-0.3, 0.3, -0.4);
    rightArm.rotation.z = Math.PI / 2;
    rightArm.rotation.y = -Math.PI / 4;
    rightArm.castShadow = true;
    character.add(rightArm);

    character.position.set(-2, 0, 1);
    scene.add(character);
}

// ===================================
// CLOUDS
// ===================================

function createClouds() {
    const clouds = new THREE.Group();

    for (let i = 0; i < 15; i++) {
        const cloudGroup = new THREE.Group();

        // Each cloud made of several spheres
        for (let j = 0; j < 5; j++) {
            const cloudGeometry = new THREE.SphereGeometry(2 + Math.random() * 2, 8, 8);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd4a3,
                transparent: true,
                opacity: 0.4 + Math.random() * 0.2
            });
            const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloudPart.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 4
            );
            cloudGroup.add(cloudPart);
        }

        cloudGroup.position.set(
            (Math.random() - 0.5) * 100,
            15 + Math.random() * 20,
            -50 - Math.random() * 50
        );

        cloudGroup.userData.speed = 0.01 + Math.random() * 0.02;
        cloudGroup.userData.initialX = cloudGroup.position.x;

        clouds.add(cloudGroup);
    }

    scene.userData.clouds = clouds;
    scene.add(clouds);
}

// ===================================
// SEAGULLS (Simple flying objects)
// ===================================

function createSeagulls() {
    const seagulls = new THREE.Group();

    for (let i = 0; i < 5; i++) {
        const seagullGroup = new THREE.Group();

        // Simple bird shape - body
        const bodyGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        bodyGeometry.scale(1.5, 1, 1);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        seagullGroup.add(body);

        // Wings
        const wingGeometry = new THREE.PlaneGeometry(0.4, 0.15);
        const wingMaterial = new THREE.MeshBasicMaterial({
            color: 0xf0f0f0,
            side: THREE.DoubleSide
        });

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-0.3, 0, 0);
        leftWing.rotation.y = Math.PI / 6;
        seagullGroup.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0.3, 0, 0);
        rightWing.rotation.y = -Math.PI / 6;
        seagullGroup.add(rightWing);

        seagullGroup.userData.leftWing = leftWing;
        seagullGroup.userData.rightWing = rightWing;

        seagullGroup.position.set(
            (Math.random() - 0.5) * 40,
            8 + Math.random() * 10,
            -20 - Math.random() * 30
        );

        seagullGroup.userData.speed = 0.5 + Math.random() * 0.5;
        seagullGroup.userData.pathOffset = Math.random() * Math.PI * 2;

        seagulls.add(seagullGroup);
    }

    scene.userData.seagulls = seagulls;
    scene.add(seagulls);
}

// ===================================
// PARTICLE SYSTEM
// ===================================

function createParticles() {
    const particleCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = Math.random() * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffddaa,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData.velocities = velocities;
    scene.add(particles);
}

// ===================================
// AUDIO SETUP
// ===================================

function setupAudio() {
    // Create ocean waves audio using Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const audioContext = new AudioContext();

        // We'll use oscillators to create ocean-like sounds
        oceanWavesAudio = {
            context: audioContext,
            oscillators: [],
            gainNodes: [],
            start: function() {
                // Create multiple oscillators for rich ocean sound
                for (let i = 0; i < 3; i++) {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.type = 'sine';
                    oscillator.frequency.value = 50 + i * 30 + Math.random() * 20;

                    gainNode.gain.value = 0;

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.start();

                    this.oscillators.push(oscillator);
                    this.gainNodes.push(gainNode);
                }
            },
            fadeIn: function(duration = 2000) {
                const startTime = audioContext.currentTime;
                this.gainNodes.forEach((gainNode, index) => {
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(
                        0.03 + index * 0.01,
                        startTime + duration / 1000
                    );
                });
            },
            animate: function(time) {
                // Modulate frequency for wave-like effect
                this.oscillators.forEach((osc, index) => {
                    osc.frequency.value = 50 + index * 30 + Math.sin(time * 0.5 + index) * 10;
                });
            }
        };

        seashellAudio = {
            context: audioContext,
            oscillator: null,
            gainNode: null,
            start: function() {
                this.oscillator = audioContext.createOscillator();
                this.gainNode = audioContext.createGain();

                this.oscillator.type = 'sine';
                this.oscillator.frequency.value = 200;

                this.gainNode.gain.value = 0.1;

                this.oscillator.connect(this.gainNode);
                this.gainNode.connect(audioContext.destination);

                this.oscillator.start();
                this.oscillator.stop(audioContext.currentTime + 2);
            }
        };
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Seashell click to enter scene
    const seashellScreen = document.getElementById('seashell-screen');
    const seashell = document.getElementById('seashell-trigger');

    seashell.addEventListener('click', () => {
        enterBeachScene();
    });

    // Mouse movement for camera control
    window.addEventListener('mousemove', onMouseMove);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    if (!isSceneActive) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = mouseX * 2;
    targetCameraY = mouseY * 0.5;
    targetCameraZ = -mouseX * 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SCENE TRANSITIONS
// ===================================

function enterBeachScene() {
    const seashellScreen = document.getElementById('seashell-screen');
    const canvas = document.getElementById('scene-canvas');
    const uiOverlay = document.getElementById('ui-overlay');
    const oceanMessage = document.getElementById('ocean-message');

    // Play seashell sound
    if (seashellAudio && seashellAudio.start) {
        seashellAudio.start();
    }

    // Fade out seashell screen
    seashellScreen.classList.add('hidden');

    // Fade in 3D scene
    setTimeout(() => {
        canvas.classList.add('visible');
        uiOverlay.classList.remove('hidden');
        isSceneActive = true;

        // Start ocean waves sound
        if (oceanWavesAudio && oceanWavesAudio.start) {
            oceanWavesAudio.start();
            oceanWavesAudio.fadeIn(3000);
        }

        // Show welcome message
        setTimeout(() => {
            oceanMessage.classList.remove('hidden');
            setTimeout(() => {
                oceanMessage.classList.add('hidden');
            }, 4000);
        }, 1000);
    }, 500);
}

// ===================================
// ANIMATION LOOP
// ===================================

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (isSceneActive) {
        // Smooth camera movement based on mouse
        camera.position.x += (targetCameraX - camera.position.x) * CAMERA_MOVE_SPEED;
        camera.position.y += (1.2 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
        camera.position.z += (5 + targetCameraZ - camera.position.z) * CAMERA_MOVE_SPEED;

        // Camera looks towards the horizon
        const lookAtX = targetCameraX * 0.5;
        const lookAtY = 1 + targetCameraY * 0.3;
        const lookAtZ = -10;
        camera.lookAt(lookAtX, lookAtY, lookAtZ);

        // Animate ocean waves
        if (ocean) {
            const positions = ocean.geometry.attributes.position;
            const originalPositions = ocean.userData.originalPositions;

            for (let i = 0; i < positions.count; i++) {
                const original = originalPositions[i];
                const x = original.x;
                const y = original.y;

                // Create wave pattern
                const wave1 = Math.sin(x * 0.1 + elapsedTime * WAVE_SPEED) * WAVE_HEIGHT;
                const wave2 = Math.cos(y * 0.15 + elapsedTime * WAVE_SPEED * 0.7) * WAVE_HEIGHT * 0.5;
                const wave3 = Math.sin((x + y) * 0.08 + elapsedTime * WAVE_SPEED * 1.3) * WAVE_HEIGHT * 0.3;

                positions.setZ(i, wave1 + wave2 + wave3);
            }

            positions.needsUpdate = true;
            ocean.geometry.computeVertexNormals();
        }

        // Animate atmosphere light
        if (scene.userData.atmosphereLight) {
            const light = scene.userData.atmosphereLight;
            light.intensity = 1.2 + Math.sin(elapsedTime * 0.5) * 0.3;
            light.position.y = light.userData.originalY + Math.sin(elapsedTime * 0.3) * 0.5;
        }

        // Animate sun position slightly
        if (scene.userData.sun) {
            const sun = scene.userData.sun;
            const glow = scene.userData.sunGlow;
            sun.position.y = 10 + Math.sin(elapsedTime * 0.1) * 2;
            glow.position.copy(sun.position);
            glow.scale.setScalar(1 + Math.sin(elapsedTime * 0.5) * 0.1);
        }

        // Animate particles (dust in breeze)
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x + Math.sin(elapsedTime + i) * 0.001;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 50) positions[i * 3] = -50;
                if (positions[i * 3] < -50) positions[i * 3] = 50;
                if (positions[i * 3 + 1] > 30) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 30;
                if (positions[i * 3 + 2] > 50) positions[i * 3 + 2] = -50;
                if (positions[i * 3 + 2] < -50) positions[i * 3 + 2] = 50;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y = elapsedTime * 0.02;
        }

        // Animate character breathing
        if (character) {
            character.position.y = Math.sin(elapsedTime * 0.8) * 0.03;
            character.rotation.z = Math.sin(elapsedTime * 0.5) * 0.02;
        }

        // Animate clouds drifting
        if (scene.userData.clouds) {
            scene.userData.clouds.children.forEach(cloud => {
                cloud.position.x += cloud.userData.speed;
                if (cloud.position.x > 60) {
                    cloud.position.x = -60;
                }
                cloud.position.y += Math.sin(elapsedTime * 0.2 + cloud.position.x * 0.01) * 0.01;
            });
        }

        // Animate seagulls
        if (scene.userData.seagulls) {
            scene.userData.seagulls.children.forEach(seagull => {
                const offset = seagull.userData.pathOffset;
                seagull.position.x += seagull.userData.speed * 0.02;
                seagull.position.y += Math.sin(elapsedTime * 0.5 + offset) * 0.05;
                seagull.position.z += Math.cos(elapsedTime * 0.3 + offset) * 0.02;

                // Wrap seagulls
                if (seagull.position.x > 50) {
                    seagull.position.x = -50;
                }

                // Animate wings
                const wingAngle = Math.sin(elapsedTime * 5 + offset) * 0.5;
                seagull.userData.leftWing.rotation.y = Math.PI / 6 + wingAngle;
                seagull.userData.rightWing.rotation.y = -Math.PI / 6 - wingAngle;
            });
        }

        // Animate ocean audio
        if (oceanWavesAudio && oceanWavesAudio.animate) {
            oceanWavesAudio.animate(elapsedTime);
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🌊 Seaside Sunset Scene 🌅', 'color: #ff9a56; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to your dreamlike escape...', 'color: #ff9a56; font-size: 14px;');
