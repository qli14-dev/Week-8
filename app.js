// ===================================
// DREAMLIKE RESTAURANT MEMORY SCENE
// A 3D Interactive Experience
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let restaurant, table, noodleBowl, chopsticks, steamParticles, ambientParticles;
let clock, backgroundMusic, conversationSound, isSceneActive = false;
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
    createRestaurant();
    createTable();
    createNoodleBowl();
    createChopsticks();
    createSteamParticles();
    createAmbientParticles();
    createLanterns();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffd4a3, 8, 35);
    scene.background = new THREE.Color(0xffebcd);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 1, 0);

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
// LIGHTING SYSTEM
// ===================================

function createLighting() {
    // Warm ambient light
    const ambientLight = new THREE.AmbientLight(0xffd89b, 0.6);
    scene.add(ambientLight);

    // Golden overhead light (like restaurant pendant lamps)
    const overheadLight = new THREE.PointLight(0xffcc80, 1.5, 15);
    overheadLight.position.set(0, 4, 0);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 2048;
    overheadLight.shadow.mapSize.height = 2048;
    scene.add(overheadLight);

    // Warm side lighting
    const sideLight1 = new THREE.PointLight(0xffd4a3, 0.8, 12);
    sideLight1.position.set(-4, 2.5, 2);
    sideLight1.castShadow = true;
    scene.add(sideLight1);

    const sideLight2 = new THREE.PointLight(0xffd4a3, 0.8, 12);
    sideLight2.position.set(4, 2.5, -2);
    sideLight2.castShadow = true;
    scene.add(sideLight2);

    // Soft fill light
    const fillLight = new THREE.DirectionalLight(0xffe4b5, 0.4);
    fillLight.position.set(3, 5, 5);
    scene.add(fillLight);

    // Animated atmosphere light
    const atmosphereLight = new THREE.PointLight(0xffd89b, 0.7, 10);
    atmosphereLight.position.set(0, 2, 0);
    atmosphereLight.userData.originalY = 2;
    scene.add(atmosphereLight);

    // Store for animation
    scene.userData.atmosphereLight = atmosphereLight;
    scene.userData.overheadLight = overheadLight;
}

// ===================================
// RESTAURANT ENVIRONMENT
// ===================================

function createRestaurant() {
    restaurant = new THREE.Group();

    // Floor - wooden restaurant floor
    const floorGeometry = new THREE.PlaneGeometry(25, 25);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b6f47,
        roughness: 0.7,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    restaurant.add(floor);

    // Walls - warm restaurant walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe4b5,
        roughness: 0.9,
        metalness: 0.05
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 8),
        wallMaterial
    );
    backWall.position.set(0, 4, -12);
    backWall.receiveShadow = true;
    restaurant.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 8),
        wallMaterial
    );
    leftWall.position.set(-12, 4, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    restaurant.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 8),
        wallMaterial
    );
    rightWall.position.set(12, 4, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    restaurant.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 25),
        new THREE.MeshStandardMaterial({
            color: 0xfff8e7,
            roughness: 0.9
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    restaurant.add(ceiling);

    // Add some background tables
    createBackgroundTables();

    scene.add(restaurant);
}

function createBackgroundTables() {
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.6,
        metalness: 0.2
    });

    // Create a few tables in the background
    const tablePositions = [
        [-5, 0, -5],
        [5, 0, -6],
        [-6, 0, 2],
        [6, 0, 3]
    ];

    tablePositions.forEach(pos => {
        const bgTable = new THREE.Group();

        // Table top
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.08, 1.2),
            tableMaterial
        );
        top.position.y = 0.8;
        top.castShadow = true;
        top.receiveShadow = true;
        bgTable.add(top);

        // Single center leg
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8),
            tableMaterial
        );
        leg.position.y = 0.4;
        leg.castShadow = true;
        bgTable.add(leg);

        bgTable.position.set(...pos);
        restaurant.add(bgTable);
    });
}

// ===================================
// MAIN TABLE
// ===================================

