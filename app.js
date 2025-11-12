// ===================================
// DREAMLIKE SEASIDE MEMORY SCENE
// A 3D Interactive Beach Experience
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let beach, ocean, sky, seashell, character, clouds, particles;
let clock, oceanSound, isSceneActive = false;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0, targetCameraZ = 0;

// Constants
const CAMERA_MOVE_SPEED = 0.015;
const MOUSE_SENSITIVITY = 0.0002;
const WAVE_SPEED = 0.3;
const WAVE_HEIGHT = 0.3;

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
    createSunsetSky();
    createSunsetLighting();
    createBeach();
    createOcean();
    createClouds();
    createSeashell();
    createCharacter();
    createParticles();
    createAmbientElements();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xff9a76, 20, 100);

    // Camera setup - positioned as if lying on beach
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0.8, 5);
    camera.lookAt(0, 1, 0);

    // Renderer setup
    const canvas = document.getElementById('scene-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    // Raycaster for mouse interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Clock for animations
    clock = new THREE.Clock();
}

// ===================================
// SUNSET SKY
// ===================================

function createSunsetSky() {
    // Create gradient sky using sphere geometry
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);

    // Create custom shader for sunset gradient
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x87ceeb) },    // Sky blue
            middleColor: { value: new THREE.Color(0xffa07a) }, // Light salmon
            bottomColor: { value: new THREE.Color(0xff6b6b) }, // Sunset red
            offset: { value: 20 },
            exponent: { value: 0.4 }
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
            uniform vec3 middleColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;

            void main() {
                float h = normalize(vWorldPosition + offset).y;
                float mixValue = pow(max(h, 0.0), exponent);

                vec3 color;
                if (h > 0.5) {
                    color = mix(middleColor, topColor, (h - 0.5) * 2.0);
                } else {
                    color = mix(bottomColor, middleColor, h * 2.0);
                }

                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.BackSide
    });

    sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Add sun
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd88,
        fog: false
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-50, 15, -100);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff9966,
        transparent: true,
        opacity: 0.3,
        fog: false
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGlow.position.copy(sun.position);

    scene.add(sun);
    scene.add(sunGlow);

    scene.userData.sun = sun;
    scene.userData.sunGlow = sunGlow;
}

// ===================================
// SUNSET LIGHTING
// ===================================

function createSunsetLighting() {
    // Ambient light - warm sunset glow
    const ambientLight = new THREE.AmbientLight(0xffa07a, 0.6);
    scene.add(ambientLight);

    // Main sun light - golden and warm
    const sunLight = new THREE.DirectionalLight(0xffaa66, 1.8);
    sunLight.position.set(-50, 30, -50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);

    // Fill light from sky
    const skyLight = new THREE.HemisphereLight(0x87ceeb, 0xffa07a, 0.5);
    scene.add(skyLight);

    // Rim light for atmospheric depth
    const rimLight = new THREE.DirectionalLight(0xff6b6b, 0.8);
    rimLight.position.set(50, 20, 50);
    scene.add(rimLight);

    // Shimmering water reflection light
    const waterLight = new THREE.PointLight(0xffd700, 1.2, 40);
    waterLight.position.set(0, 2, -10);
    scene.add(waterLight);
    scene.userData.waterLight = waterLight;
}

// ===================================
// BEACH ENVIRONMENT
// ===================================

function createBeach() {
    beach = new THREE.Group();

    // Sandy beach with texture-like appearance
    const beachGeometry = new THREE.PlaneGeometry(200, 100, 50, 50);
    const beachMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4a460,
        roughness: 0.9,
        metalness: 0.1
    });

    // Add height variation to beach
    const positions = beachGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.1;
        positions.setZ(i, wave);
    }
    positions.needsUpdate = true;
    beachGeometry.computeVertexNormals();

    const beachMesh = new THREE.Mesh(beachGeometry, beachMaterial);
    beachMesh.rotation.x = -Math.PI / 2;
    beachMesh.receiveShadow = true;
    beach.add(beachMesh);

    // Add some scattered shells and stones
    for (let i = 0; i < 20; i++) {
        const shellSize = 0.1 + Math.random() * 0.15;
        const shellGeometry = new THREE.SphereGeometry(shellSize, 8, 8);
        const shellMaterial = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0xfff5ee : 0xffe4c4,
            roughness: 0.6
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.position.set(
            (Math.random() - 0.5) * 30,
            0.05,
            Math.random() * 10 + 2
        );
        shell.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        shell.castShadow = true;
        beach.add(shell);
    }

    scene.add(beach);
}

