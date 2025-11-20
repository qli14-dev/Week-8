// ===================================
// CHOICE-BASED INTERACTIVE 3D STORY
// Three Emotional Worlds
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let clock;
let currentScene = 'living-room'; // 'living-room', 'communicate', 'leave'
let isTransitioning = false;

// Scene objects
let livingRoomObjects = {};
let communicateObjects = {};
let leaveObjects = {};

// Mouse tracking
let mouseX = 0, mouseY = 0;
let isDragging = false;

// Constants
const CAMERA_MOVE_SPEED = 0.02;

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

    // Initialize Three.js
    initThreeJS();

    // Create the initial living room scene
    createLivingRoomScene();

    // Start animation loop
    animate();

    // Show the scene after a moment
    setTimeout(() => {
        document.getElementById('scene-canvas').classList.add('visible');
        startLivingRoomAnimation();
    }, 2000);
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a1a, 5, 25);
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.6, 4);
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
    renderer.toneMappingExposure = 0.8;

    // Raycaster for mouse interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Clock for animations
    clock = new THREE.Clock();
}

// ===================================
// SCENE 1: LIVING ROOM (ARGUMENT)
// ===================================

function createLivingRoomScene() {
    livingRoomObjects.group = new THREE.Group();

    // Dim ambient light
    const ambientLight = new THREE.AmbientLight(0x3a3a3a, 0.3);
    livingRoomObjects.group.add(ambientLight);

    // Flickering overhead light
    const overheadLight = new THREE.PointLight(0xff9966, 0.8, 20);
    overheadLight.position.set(0, 3, 0);
    overheadLight.castShadow = true;
    livingRoomObjects.overheadLight = overheadLight;
    livingRoomObjects.group.add(overheadLight);

    // Red accent light for tension
    const tensionLight = new THREE.PointLight(0xff3333, 0.4, 15);
    tensionLight.position.set(-3, 2, -2);
    livingRoomObjects.group.add(tensionLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        roughness: 0.9,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    livingRoomObjects.group.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.8
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    backWall.position.set(0, 2.5, -7);
    backWall.receiveShadow = true;
    livingRoomObjects.group.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    leftWall.position.set(-7, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    livingRoomObjects.group.add(leftWall);

    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    rightWall.position.set(7, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    livingRoomObjects.group.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    livingRoomObjects.group.add(ceiling);

    // Create furniture (couch, table with shaking objects)
    createLivingRoomFurniture();

    scene.add(livingRoomObjects.group);
}

function createLivingRoomFurniture() {
    // Couch
    const couchGroup = new THREE.Group();
    const couchBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.8, 1),
        new THREE.MeshStandardMaterial({ color: 0x4a3829, roughness: 0.7 })
    );
    couchBody.position.y = 0.4;
    couchBody.castShadow = true;
    couchGroup.add(couchBody);

    const couchBack = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.8, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x4a3829, roughness: 0.7 })
    );
    couchBack.position.set(0, 0.8, -0.4);
    couchBack.castShadow = true;
    couchGroup.add(couchBack);

    couchGroup.position.set(-3, 0, -5);
    livingRoomObjects.group.add(couchGroup);

    // Coffee table
    const tableGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.05, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.6 })
    );
    tableTop.position.y = 0.5;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1810 });
    const legPositions = [
        [-0.7, 0.25, -0.35],
        [0.7, 0.25, -0.35],
        [-0.7, 0.25, 0.35],
        [0.7, 0.25, 0.35]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        tableGroup.add(leg);
    });

    tableGroup.position.set(0, 0, 0);
    livingRoomObjects.group.add(tableGroup);

    // Shaking objects on table
    livingRoomObjects.shakingObjects = [];

    // Vase
    const vase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.06, 0.25, 16),
        new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.3, metalness: 0.3 })
    );
    vase.position.set(-0.4, 0.675, 0);
    vase.castShadow = true;
    vase.userData.shakingObject = true;
    vase.userData.baseY = 0.675;
    livingRoomObjects.shakingObjects.push(vase);
    tableGroup.add(vase);

    // Glass
    const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.05, 0.15, 16),
        new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.9
        })
    );
    glass.position.set(0.3, 0.6, 0.2);
    glass.castShadow = true;
    glass.userData.shakingObject = true;
    glass.userData.baseY = 0.6;
    livingRoomObjects.shakingObjects.push(glass);
    tableGroup.add(glass);

    // Remote control
    const remote = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.03, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 })
    );
    remote.position.set(0.1, 0.555, -0.15);
    remote.castShadow = true;
    remote.userData.shakingObject = true;
    remote.userData.baseY = 0.555;
    livingRoomObjects.shakingObjects.push(remote);
    tableGroup.add(remote);

    // Book
    const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.02, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8 })
    );
    book.position.set(-0.2, 0.545, 0.25);
    book.rotation.y = 0.3;
    book.castShadow = true;
    book.userData.shakingObject = true;
    book.userData.baseY = 0.545;
    livingRoomObjects.shakingObjects.push(book);
    tableGroup.add(book);
}

