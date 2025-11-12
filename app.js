// ===================================
// DREAMLIKE MEMORY SCENE
// A 3D Interactive Experience
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let classroom, desk, waterGlass, particles;
let clock, ambientSound, isSceneActive = false;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0;

// Constants
const CAMERA_MOVE_SPEED = 0.02;
const MOUSE_SENSITIVITY = 0.0003;

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
    createLighting();
    createClassroom();
    createDesk();
    createWaterGlass();
    createParticles();
    createWindows();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffd4a3, 10, 50);
    scene.background = new THREE.Color(0xffe4c4);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.6, 5);
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
    renderer.toneMappingExposure = 1.2;

    // Raycaster for mouse interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Clock for animations
    clock = new THREE.Clock();
}

// ===================================
// LIGHTING SYSTEM
// ===================================

function createLighting() {
    // Ambient light - soft and warm
    const ambientLight = new THREE.AmbientLight(0xffd4a3, 0.5);
    scene.add(ambientLight);

    // Golden sunlight from window
    const sunLight = new THREE.DirectionalLight(0xffd89b, 1.5);
    sunLight.position.set(-5, 8, 3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);

    // Additional soft fill light
    const fillLight = new THREE.PointLight(0xffebcd, 0.8, 20);
    fillLight.position.set(3, 3, 2);
    scene.add(fillLight);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xffc9a3, 0.6);
    rimLight.position.set(5, 3, -5);
    scene.add(rimLight);

    // Animated subtle light for atmosphere
    const atmosphereLight = new THREE.PointLight(0xffd4a3, 0.5, 15);
    atmosphereLight.position.set(0, 2, 0);
    atmosphereLight.userData.originalY = 2;
    scene.add(atmosphereLight);

    // Store for animation
    scene.userData.atmosphereLight = atmosphereLight;
}

// ===================================
// CLASSROOM ENVIRONMENT
// ===================================

function createClassroom() {
    classroom = new THREE.Group();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    classroom.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.9,
        metalness: 0.1
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    backWall.position.set(0, 3, -10);
    backWall.receiveShadow = true;
    classroom.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    leftWall.position.set(-10, 3, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    classroom.add(leftWall);

    // Right wall (with windows)
    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    rightWall.position.set(10, 3, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    classroom.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
            color: 0xfffaf0,
            roughness: 0.9
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 6;
    ceiling.receiveShadow = true;
    classroom.add(ceiling);

    // Chalkboard
    const chalkboard = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2, 0.1),
        new THREE.MeshStandardMaterial({
            color: 0x2f4f2f,
            roughness: 0.7
        })
    );
    chalkboard.position.set(0, 3, -9.9);
    classroom.add(chalkboard);

    scene.add(classroom);
}

// ===================================
// WINDOWS WITH SUNLIGHT
// ===================================

function createWindows() {
    const windowGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
        // Window frame
        const frameGeometry = new THREE.BoxGeometry(2, 2.5, 0.2);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.6
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(9.9, 3, -4 + i * 3);
        frame.rotation.y = -Math.PI / 2;

        // Window glass with transparency
        const glassGeometry = new THREE.PlaneGeometry(1.8, 2.3);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffd89b,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.9,
            thickness: 0.5
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(9.85, 3, -4 + i * 3);
        glass.rotation.y = -Math.PI / 2;

        windowGroup.add(frame);
        windowGroup.add(glass);

        // Window light rays
        const rayGeometry = new THREE.ConeGeometry(0.1, 3, 8);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd89b,
            transparent: true,
            opacity: 0.2
        });
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.set(8, 3, -4 + i * 3);
        ray.rotation.z = Math.PI / 2;
        windowGroup.add(ray);
    }

    scene.add(windowGroup);
}

// ===================================
// INTERACTIVE DESK
// ===================================

function createDesk() {
    desk = new THREE.Group();
    desk.name = 'desk';

    // Desk top
    const deskTopGeometry = new THREE.BoxGeometry(2, 0.1, 1.2);
    const deskMaterial = new THREE.MeshStandardMaterial({
        color: 0xcd853f,
        roughness: 0.6,
        metalness: 0.2
    });
    const deskTop = new THREE.Mesh(deskTopGeometry, deskMaterial);
    deskTop.position.y = 1;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    desk.add(deskTop);

    // Desk legs
    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const legPositions = [
        [-0.9, 0.5, -0.5],
        [0.9, 0.5, -0.5],
        [-0.9, 0.5, 0.5],
        [0.9, 0.5, 0.5]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, deskMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        desk.add(leg);
    });

    desk.position.set(1, 0, 2);
    desk.userData.clickable = true;
    scene.add(desk);
}

// ===================================
// WATER GLASS
// ===================================

function createWaterGlass() {
    waterGlass = new THREE.Group();
    waterGlass.name = 'waterGlass';

    // Glass container
    const glassGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.15, 16, 1, true);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.castShadow = true;
    waterGlass.add(glass);

    // Water inside
    const waterGeometry = new THREE.CylinderGeometry(0.075, 0.058, 0.12, 16);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.8
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = -0.015;
    waterGlass.add(water);

    // Glass bottom
    const bottomGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16);
    const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
    bottom.position.y = -0.075;
    waterGlass.add(bottom);

    waterGlass.position.set(1.3, 1.13, 2);
    waterGlass.userData.clickable = true;
    waterGlass.userData.water = water;
    scene.add(waterGlass);
}