// ===================================
// OCEAN WITH ANIMATED WAVES
// ===================================

function createOcean() {
    ocean = new THREE.Group();

    // Ocean surface with animated waves
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    const oceanMaterial = new THREE.MeshStandardMaterial({
        color: 0x4682b4,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.9
    });

    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.z = -50;
    oceanMesh.receiveShadow = true;

    // Store original positions for wave animation
    const positions = oceanGeometry.attributes.position;
    const originalPositions = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
        originalPositions[i * 3] = positions.getX(i);
        originalPositions[i * 3 + 1] = positions.getY(i);
        originalPositions[i * 3 + 2] = positions.getZ(i);
    }
    oceanMesh.userData.originalPositions = originalPositions;

    ocean.add(oceanMesh);
    scene.add(ocean);
    scene.userData.oceanMesh = oceanMesh;
}

// ===================================
// DRIFTING CLOUDS
// ===================================

function createClouds() {
    clouds = new THREE.Group();

    // Create several cloud formations
    for (let i = 0; i < 15; i++) {
        const cloud = new THREE.Group();

        // Each cloud made of multiple spheres
        const cloudPuffs = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < cloudPuffs; j++) {
            const puffSize = 2 + Math.random() * 3;
            const puffGeometry = new THREE.SphereGeometry(puffSize, 16, 16);
            const puffMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7 + Math.random() * 0.2,
                roughness: 1,
                fog: true
            });
            const puff = new THREE.Mesh(puffGeometry, puffMaterial);
            puff.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 4
            );
            cloud.add(puff);
        }

        cloud.position.set(
            (Math.random() - 0.5) * 150,
            15 + Math.random() * 20,
            -60 - Math.random() * 80
        );

        cloud.userData.speed = 0.01 + Math.random() * 0.02;
        cloud.userData.startX = cloud.position.x;

        clouds.add(cloud);
    }

    scene.add(clouds);
}

// ===================================
// SEASHELL OBJECT
// ===================================

function createSeashell() {
    seashell = new THREE.Group();
    seashell.name = 'seashell';

    // Create shell spiral shape
    const shellGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    shellGeometry.scale(1, 0.7, 1.2);

    const shellMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff5ee,
        roughness: 0.4,
        metalness: 0.2,
        emissive: 0xffddcc,
        emissiveIntensity: 0.2
    });

    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    shellMesh.castShadow = true;
    seashell.add(shellMesh);

    // Add shell details
    const detailGeometry = new THREE.TorusGeometry(0.25, 0.05, 8, 16);
    const detailMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe4c4,
        roughness: 0.5
    });

    for (let i = 0; i < 3; i++) {
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);
        detail.rotation.x = Math.PI / 2;
        detail.scale.set(1 - i * 0.2, 1 - i * 0.2, 1);
        detail.position.y = -i * 0.08;
        seashell.add(detail);
    }

    seashell.position.set(2, 0.15, 3);
    seashell.rotation.set(0.2, 0.5, 0.1);
    seashell.userData.clickable = true;

    scene.add(seashell);
}

// ===================================
// CHARACTER LYING ON BEACH
// ===================================