function startLivingRoomAnimation() {
    // Show choice buttons after a moment
    setTimeout(() => {
        const choiceOverlay = document.getElementById('choice-overlay');
        choiceOverlay.classList.remove('hidden');

        const instructions = document.getElementById('scene-instructions');
        instructions.classList.remove('hidden');
        instructions.querySelector('.instruction-text').textContent =
            'The tension is palpable... Choose your path';
    }, 3000);
}

// ===================================
// SCENE 2: COMMUNICATE (WARM FAMILY)
// ===================================

function createCommunicateScene() {
    communicateObjects.group = new THREE.Group();

    // Change scene appearance
    scene.fog = new THREE.Fog(0xffe4c4, 15, 40);
    scene.background = new THREE.Color(0xffd4a3);

    // Warm sunny lighting
    const ambientLight = new THREE.AmbientLight(0xffd4a3, 0.6);
    communicateObjects.group.add(ambientLight);

    // Golden sunlight
    const sunLight = new THREE.DirectionalLight(0xffd89b, 1.8);
    sunLight.position.set(-5, 10, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    communicateObjects.group.add(sunLight);

    // Warm fill light
    const fillLight = new THREE.PointLight(0xffebcd, 1.0, 25);
    fillLight.position.set(3, 3, 3);
    communicateObjects.group.add(fillLight);

    // Floor - warm wood
    const floorGeometry = new THREE.PlaneGeometry(25, 25);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.7,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    communicateObjects.group.add(floor);

    // Walls - warm cream
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.9
    });

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 8),
        wallMaterial
    );
    backWall.position.set(0, 4, -12);
    backWall.receiveShadow = true;
    communicateObjects.group.add(backWall);

    // Create family members
    createFamilyMembers();

    // Create particle system (dust particles in sunlight)
    createGoldenParticles();

    scene.add(communicateObjects.group);
}

function createFamilyMembers() {
    communicateObjects.familyMembers = [];

    const familyPositions = [
        { x: -2, z: 2, color: 0xff6b9d, name: 'Mother' },
        { x: 2, z: 2, color: 0x4a90e2, name: 'Father' },
        { x: 0, z: 3, color: 0xf39c12, name: 'Sibling' }
    ];

    familyPositions.forEach((data, index) => {
        const familyMember = new THREE.Group();

        // Body
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.25, 1.2, 16),
            new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.6 })
        );
        body.position.y = 1;
        body.castShadow = true;
        familyMember.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffd4a3, roughness: 0.5 })
        );
        head.position.y = 1.8;
        head.castShadow = true;
        familyMember.add(head);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8);
        const armMaterial = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.6 });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.35, 1.2, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        familyMember.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.35, 1.2, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        familyMember.add(rightArm);

        familyMember.position.set(data.x, 0, data.z);
        familyMember.userData.clickable = true;
        familyMember.userData.name = data.name;
        familyMember.userData.baseY = 0;
        familyMember.userData.animationOffset = index * Math.PI * 0.5;

        communicateObjects.familyMembers.push(familyMember);
        communicateObjects.group.add(familyMember);
    });
}

function createGoldenParticles() {
    const particleCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 1] = Math.random() * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    communicateObjects.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    communicateObjects.particles.userData.velocities = velocities;
    communicateObjects.particles.userData.draggable = true;
    communicateObjects.group.add(communicateObjects.particles);
}

// ===================================
// SCENE 3: LEAVE (FUTURISTIC CITY)
// ===================================