function createTable() {
    table = new THREE.Group();
    table.name = 'table';

    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.5,
        metalness: 0.3
    });

    // Round table top
    const tableTop = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.08, 32),
        tableMaterial
    );
    tableTop.position.y = 0.96;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    table.add(tableTop);

    // Table leg
    const tableLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.18, 0.9, 16),
        tableMaterial
    );
    tableLeg.position.y = 0.45;
    tableLeg.castShadow = true;
    table.add(tableLeg);

    // Table base
    const tableBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32),
        tableMaterial
    );
    tableBase.position.y = 0.025;
    tableBase.castShadow = true;
    tableBase.receiveShadow = true;
    table.add(tableBase);

    table.position.set(0, 0, 0.5);
    scene.add(table);
}

// ===================================
// NOODLE BOWL
// ===================================

function createNoodleBowl() {
    noodleBowl = new THREE.Group();
    noodleBowl.name = 'noodleBowl';

    // Bowl
    const bowlGeometry = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const bowlMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5e6d3,
        roughness: 0.4,
        metalness: 0.1
    });
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
    bowl.rotation.x = Math.PI;
    bowl.position.y = 0.15;
    bowl.castShadow = true;
    bowl.receiveShadow = true;
    noodleBowl.add(bowl);

    // Broth/Soup
    const brothGeometry = new THREE.CylinderGeometry(0.28, 0.25, 0.05, 32);
    const brothMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const broth = new THREE.Mesh(brothGeometry, brothMaterial);
    broth.position.y = 0.275;
    noodleBowl.add(broth);

    // Noodles (using curved lines)
    const noodlesGroup = new THREE.Group();
    noodlesGroup.name = 'noodles';

    for (let i = 0; i < 12; i++) {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                0.28,
                (Math.random() - 0.5) * 0.3
            ),
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                0.32,
                (Math.random() - 0.5) * 0.2
            ),
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                0.3,
                (Math.random() - 0.5) * 0.3
            )
        );

        const points = curve.getPoints(20);
        const noodleGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const noodleMaterial = new THREE.LineBasicMaterial({
            color: 0xf5deb3,
            linewidth: 3
        });
        const noodle = new THREE.Line(noodleGeometry, noodleMaterial);
        noodlesGroup.add(noodle);
    }

    noodleBowl.add(noodlesGroup);
    noodleBowl.userData.noodles = noodlesGroup;

    // Add some toppings for realism
    // Green onion pieces
    for (let i = 0; i < 5; i++) {
        const onion = new THREE.Mesh(
            new THREE.CylinderGeometry(0.008, 0.008, 0.04, 8),
            new THREE.MeshStandardMaterial({ color: 0x228b22 })
        );
        onion.position.set(
            (Math.random() - 0.5) * 0.25,
            0.31,
            (Math.random() - 0.5) * 0.25
        );
        onion.rotation.x = Math.random() * Math.PI;
        onion.rotation.z = Math.random() * Math.PI;
        noodleBowl.add(onion);
    }

    noodleBowl.position.set(0, 1.0, 0.5);
    noodleBowl.userData.clickable = true;
    scene.add(noodleBowl);
}

// ===================================
// CHOPSTICKS
// ===================================

function createChopsticks() {
    chopsticks = new THREE.Group();

    const chopstickMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.6,
        metalness: 0.1
    });

    // First chopstick
    const chopstick1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8),
        chopstickMaterial
    );
    chopstick1.position.set(0.25, 1.02, 0.4);
    chopstick1.rotation.z = Math.PI / 2;
    chopstick1.rotation.y = -0.3;
    chopstick1.castShadow = true;
    chopsticks.add(chopstick1);

    // Second chopstick
    const chopstick2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8),
        chopstickMaterial
    );
    chopstick2.position.set(0.25, 1.02, 0.45);
    chopstick2.rotation.z = Math.PI / 2;
    chopstick2.rotation.y = -0.25;
    chopstick2.castShadow = true;
    chopsticks.add(chopstick2);

    scene.add(chopsticks);
}

// ===================================
// STEAM PARTICLES
// ===================================