function createCharacter() {
    character = new THREE.Group();
    character.name = 'character';

    // Simple character representation - body lying on beach
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.3;
    body.castShadow = true;
    character.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        roughness: 0.7
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(-0.7, 0.35, 0);
    head.castShadow = true;
    character.add(head);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.1, 0.6, 8, 16);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        roughness: 0.7
    });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.2, 0.25, -0.35);
    leftArm.rotation.set(0.3, 0, Math.PI / 2);
    leftArm.castShadow = true;
    character.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(-0.2, 0.25, 0.35);
    rightArm.rotation.set(-0.3, 0, Math.PI / 2);
    rightArm.castShadow = true;
    character.add(rightArm);

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 8, 16);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x4169e1,
        roughness: 0.6
    });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0.5, 0.25, -0.2);
    leftLeg.rotation.set(0, 0, Math.PI / 2);
    leftLeg.castShadow = true;
    character.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.5, 0.25, 0.2);
    rightLeg.rotation.set(0, 0, Math.PI / 2);
    rightLeg.castShadow = true;
    character.add(rightLeg);

    character.position.set(-1.5, 0, 4);
    character.rotation.y = -0.3;

    scene.add(character);
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
        positions[i * 3 + 1] = Math.random() * 50;
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
// AMBIENT ELEMENTS
// ===================================