// ===================================
// PARTICLE SYSTEM
// ===================================

function createParticles() {
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = Math.random() * 6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.05,
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
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Letter click to enter scene
    const letterScreen = document.getElementById('letter-screen');
    const letter = document.querySelector('.letter');

    letter.addEventListener('click', () => {
        enterMemoryScene();
    });

    // Mouse movement for camera control
    window.addEventListener('mousemove', onMouseMove);

    // Click detection for interactive objects
    window.addEventListener('click', onMouseClick);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    if (!isSceneActive) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = mouseX * 1.5;
    targetCameraY = mouseY * 0.8;
}

function onMouseClick(event) {
    if (!isSceneActive) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with clickable objects
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let intersect of intersects) {
        let object = intersect.object;

        // Traverse up to find clickable parent
        while (object.parent && !object.userData.clickable) {
            object = object.parent;
        }

        if (object.userData.clickable && object.name === 'waterGlass') {
            drinkWater();
            break;
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SCENE TRANSITIONS
// ===================================

function enterMemoryScene() {
    const letterScreen = document.getElementById('letter-screen');
    const canvas = document.getElementById('scene-canvas');
    const uiOverlay = document.getElementById('ui-overlay');
    const transitionSound = document.getElementById('transition-sound');
    const ambientSoundElement = document.getElementById('ambient-sound');

    // Play transition sound
    if (transitionSound) {
        transitionSound.volume = 0.5;
        transitionSound.play().catch(e => console.log('Transition sound error:', e));
    }

    // Fade out letter screen
    letterScreen.classList.add('hidden');

    // Fade in 3D scene
    setTimeout(() => {
        canvas.classList.add('visible');
        uiOverlay.classList.remove('hidden');
        isSceneActive = true;

        // Start ambient sound
        if (ambientSoundElement) {
            ambientSoundElement.volume = 0.3;
            ambientSoundElement.play().catch(e => console.log('Ambient sound error:', e));
        }
    }, 500);
}

// ===================================
// INTERACTIONS
// ===================================

function drinkWater() {
    const deskMessage = document.getElementById('desk-message');
    const waterSound = document.getElementById('water-sound');

    // Play water sound
    if (waterSound) {
        waterSound.volume = 0.6;
        waterSound.play().catch(e => console.log('Water sound error:', e));
    }

    // Show message
    deskMessage.classList.remove('hidden');

    setTimeout(() => {
        deskMessage.classList.add('hidden');
    }, 4000);

    // Animate water glass
    animateWaterGlass();
}

function animateWaterGlass() {
    const initialY = waterGlass.position.y;
    const water = waterGlass.userData.water;
    const duration = 2000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 0.3) {
            // Lift glass
            waterGlass.position.y = initialY + Math.sin(progress * Math.PI * 3.33) * 0.3;
        } else if (progress < 0.7) {
            // Drink (reduce water level)
            const drinkProgress = (progress - 0.3) / 0.4;
            water.scale.y = 1 - drinkProgress * 0.7;
            water.position.y = -0.015 - drinkProgress * 0.04;
        } else {
            // Put down glass
            const putDownProgress = (progress - 0.7) / 0.3;
            waterGlass.position.y = initialY + 0.3 * (1 - putDownProgress);
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            waterGlass.position.y = initialY;
            // Refill water after a moment
            setTimeout(() => {
                animateWaterRefill();
            }, 1000);
        }
    }

    animate();
}

function animateWaterRefill() {
    const water = waterGlass.userData.water;
    const duration = 1500;
    const startTime = Date.now();
    const startScale = water.scale.y;
    const startPosY = water.position.y;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        water.scale.y = startScale + (1 - startScale) * progress;
        water.position.y = startPosY + (-0.015 - startPosY) * progress;

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

    if (isSceneActive) {
        // Smooth camera movement based on mouse
        camera.position.x += (targetCameraX - camera.position.x) * CAMERA_MOVE_SPEED;
        camera.position.y += (1.6 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
        camera.lookAt(0, 1.5, 0);

        // Animate atmosphere light
        if (scene.userData.atmosphereLight) {
            const light = scene.userData.atmosphereLight;
            light.intensity = 0.5 + Math.sin(elapsedTime * 0.5) * 0.2;
            light.position.y = light.userData.originalY + Math.sin(elapsedTime * 0.3) * 0.5;
        }

        // Animate particles
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime + i) * 0.001;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 10) positions[i * 3] = -10;
                if (positions[i * 3] < -10) positions[i * 3] = 10;
                if (positions[i * 3 + 1] > 6) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 6;
                if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -10;
                if (positions[i * 3 + 2] < -10) positions[i * 3 + 2] = 10;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y = elapsedTime * 0.05;
        }

        // Subtle desk breathing animation
        if (desk) {
            desk.position.y = Math.sin(elapsedTime * 0.5) * 0.02;
        }

        // Water glass subtle shimmer
        if (waterGlass) {
            waterGlass.rotation.y = Math.sin(elapsedTime * 0.3) * 0.05;
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🌟 Dreamlike Memory Scene 🌟', 'color: #ffd89b; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to your memories...', 'color: #ffd89b; font-size: 14px;');