function createSteamParticles() {
    const particleCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const lifetimes = [];

    for (let i = 0; i < particleCount; i++) {
        // Start near the bowl
        positions[i * 3] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = 1.3 + Math.random() * 0.5;
        positions[i * 3 + 2] = 0.5 + (Math.random() - 0.5) * 0.3;

        velocities.push({
            x: (Math.random() - 0.5) * 0.002,
            y: 0.008 + Math.random() * 0.005,
            z: (Math.random() - 0.5) * 0.002
        });

        lifetimes.push(Math.random());
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    steamParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    steamParticles.userData.velocities = velocities;
    steamParticles.userData.lifetimes = lifetimes;
    scene.add(steamParticles);
}

// ===================================
// AMBIENT PARTICLES
// ===================================

function createAmbientParticles() {
    const particleCount = 150;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = Math.random() * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        velocities.push({
            x: (Math.random() - 0.5) * 0.008,
            y: (Math.random() - 0.5) * 0.008,
            z: (Math.random() - 0.5) * 0.008
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.04,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    ambientParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    ambientParticles.userData.velocities = velocities;
    scene.add(ambientParticles);
}

// ===================================
// DECORATIVE LANTERNS
// ===================================

function createLanterns() {
    const lanternPositions = [
        [-4, 3.5, -6],
        [4, 3.5, -6],
        [-5, 3.5, 4],
        [5, 3.5, 4]
    ];

    lanternPositions.forEach(pos => {
        const lantern = new THREE.Group();

        // Lantern body
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.4, 6),
            new THREE.MeshStandardMaterial({
                color: 0xff4444,
                emissive: 0xff2222,
                emissiveIntensity: 0.3,
                roughness: 0.5
            })
        );
        body.castShadow = true;
        lantern.add(body);

        // Top cap
        const topCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.22, 0.05, 6),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        topCap.position.y = 0.225;
        lantern.add(topCap);

        // Bottom cap
        const bottomCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.15, 0.05, 6),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        bottomCap.position.y = -0.225;
        lantern.add(bottomCap);

        lantern.position.set(...pos);
        scene.add(lantern);
    });
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Phone click to enter scene
    const phoneScreen = document.getElementById('phone-screen');
    const phone = document.querySelector('.phone');

    phone.addEventListener('click', () => {
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

    targetCameraX = mouseX * 2;
    targetCameraY = mouseY * 0.6;
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

        if (object.userData.clickable && object.name === 'noodleBowl') {
            eatNoodles();
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
    const phoneScreen = document.getElementById('phone-screen');
    const canvas = document.getElementById('scene-canvas');
    const uiOverlay = document.getElementById('ui-overlay');
    const transitionSound = document.getElementById('transition-sound');
    const backgroundMusicElement = document.getElementById('background-music');
    const conversationSoundElement = document.getElementById('conversation-sound');

    // Play transition sound
    if (transitionSound) {
        transitionSound.volume = 0.4;
        transitionSound.play().catch(e => console.log('Transition sound error:', e));
    }

    // Fade out phone screen
    phoneScreen.classList.add('hidden');

    // Fade in 3D scene
    setTimeout(() => {
        canvas.classList.add('visible');
        uiOverlay.classList.remove('hidden');
        isSceneActive = true;

        // Start background music
        if (backgroundMusicElement) {
            backgroundMusicElement.volume = 0.25;
            backgroundMusicElement.play().catch(e => console.log('Music error:', e));
        }

        // Start conversation ambient sound
        if (conversationSoundElement) {
            conversationSoundElement.volume = 0.15;
            conversationSoundElement.play().catch(e => console.log('Conversation sound error:', e));
        }
    }, 500);
}

// ===================================
// INTERACTIONS
// ===================================

function eatNoodles() {
    const noodleMessage = document.getElementById('noodle-message');
    const eatingSound = document.getElementById('eating-sound');

    // Play eating sound
    if (eatingSound) {
        eatingSound.volume = 0.5;
        eatingSound.currentTime = 0;
        eatingSound.play().catch(e => console.log('Eating sound error:', e));
    }

    // Show message
    noodleMessage.classList.remove('hidden');

    setTimeout(() => {
        noodleMessage.classList.add('hidden');
    }, 4000);

    // Animate noodles being eaten
    animateNoodleEating();
}

function animateNoodleEating() {
    const noodles = noodleBowl.userData.noodles;
    const duration = 2500;
    const startTime = Date.now();
    const initialScale = noodles.scale.clone();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Noodles shrink and rotate slightly
        const scale = 1 - progress * 0.6;
        noodles.scale.set(scale, scale, scale);
        noodles.rotation.y = progress * Math.PI * 0.5;
        noodles.position.y = 0.28 - progress * 0.1;

        // Bowl tilts slightly
        if (progress < 0.3) {
            noodleBowl.rotation.x = Math.sin(progress * Math.PI * 3.33) * 0.15;
        } else {
            noodleBowl.rotation.x = 0;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Restore noodles after a moment
            setTimeout(() => {
                restoreNoodles(initialScale);
            }, 1500);
        }
    }

    animate();
}

function restoreNoodles(initialScale) {
    const noodles = noodleBowl.userData.noodles;
    const duration = 2000;
    const startTime = Date.now();
    const startScale = noodles.scale.clone();
    const startRotation = noodles.rotation.y;
    const startPosY = noodles.position.y;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smoothly restore
        noodles.scale.lerpVectors(startScale, initialScale, progress);
        noodles.rotation.y = startRotation * (1 - progress);
        noodles.position.y = startPosY + (0.28 - startPosY) * progress;

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
        camera.position.y += (1.5 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
        camera.lookAt(0, 1, 0);

        // Animate atmosphere light
        if (scene.userData.atmosphereLight) {
            const light = scene.userData.atmosphereLight;
            light.intensity = 0.7 + Math.sin(elapsedTime * 0.4) * 0.2;
        }

        // Animate overhead light (flickering effect)
        if (scene.userData.overheadLight) {
            const light = scene.userData.overheadLight;
            light.intensity = 1.5 + Math.sin(elapsedTime * 3) * 0.05;
        }

        // Animate steam particles
        if (steamParticles) {
            const positions = steamParticles.geometry.attributes.position.array;
            const velocities = steamParticles.userData.velocities;
            const lifetimes = steamParticles.userData.lifetimes;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                // Update lifetime
                lifetimes[i] += 0.01;

                // Reset particle if it's too high or old
                if (positions[i * 3 + 1] > 2.5 || lifetimes[i] > 1) {
                    positions[i * 3] = (Math.random() - 0.5) * 0.3;
                    positions[i * 3 + 1] = 1.3;
                    positions[i * 3 + 2] = 0.5 + (Math.random() - 0.5) * 0.3;
                    lifetimes[i] = 0;
                }
            }

            steamParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate ambient particles
        if (ambientParticles) {
            const positions = ambientParticles.geometry.attributes.position.array;
            const velocities = ambientParticles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime * 0.5 + i) * 0.0005;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 10) positions[i * 3] = -10;
                if (positions[i * 3] < -10) positions[i * 3] = 10;
                if (positions[i * 3 + 1] > 8) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 8;
                if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -10;
                if (positions[i * 3 + 2] < -10) positions[i * 3 + 2] = 10;
            }

            ambientParticles.geometry.attributes.position.needsUpdate = true;
            ambientParticles.rotation.y = elapsedTime * 0.02;
        }

        // Subtle table breathing animation
        if (table) {
            table.position.y = Math.sin(elapsedTime * 0.4) * 0.01;
        }

        // Noodle bowl subtle animation
        if (noodleBowl) {
            noodleBowl.position.y = 1.0 + Math.sin(elapsedTime * 0.5) * 0.008;
        }

        // Chopsticks subtle movement
        if (chopsticks) {
            chopsticks.children.forEach((stick, index) => {
                stick.rotation.x = Math.sin(elapsedTime * 0.3 + index) * 0.02;
            });
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🍜 Dreamlike Restaurant Memory 🍜', 'color: #ffd89b; font-size: 20px; font-weight: bold;');
console.log('%cWelcome back to that warm afternoon...', 'color: #ffd89b; font-size: 14px;');