function createAmbientElements() {
    // Add palm tree silhouette
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(-8, 3, 2);
    trunk.castShadow = true;
    scene.add(trunk);

    // Palm leaves
    const leafGeometry = new THREE.ConeGeometry(2, 3, 8);
    const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x228b22,
        roughness: 0.8
    });

    for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(-8, 6.5, 2);
        leaf.rotation.set(
            Math.PI / 6 + i * 0.3,
            (Math.PI * 2 * i) / 5,
            0.5
        );
        leaf.castShadow = true;
        scene.add(leaf);
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Seashell click to enter scene
    const seashellScreen = document.getElementById('seashell-screen');
    const seashellElement = document.querySelector('.seashell');

    seashellElement.addEventListener('click', () => {
        enterSeasideScene();
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
    targetCameraY = 0.8 + mouseY * 0.5;
    targetCameraZ = 5 + mouseY * 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SCENE TRANSITIONS
// ===================================

function enterSeasideScene() {
    const seashellScreen = document.getElementById('seashell-screen');
    const canvas = document.getElementById('scene-canvas');
    const uiOverlay = document.getElementById('ui-overlay');
    const seashellSound = document.getElementById('seashell-sound');
    const oceanSoundElement = document.getElementById('ocean-sound');
    const ambientBeachSound = document.getElementById('ambient-beach-sound');

    // Play seashell sound first
    if (seashellSound) {
        seashellSound.volume = 0.6;
        seashellSound.play().catch(e => console.log('Seashell sound error:', e));
    }

    // Fade out seashell screen
    setTimeout(() => {
        seashellScreen.classList.add('hidden');
    }, 800);

    // Fade in 3D scene
    setTimeout(() => {
        canvas.classList.add('visible');
        uiOverlay.classList.remove('hidden');
        isSceneActive = true;

        // Start ocean sounds
        if (oceanSoundElement) {
            oceanSoundElement.volume = 0;
            oceanSoundElement.play().catch(e => console.log('Ocean sound error:', e));

            // Gradually increase ocean sound volume
            let volume = 0;
            const fadeIn = setInterval(() => {
                volume += 0.02;
                if (volume >= 0.5) {
                    volume = 0.5;
                    clearInterval(fadeIn);
                }
                oceanSoundElement.volume = volume;
            }, 100);
        }

        // Start ambient beach sound
        if (ambientBeachSound) {
            setTimeout(() => {
                ambientBeachSound.volume = 0.3;
                ambientBeachSound.play().catch(e => console.log('Ambient beach sound error:', e));
            }, 2000);
        }

        // Show beach message after a moment
        setTimeout(() => {
            const beachMessage = document.getElementById('beach-message');
            beachMessage.classList.remove('hidden');
            setTimeout(() => {
                beachMessage.classList.add('hidden');
            }, 5000);
        }, 3000);
    }, 1500);
}

// ===================================
// ANIMATION LOOP
// ===================================

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (isSceneActive) {
        // Smooth camera movement based on mouse - creates looking around effect
        camera.position.x += (targetCameraX - camera.position.x) * CAMERA_MOVE_SPEED;
        camera.position.y += (targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
        camera.position.z += (targetCameraZ - camera.position.z) * CAMERA_MOVE_SPEED;

        // Camera always looks slightly toward horizon
        camera.lookAt(
            targetCameraX * 2,
            1 + targetCameraY * 0.5,
            -10
        );

        // Animate ocean waves
        if (scene.userData.oceanMesh) {
            const oceanMesh = scene.userData.oceanMesh;
            const positions = oceanMesh.geometry.attributes.position;
            const originalPositions = oceanMesh.userData.originalPositions;

            for (let i = 0; i < positions.count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];

                // Multiple wave patterns for realism
                const wave1 = Math.sin(x * 0.1 + elapsedTime * WAVE_SPEED) * WAVE_HEIGHT;
                const wave2 = Math.cos(y * 0.15 + elapsedTime * WAVE_SPEED * 0.7) * WAVE_HEIGHT * 0.5;
                const wave3 = Math.sin((x + y) * 0.08 + elapsedTime * WAVE_SPEED * 1.3) * WAVE_HEIGHT * 0.3;

                positions.setZ(i, wave1 + wave2 + wave3);
            }

            positions.needsUpdate = true;
            oceanMesh.geometry.computeVertexNormals();
        }

        // Animate water light (golden reflections)
        if (scene.userData.waterLight) {
            const light = scene.userData.waterLight;
            light.intensity = 1.2 + Math.sin(elapsedTime * 0.5) * 0.3;
            light.position.x = Math.sin(elapsedTime * 0.3) * 5;
            light.position.z = -10 + Math.cos(elapsedTime * 0.2) * 3;
        }

        // Animate sun and glow (subtle pulsing)
        if (scene.userData.sun && scene.userData.sunGlow) {
            const sun = scene.userData.sun;
            const sunGlow = scene.userData.sunGlow;

            const pulseScale = 1 + Math.sin(elapsedTime * 0.5) * 0.1;
            sunGlow.scale.set(pulseScale, pulseScale, pulseScale);

            // Slowly set the sun (moves down very gradually)
            sun.position.y = 15 - elapsedTime * 0.01;
            sunGlow.position.copy(sun.position);
        }

        // Animate drifting clouds
        if (clouds) {
            clouds.children.forEach(cloud => {
                cloud.position.x += cloud.userData.speed;

                // Wrap clouds around
                if (cloud.position.x > 75) {
                    cloud.position.x = -75;
                }

                // Subtle floating motion
                cloud.position.y += Math.sin(elapsedTime + cloud.position.x * 0.1) * 0.002;
            });
        }

        // Animate seashell (gentle bobbing and rotation)
        if (seashell) {
            seashell.position.y = 0.15 + Math.sin(elapsedTime * 0.8) * 0.03;
            seashell.rotation.y = 0.5 + Math.sin(elapsedTime * 0.3) * 0.1;
        }

        // Animate character (breathing)
        if (character) {
            const breathe = Math.sin(elapsedTime * 0.5) * 0.015;
            character.scale.y = 1 + breathe;
        }

        // Animate particles (floating dust/light particles)
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime * 0.5 + i) * 0.002;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 50) positions[i * 3] = -50;
                if (positions[i * 3] < -50) positions[i * 3] = 50;
                if (positions[i * 3 + 1] > 50) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 50;
                if (positions[i * 3 + 2] > 50) positions[i * 3 + 2] = -50;
                if (positions[i * 3 + 2] < -50) positions[i * 3 + 2] = 50;
            }

            particles.geometry.attributes.position.needsUpdate = true;
        }

        // Subtle scene rotation for ambient motion
        if (beach) {
            beach.rotation.y = Math.sin(elapsedTime * 0.1) * 0.002;
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🌊 Dreamlike Seaside Scene 🌅', 'color: #ff9a76; font-size: 20px; font-weight: bold;');
console.log('%cRest by the ocean and dream...', 'color: #87ceeb; font-size: 14px;');