function createLeaveScene() {
    leaveObjects.group = new THREE.Group();

    // Change scene appearance
    scene.fog = new THREE.Fog(0x0a0a1a, 10, 60);
    scene.background = new THREE.Color(0x0a0a1a);

    // Dark ambient light
    const ambientLight = new THREE.AmbientLight(0x1a1a2a, 0.2);
    leaveObjects.group.add(ambientLight);

    // Moonlight
    const moonLight = new THREE.DirectionalLight(0x4a5f8f, 0.3);
    moonLight.position.set(10, 20, 5);
    moonLight.castShadow = true;
    leaveObjects.group.add(moonLight);

    // Ground - dark concrete
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9,
        metalness: 0.3
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    leaveObjects.group.add(ground);

    // Create neon cityscape
    createNeonCityscape();

    // Create fog effect
    createCityFog();

    // Player position marker (simple circle on ground)
    const playerMarker = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 32),
        new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        })
    );
    playerMarker.rotation.x = -Math.PI / 2;
    playerMarker.position.y = 0.01;
    leaveObjects.group.add(playerMarker);

    scene.add(leaveObjects.group);
}

function createNeonCityscape() {
    leaveObjects.buildings = [];
    leaveObjects.neonLights = [];

    // Create buildings in a grid
    const gridSize = 8;
    const spacing = 15;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            // Skip center area (where player stands)
            if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;

            const height = Math.random() * 30 + 20;
            const width = Math.random() * 5 + 3;
            const depth = Math.random() * 5 + 3;

            // Building
            const building = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial({
                    color: 0x1a1a2a,
                    roughness: 0.8,
                    metalness: 0.4
                })
            );
            building.position.set(x * spacing, height / 2, z * spacing);
            building.castShadow = true;
            building.receiveShadow = true;
            leaveObjects.buildings.push(building);
            leaveObjects.group.add(building);

            // Neon lights on buildings
            const neonColors = [0x00ffff, 0xff00ff, 0xff0080, 0x00ff80, 0xffff00];
            const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];

            // Create multiple neon strips per building
            const numStrips = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numStrips; i++) {
                const stripHeight = Math.random() * 0.5 + 0.2;
                const stripY = (Math.random() * 0.7 + 0.2) * height;

                const neonStrip = new THREE.Mesh(
                    new THREE.BoxGeometry(width + 0.1, stripHeight, depth + 0.1),
                    new THREE.MeshStandardMaterial({
                        color: neonColor,
                        emissive: neonColor,
                        emissiveIntensity: 2,
                        roughness: 0.2,
                        metalness: 0.8
                    })
                );
                neonStrip.position.set(x * spacing, stripY, z * spacing);

                // Add point light for glow
                const neonLight = new THREE.PointLight(neonColor, 2, 15);
                neonLight.position.copy(neonStrip.position);
                neonLight.userData.flickerSpeed = Math.random() * 2 + 1;
                neonLight.userData.baseIntensity = 2;

                leaveObjects.neonLights.push(neonLight);
                leaveObjects.group.add(neonStrip);
                leaveObjects.group.add(neonLight);
            }
        }
    }
}

function createCityFog() {
    leaveObjects.fogParticles = [];

    const fogCount = 50;

    for (let i = 0; i < fogCount; i++) {
        const fogGeometry = new THREE.PlaneGeometry(10, 3);
        const fogMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a5f8f,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });

        const fogPlane = new THREE.Mesh(fogGeometry, fogMaterial);
        fogPlane.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 5 + 1,
            (Math.random() - 0.5) * 100
        );
        fogPlane.rotation.y = Math.random() * Math.PI * 2;

        fogPlane.userData.velocity = {
            x: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };

        leaveObjects.fogParticles.push(fogPlane);
        leaveObjects.group.add(fogPlane);
    }
}

// ===================================
// SCENE TRANSITIONS
// ===================================

function transitionToCommunicate() {
    if (isTransitioning) return;
    isTransitioning = true;

    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.add('hidden');

    const instructions = document.getElementById('scene-instructions');
    instructions.querySelector('.instruction-text').textContent =
        'Click family members to interact • Drag to move golden particles';

    // Fade out living room
    fadeOutScene(livingRoomObjects.group, () => {
        livingRoomObjects.group.visible = false;

        // Create and fade in communicate scene
        createCommunicateScene();
        fadeInScene(communicateObjects.group, () => {
            currentScene = 'communicate';
            isTransitioning = false;

            // Show text bubbles container
            document.getElementById('text-bubbles').classList.remove('hidden');

            // Play sounds
            playSceneAudio('communicate');
        });
    });
}

function transitionToLeave() {
    if (isTransitioning) return;
    isTransitioning = true;

    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.add('hidden');

    const instructions = document.getElementById('scene-instructions');
    instructions.querySelector('.instruction-text').textContent =
        'Drag to rotate camera • Click to hear footsteps';

    // Fade out living room
    fadeOutScene(livingRoomObjects.group, () => {
        livingRoomObjects.group.visible = false;

        // Create and fade in leave scene
        createLeaveScene();
        fadeInScene(leaveObjects.group, () => {
            currentScene = 'leave';
            isTransitioning = false;

            // Play sounds
            playSceneAudio('leave');
        });
    });
}

function fadeOutScene(sceneGroup, callback) {
    const duration = 2000;
    const startTime = Date.now();

    function fade() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        sceneGroup.traverse((object) => {
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => {
                        mat.opacity = 1 - progress;
                        mat.transparent = true;
                    });
                } else {
                    object.material.opacity = 1 - progress;
                    object.material.transparent = true;
                }
            }
        });

        if (progress < 1) {
            requestAnimationFrame(fade);
        } else {
            callback();
        }
    }

    fade();
}

function fadeInScene(sceneGroup, callback) {
    const duration = 2000;
    const startTime = Date.now();

    sceneGroup.traverse((object) => {
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => {
                    mat.opacity = 0;
                    mat.transparent = true;
                });
            } else {
                object.material.opacity = 0;
                object.material.transparent = true;
            }
        }
    });

    function fade() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        sceneGroup.traverse((object) => {
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => {
                        mat.opacity = progress;
                    });
                } else {
                    object.material.opacity = progress;
                }
            }
        });

        if (progress < 1) {
            requestAnimationFrame(fade);
        } else {
            callback();
        }
    }

    fade();
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Choice buttons
    document.getElementById('communicate-btn').addEventListener('click', () => {
        transitionToCommunicate();
    });

    document.getElementById('leave-btn').addEventListener('click', () => {
        transitionToLeave();
    });

    // Mouse movement
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Click detection
    window.addEventListener('click', onClick);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;

    // Handle particle dragging in communicate scene
    if (isDragging && currentScene === 'communicate') {
        dragParticles();
    }

    // Handle camera rotation in leave scene
    if (isDragging && currentScene === 'leave') {
        rotateCameraInCityScene(event.movementX, event.movementY);
    }
}

function onMouseDown(event) {
    isDragging = true;
}

function onMouseUp(event) {
    isDragging = false;
}

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (currentScene === 'communicate') {
        handleCommunicateClick();
    } else if (currentScene === 'leave') {
        handleLeaveClick();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// COMMUNICATE SCENE INTERACTIONS
// ===================================

function handleCommunicateClick() {
    const intersects = raycaster.intersectObjects(communicateObjects.familyMembers, true);

    if (intersects.length > 0) {
        let clickedMember = intersects[0].object;

        // Find the parent group
        while (clickedMember.parent && !clickedMember.userData.clickable) {
            clickedMember = clickedMember.parent;
        }

        if (clickedMember.userData.clickable) {
            animateFamilyMember(clickedMember);
            showTextBubble(clickedMember);
            playSound('chimes-light');
        }
    }
}

function animateFamilyMember(member) {
    const duration = 1000;
    const startTime = Date.now();
    const baseY = member.userData.baseY;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        member.position.y = baseY + Math.sin(progress * Math.PI) * 0.5;
        member.rotation.y = Math.sin(progress * Math.PI * 2) * 0.3;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            member.position.y = baseY;
            member.rotation.y = 0;
        }
    }

    animate();
}

function showTextBubble(member) {
    const messages = {
        'Mother': "I'm glad we talked about this. I love you.",
        'Father': "Communication makes us stronger together.",
        'Sibling': "Thanks for staying and working this out!"
    };

    const message = messages[member.userData.name] || "I appreciate you being here.";

    const bubble = document.createElement('div');
    bubble.className = 'text-bubble';
    bubble.textContent = message;

    // Position based on 3D position
    const vector = new THREE.Vector3();
    member.getWorldPosition(vector);
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight - 100;

    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';

    document.getElementById('text-bubbles').appendChild(bubble);

    // Remove after 3 seconds
    setTimeout(() => {
        bubble.remove();
    }, 3000);
}

function dragParticles() {
    if (!communicateObjects.particles) return;

    const positions = communicateObjects.particles.geometry.attributes.position.array;

    // Apply force to particles based on mouse movement
    for (let i = 0; i < positions.length / 3; i++) {
        const dx = positions[i * 3] - (mouseX * 10);
        const dy = positions[i * 3 + 1] - (4 - mouseY * 4);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 3) {
            positions[i * 3] += (Math.random() - 0.5) * 0.1;
            positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
            positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
        }
    }

    communicateObjects.particles.geometry.attributes.position.needsUpdate = true;
}

// ===================================
// LEAVE SCENE INTERACTIONS
// ===================================

function handleLeaveClick() {
    // Play footstep sound
    playSound('footsteps-echo');
}

function rotateCameraInCityScene(deltaX, deltaY) {
    camera.rotation.y -= deltaX * 0.005;
    camera.rotation.x -= deltaY * 0.005;

    // Clamp vertical rotation
    camera.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, camera.rotation.x));
}

// ===================================
// AUDIO MANAGEMENT
// ===================================

function playSceneAudio(sceneName) {
    // Stop all audio first
    stopAllAudio();

    if (sceneName === 'communicate') {
        playSound('ambient-warm', 0.3, true);
        playSound('piano-soft', 0.2, true);
    } else if (sceneName === 'leave') {
        playSound('wind-cold', 0.4, true);
        playSound('traffic-distant', 0.2, true);
        playSound('hum-electronic', 0.15, true);
    }
}

function playSound(soundId, volume = 0.5, loop = false) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.volume = volume;
        sound.loop = loop;
        sound.play().catch(e => console.log('Audio play error:', e));
    }
}

function stopAllAudio() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// ===================================
// ANIMATION LOOP
// ===================================

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Living room animations
    if (currentScene === 'living-room' && livingRoomObjects.group && livingRoomObjects.group.visible) {
        // Flickering light
        if (livingRoomObjects.overheadLight) {
            livingRoomObjects.overheadLight.intensity = 0.8 + Math.random() * 0.2;
        }

        // Shaking objects
        if (livingRoomObjects.shakingObjects) {
            livingRoomObjects.shakingObjects.forEach(obj => {
                obj.position.y = obj.userData.baseY + Math.sin(elapsedTime * 8 + obj.userData.baseY * 10) * 0.015;
                obj.rotation.z = Math.sin(elapsedTime * 6) * 0.05;
            });
        }
    }

    // Communicate scene animations
    if (currentScene === 'communicate' && communicateObjects.group && communicateObjects.group.visible) {
        // Animate family members (gentle breathing)
        if (communicateObjects.familyMembers) {
            communicateObjects.familyMembers.forEach(member => {
                member.position.y = member.userData.baseY + Math.sin(elapsedTime * 0.5 + member.userData.animationOffset) * 0.05;
            });
        }

        // Animate particles
        if (communicateObjects.particles) {
            const positions = communicateObjects.particles.geometry.attributes.position.array;
            const velocities = communicateObjects.particles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime + i) * 0.002;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 12) positions[i * 3] = -12;
                if (positions[i * 3] < -12) positions[i * 3] = 12;
                if (positions[i * 3 + 1] > 8) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 8;
                if (positions[i * 3 + 2] > 12) positions[i * 3 + 2] = -12;
                if (positions[i * 3 + 2] < -12) positions[i * 3 + 2] = 12;
            }

            communicateObjects.particles.geometry.attributes.position.needsUpdate = true;
            communicateObjects.particles.rotation.y = elapsedTime * 0.02;
        }
    }

    // Leave scene animations
    if (currentScene === 'leave' && leaveObjects.group && leaveObjects.group.visible) {
        // Flickering neon lights
        if (leaveObjects.neonLights) {
            leaveObjects.neonLights.forEach(light => {
                const flicker = Math.sin(elapsedTime * light.userData.flickerSpeed) * 0.5 + 0.5;
                light.intensity = light.userData.baseIntensity * (0.7 + flicker * 0.3);

                // Occasional random flicker
                if (Math.random() < 0.01) {
                    light.intensity = Math.random() * light.userData.baseIntensity;
                }
            });
        }

        // Moving fog
        if (leaveObjects.fogParticles) {
            leaveObjects.fogParticles.forEach(fog => {
                fog.position.x += fog.userData.velocity.x;
                fog.position.z += fog.userData.velocity.z;

                // Wrap fog
                if (fog.position.x > 50) fog.position.x = -50;
                if (fog.position.x < -50) fog.position.x = 50;
                if (fog.position.z > 50) fog.position.z = -50;
                if (fog.position.z < -50) fog.position.z = 50;

                // Subtle rotation
                fog.rotation.y += 0.001;
            });
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🌟 Choice - An Interactive Journey 🌟', 'color: #00ffff; font-size: 20px; font-weight: bold;');
console.log('%cEvery choice creates a different world...', 'color: #ffd700; font-size: 14px;');
