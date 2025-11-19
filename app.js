// ===================================
// FAMILY CHOICE - INTERACTIVE NARRATIVE
// A 3D Journey Through Emotional Decisions
// ===================================

// ===================================
// GLOBAL STATE & VARIABLES
// ===================================

let scene, camera, renderer, raycaster, mouse;
let clock, currentScene = 'none';
let isSceneActive = false;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0;

// Scene objects
let livingRoom, familyGroup, cityscape;
let particles = [];
let interactiveObjects = [];

// Constants
const CAMERA_MOVE_SPEED = 0.03;
const MOUSE_SENSITIVITY = 0.0005;

// Scene states
const SCENES = {
    ARGUMENT: 'argument',
    COMMUNICATE: 'communicate',
    LEAVE: 'leave'
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

function init() {
    // Remove loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.style.display = 'none', 1000);
    }, 1500);

    // Initialize Three.js
    initThreeJS();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 15, 50);
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.7, 6);
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
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Start button
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', startArgumentScene);
    }

    // Choice buttons
    const communicateBtn = document.getElementById('btn-communicate');
    const leaveBtn = document.getElementById('btn-leave');

    if (communicateBtn) {
        communicateBtn.addEventListener('click', () => choosePath('communicate'));
    }
    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => choosePath('leave'));
    }

    // Mouse movement
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    if (!isSceneActive) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = mouseX * 2;
    targetCameraY = mouseY * 1.2;
}

function onMouseClick(event) {
    if (!isSceneActive) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        handleObjectClick(intersects[0].object);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SCENE 1: LIVING ROOM ARGUMENT
// ===================================

function startArgumentScene() {
    const introScreen = document.getElementById('intro-screen');
    const canvas = document.getElementById('scene-canvas');
    const sceneUI = document.getElementById('scene-ui');
    const argumentUI = document.getElementById('argument-ui');

    // Hide intro
    introScreen.classList.add('hidden');

    // Show canvas and UI
    setTimeout(() => {
        canvas.classList.add('visible');
        sceneUI.classList.remove('hidden');
        argumentUI.classList.remove('hidden');
        isSceneActive = true;
        currentScene = SCENES.ARGUMENT;

        // Build the scene
        createArgumentScene();

        // Play ambient tension sound (simulated)
        playSound('argument');

        // Show choices after a moment
        setTimeout(() => {
            showChoices();
        }, 3000);
    }, 500);
}

function createArgumentScene() {
    // Clear existing scene
    clearScene();

    // Set dark, tense atmosphere
    scene.background = new THREE.Color(0x2a2a3e);
    scene.fog = new THREE.Fog(0x2a2a3e, 10, 30);

    // Create living room
    livingRoom = new THREE.Group();

    // Floor - dark wood
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.9,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    livingRoom.add(floor);

    // Walls - dim lighting
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4458,
        roughness: 0.9
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    backWall.position.set(0, 2.5, -7);
    backWall.receiveShadow = true;
    livingRoom.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    leftWall.position.set(-7, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    livingRoom.add(leftWall);

    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    rightWall.position.set(7, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    livingRoom.add(rightWall);

    // Coffee table with trembling objects
    createCoffeeTable();

    // Window with storm outside
    createStormWindow();

    // Dim overhead light
    createArgumentLighting();

    // Tension particles
    createTensionParticles();

    // Family figures in distance (silhouettes)
    createFamilyFigures();

    scene.add(livingRoom);
}

function createCoffeeTable() {
    const table = new THREE.Group();

    // Table top
    const tableTop = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.08, 1.2),
        new THREE.MeshStandardMaterial({
            color: 0x5c4033,
            roughness: 0.6
        })
    );
    tableTop.position.y = 0.6;
    tableTop.castShadow = true;
    table.add(tableTop);

    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const legPositions = [[-0.8, 0.3, -0.5], [0.8, 0.3, -0.5], [-0.8, 0.3, 0.5], [0.8, 0.3, 0.5]];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        table.add(leg);
    });

    // Cup on table (trembling)
    const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.06, 0.15, 16),
        new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.4
        })
    );
    cup.position.set(-0.3, 0.72, 0.2);
    cup.castShadow = true;
    cup.userData.tremble = true;
    cup.userData.clickable = true;
    table.add(cup);
    interactiveObjects.push(cup);

    // Photo frame (clickable)
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.35, 0.02),
        new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5
        })
    );
    frame.position.set(0.4, 0.72, -0.3);
    frame.rotation.y = -0.3;
    frame.castShadow = true;
    frame.userData.clickable = true;
    frame.userData.type = 'photo';
    table.add(frame);
    interactiveObjects.push(frame);

    table.position.set(0, 0, 2.5);
    table.userData.table = tableTop;
    livingRoom.add(table);
    scene.userData.coffeeTable = table;
}

function createStormWindow() {
    // Window frame
    const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 0.15),
        new THREE.MeshStandardMaterial({
            color: 0x2d2d2d,
            roughness: 0.7
        })
    );
    windowFrame.position.set(-5, 2.5, -6.9);

    // Dark glass showing storm
    const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 2.8),
        new THREE.MeshPhysicalMaterial({
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.5,
            roughness: 0.2,
            metalness: 0.8
        })
    );
    glass.position.set(-5, 2.5, -6.85);

    livingRoom.add(windowFrame);
    livingRoom.add(glass);

    // Occasional lightning effect (stored for animation)
    scene.userData.stormWindow = glass;
}

function createArgumentLighting() {
    // Dim ambient light
    const ambientLight = new THREE.AmbientLight(0x3d3d5c, 0.3);
    scene.add(ambientLight);

    // Single overhead light - cold and harsh
    const overheadLight = new THREE.PointLight(0x8888aa, 0.8, 15);
    overheadLight.position.set(0, 4, 0);
    overheadLight.castShadow = true;
    scene.add(overheadLight);

    // Flickering TV light from side
    const tvLight = new THREE.PointLight(0x6666ff, 0.4, 8);
    tvLight.position.set(5, 1.5, -5);
    scene.add(tvLight);
    scene.userData.tvLight = tvLight;

    // Window ambient from outside
    const windowLight = new THREE.PointLight(0x4444aa, 0.2, 10);
    windowLight.position.set(-5, 2, -6);
    scene.add(windowLight);
}

function createTensionParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = Math.random() * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        velocities.push({
            x: (Math.random() - 0.5) * 0.008,
            y: Math.random() * 0.005,
            z: (Math.random() - 0.5) * 0.008
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x6666aa,
        size: 0.03,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.userData.velocities = velocities;
    particles.push(particleSystem);
    scene.add(particleSystem);
}

function createFamilyFigures() {
    familyGroup = new THREE.Group();

    // Parent 1 (left)
    const parent1 = createHumanFigure(0x4a4a6a, 1.7);
    parent1.position.set(-2, 0, -3);
    parent1.rotation.y = 0.3;
    familyGroup.add(parent1);

    // Parent 2 (right)
    const parent2 = createHumanFigure(0x5a4a5a, 1.65);
    parent2.position.set(2, 0, -3);
    parent2.rotation.y = -0.3;
    familyGroup.add(parent2);

    // Store for animations
    familyGroup.userData.parent1 = parent1;
    familyGroup.userData.parent2 = parent2;

    scene.add(familyGroup);
}

function createHumanFigure(color, height) {
    const figure = new THREE.Group();

    // Body
    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.25, height * 0.5, 8, 16),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8
        })
    );
    body.position.y = height * 0.5;
    body.castShadow = true;
    figure.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0xccaa99,
            roughness: 0.9
        })
    );
    head.position.y = height * 0.85;
    head.castShadow = true;
    figure.add(head);

    return figure;
}

// ===================================
// CHOICE SYSTEM
// ===================================

function showChoices() {
    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.remove('hidden');
    choiceOverlay.classList.add('fade-in');
}

function hideChoices() {
    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.add('hidden');
}

function choosePath(path) {
    hideChoices();

    // Play transition sound
    playSound('transition');

    if (path === 'communicate') {
        setTimeout(() => createCommunicateScene(), 1000);
    } else if (path === 'leave') {
        setTimeout(() => createLeaveScene(), 1000);
    }
}

// ===================================
// SCENE 2A: COMMUNICATE - RECONCILIATION
// ===================================

function createCommunicateScene() {
    clearScene();
    currentScene = SCENES.COMMUNICATE;

    // Hide argument UI, show communicate UI
    document.getElementById('argument-ui').classList.add('hidden');
    document.getElementById('communicate-ui').classList.remove('hidden');

    // Warm, bright atmosphere
    scene.background = new THREE.Color(0xffe4c4);
    scene.fog = new THREE.Fog(0xffd4a3, 15, 40);
    renderer.toneMappingExposure = 1.3;

    // Create warm living room
    const warmRoom = new THREE.Group();

    // Bright floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15),
        new THREE.MeshStandardMaterial({
            color: 0xdeb887,
            roughness: 0.7
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    warmRoom.add(floor);

    // Warm walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.8
    });

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 5),
        wallMaterial
    );
    backWall.position.set(0, 2.5, -7);
    backWall.receiveShadow = true;
    warmRoom.add(backWall);

    // Couch with family sitting together
    createFamilyCouch();

    // Sunny window
    createSunnyWindow();

    // Warm golden lighting
    createWarmLighting();

    // Golden particles (dust in sunlight)
    createGoldenParticles();

    scene.add(warmRoom);

    // Play warm ambient sound
    playSound('home');

    // Show dialogue bubbles
    setTimeout(() => showDialogueBubbles(), 2000);
}

function createFamilyCouch() {
    const couchGroup = new THREE.Group();

    // Couch base
    const couchBase = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.5, 1.2),
        new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9
        })
    );
    couchBase.position.y = 0.5;
    couchBase.castShadow = true;
    couchBase.receiveShadow = true;
    couchGroup.add(couchBase);

    // Couch back
    const couchBack = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.8, 0.2),
        new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9
        })
    );
    couchBack.position.set(0, 1.1, -0.5);
    couchBack.castShadow = true;
    couchGroup.add(couchBack);

    // Family members sitting (closer together, relaxed postures)
    const sittingFamily = new THREE.Group();

    // Parent 1
    const parent1 = createSittingFigure(0x6a8a9a, -0.8);
    parent1.userData.clickable = true;
    parent1.userData.type = 'family-member';
    parent1.userData.message = "I understand now...";
    interactiveObjects.push(parent1);
    sittingFamily.add(parent1);

    // Parent 2
    const parent2 = createSittingFigure(0x7a6a8a, 0.8);
    parent2.userData.clickable = true;
    parent2.userData.type = 'family-member';
    parent2.userData.message = "We're here for you.";
    interactiveObjects.push(parent2);
    sittingFamily.add(parent2);

    // You (center)
    const you = createSittingFigure(0x5a7a6a, 0);
    you.userData.clickable = true;
    you.userData.type = 'family-member';
    you.userData.message = "Thank you for listening.";
    interactiveObjects.push(you);
    sittingFamily.add(you);

    sittingFamily.position.set(0, 0.7, 0.2);
    couchGroup.add(sittingFamily);

    couchGroup.position.set(0, 0, -2);
    scene.add(couchGroup);

    // Store for animations
    scene.userData.familyMembers = [parent1, parent2, you];
}

function createSittingFigure(color, xOffset) {
    const figure = new THREE.Group();

    // Seated body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.6, 0.4),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8
        })
    );
    body.position.y = 0.3;
    body.castShadow = true;
    figure.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0xddbb99,
            roughness: 0.9
        })
    );
    head.position.y = 0.75;
    head.castShadow = true;
    figure.add(head);

    figure.position.x = xOffset;
    return figure;
}

function createSunnyWindow() {
    // Large sunny window
    const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 4, 0.15),
        new THREE.MeshStandardMaterial({
            color: 0xaa8866,
            roughness: 0.6
        })
    );
    windowFrame.position.set(5, 2.5, -6.9);

    // Bright glass
    const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(3.3, 3.8),
        new THREE.MeshPhysicalMaterial({
            color: 0xffd89b,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.1
        })
    );
    glass.position.set(5, 2.5, -6.85);

    scene.add(windowFrame);
    scene.add(glass);
}

function createWarmLighting() {
    // Warm ambient
    const ambientLight = new THREE.AmbientLight(0xffd4a3, 0.6);
    scene.add(ambientLight);

    // Golden sunlight
    const sunLight = new THREE.DirectionalLight(0xffd89b, 1.8);
    sunLight.position.set(5, 8, -6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Soft fill light
    const fillLight = new THREE.PointLight(0xffebcd, 0.9, 20);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    // Gentle atmosphere light
    const atmosphereLight = new THREE.PointLight(0xffd4a3, 0.6, 15);
    atmosphereLight.position.set(0, 2.5, 0);
    scene.add(atmosphereLight);
    scene.userData.atmosphereLight = atmosphereLight;
}

function createGoldenParticles() {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = Math.random() * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        velocities.push({
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.003,
            z: (Math.random() - 0.5) * 0.005
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.userData.velocities = velocities;
    particles.push(particleSystem);
    scene.add(particleSystem);
}

function showDialogueBubbles() {
    const container = document.getElementById('dialogue-bubbles');
    const messages = [
        { text: "It's okay...", delay: 0 },
        { text: "We're here.", delay: 1500 },
        { text: "Let's talk.", delay: 3000 }
    ];

    messages.forEach(msg => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'dialogue-bubble';
            bubble.textContent = msg.text;
            container.appendChild(bubble);

            setTimeout(() => {
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0)';
            }, 100);

            // Play chime sound
            playSound('chime');
        }, msg.delay);
    });
}

// ===================================
// SCENE 2B: LEAVE - DARK CITY
// ===================================

function createLeaveScene() {
    clearScene();
    currentScene = SCENES.LEAVE;

    // Hide argument UI, show leave UI
    document.getElementById('argument-ui').classList.add('hidden');
    document.getElementById('leave-ui').classList.remove('hidden');

    // Dark, cold atmosphere
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.Fog(0x0a0a1a, 20, 80);
    renderer.toneMappingExposure = 0.6;

    // Create city environment
    createCityGround();
    createCityBuildings();
    createLoneCharacter();
    createCityLighting();
    createRainParticles();
    createNeonLights();

    // Position camera for lonely perspective
    camera.position.set(0, 2, 8);
    targetCameraX = 0;
    targetCameraY = 0;

    // Play cold ambient sound
    playSound('city');
    playSound('wind');

    // Show memory fragments
    setTimeout(() => showMemoryFragments(), 3000);
}

function createCityGround() {
    // Wet street
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({
            color: 0x1a1a2a,
            roughness: 0.3,
            metalness: 0.7
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

function createCityBuildings() {
    cityscape = new THREE.Group();

    // Create multiple tall buildings
    for (let i = 0; i < 20; i++) {
        const height = 15 + Math.random() * 30;
        const width = 3 + Math.random() * 5;
        const depth = 3 + Math.random() * 5;

        const building = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({
                color: 0x2a2a3a,
                roughness: 0.8,
                metalness: 0.3
            })
        );

        // Random position in distance
        const angle = (i / 20) * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        building.position.x = Math.cos(angle) * distance;
        building.position.z = Math.sin(angle) * distance;
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;

        cityscape.add(building);

        // Add window lights
        for (let w = 0; w < 5; w++) {
            if (Math.random() > 0.5) {
                const windowLight = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.3, 0.3),
                    new THREE.MeshBasicMaterial({
                        color: 0xffeeaa,
                        transparent: true,
                        opacity: 0.6
                    })
                );
                windowLight.position.set(
                    building.position.x + (Math.random() - 0.5) * width,
                    5 + Math.random() * height * 0.7,
                    building.position.z
                );
                cityscape.add(windowLight);
            }
        }
    }

    scene.add(cityscape);
}

function createLoneCharacter() {
    const character = new THREE.Group();

    // Body with backpack
    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.25, 0.8, 8, 16),
        new THREE.MeshStandardMaterial({
            color: 0x3a3a4a,
            roughness: 0.9
        })
    );
    body.position.y = 1;
    body.castShadow = true;
    character.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0xccaa99,
            roughness: 0.9
        })
    );
    head.position.y = 1.6;
    head.castShadow = true;
    character.add(head);

    // Backpack
    const backpack = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.4, 0.15),
        new THREE.MeshStandardMaterial({
            color: 0x4a4a5a,
            roughness: 0.8
        })
    );
    backpack.position.set(0, 1.2, -0.2);
    backpack.castShadow = true;
    character.add(backpack);

    character.position.set(0, 0, 2);
    character.userData.walking = true;
    scene.add(character);
    scene.userData.character = character;
}

function createCityLighting() {
    // Very dim ambient
    const ambientLight = new THREE.AmbientLight(0x2a2a4a, 0.2);
    scene.add(ambientLight);

    // Cold moonlight
    const moonLight = new THREE.DirectionalLight(0x6a6aaa, 0.3);
    moonLight.position.set(10, 20, 10);
    moonLight.castShadow = true;
    scene.add(moonLight);

    // Street lamp nearby
    const streetLamp = new THREE.PointLight(0xffaa66, 0.8, 15);
    streetLamp.position.set(-3, 4, 5);
    streetLamp.castShadow = true;
    scene.add(streetLamp);
}

function createRainParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = Math.random() * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        velocities.push({
            x: Math.random() * 0.02 - 0.01,
            y: -0.2 - Math.random() * 0.1,
            z: Math.random() * 0.02 - 0.01
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x6688aa,
        size: 0.04,
        transparent: true,
        opacity: 0.6
    });

    const rain = new THREE.Points(geometry, material);
    rain.userData.velocities = velocities;
    particles.push(rain);
    scene.add(rain);
}

function createNeonLights() {
    // Add some neon signs in the distance
    const colors = [0xff00ff, 0x00ffff, 0xff0066, 0x00ff88];

    for (let i = 0; i < 8; i++) {
        const neonLight = new THREE.PointLight(
            colors[Math.floor(Math.random() * colors.length)],
            0.5,
            20
        );

        const angle = (i / 8) * Math.PI * 2;
        const distance = 25 + Math.random() * 15;
        neonLight.position.set(
            Math.cos(angle) * distance,
            3 + Math.random() * 5,
            Math.sin(angle) * distance
        );

        scene.add(neonLight);

        // Store for flickering animation
        if (!scene.userData.neonLights) {
            scene.userData.neonLights = [];
        }
        scene.userData.neonLights.push({
            light: neonLight,
            baseIntensity: 0.5,
            flickerSpeed: 0.5 + Math.random() * 2
        });
    }
}

function showMemoryFragments() {
    const memoryText = document.getElementById('memory-text');
    const fragmentP = memoryText.querySelector('.fragment-text');

    const fragments = [
        "Old laughter echoes in the puddles...",
        "Warmth feels like a distant dream...",
        "The city lights blur like tears...",
        "Every step forward, further from home..."
    ];

    let currentFragment = 0;

    function showNextFragment() {
        if (currentFragment < fragments.length) {
            fragmentP.textContent = fragments[currentFragment];
            memoryText.classList.remove('hidden');

            setTimeout(() => {
                memoryText.classList.add('hidden');
                currentFragment++;
                setTimeout(showNextFragment, 2000);
            }, 4000);
        }
    }

    showNextFragment();
}

// ===================================
// INTERACTION HANDLERS
// ===================================

function handleObjectClick(object) {
    // Traverse up to find the clickable parent
    let clickable = object;
    while (clickable && !clickable.userData.clickable) {
        clickable = clickable.parent;
    }

    if (!clickable || !clickable.userData.clickable) return;

    if (clickable.userData.type === 'photo') {
        showPhotoMemory();
    } else if (clickable.userData.type === 'family-member') {
        showFamilyMessage(clickable.userData.message);
        animateFamilyMemberNod(clickable);
        playSound('chime');
    }

    // Tremble effect
    if (clickable.userData.tremble) {
        animateTremble(clickable);
    }
}

function showPhotoMemory() {
    const argumentUI = document.getElementById('argument-ui');
    const tensionText = argumentUI.querySelector('.tension-text');

    if (tensionText) {
        tensionText.textContent = "A photo of happier times...";
        setTimeout(() => {
            tensionText.textContent = "The air feels thick with unspoken words...";
        }, 3000);
    }
}

function showFamilyMessage(message) {
    const container = document.getElementById('dialogue-bubbles');
    const bubble = document.createElement('div');
    bubble.className = 'dialogue-bubble personal';
    bubble.textContent = message;
    container.appendChild(bubble);

    setTimeout(() => {
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        bubble.style.opacity = '0';
        setTimeout(() => bubble.remove(), 500);
    }, 3000);
}

function animateFamilyMemberNod(figure) {
    const head = figure.children.find(child => child.geometry && child.geometry.type === 'SphereGeometry');
    if (!head) return;

    const originalRotation = head.rotation.x;
    const duration = 800;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 0.5) {
            head.rotation.x = originalRotation + Math.sin(progress * Math.PI * 4) * 0.2;
        } else {
            head.rotation.x = originalRotation;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function animateTremble(object) {
    const originalPos = object.position.clone();
    const duration = 500;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        object.position.x = originalPos.x + (Math.random() - 0.5) * 0.02 * (1 - progress);
        object.position.z = originalPos.z + (Math.random() - 0.5) * 0.02 * (1 - progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            object.position.copy(originalPos);
        }
    }

    animate();
}

// ===================================
// SCENE MANAGEMENT
// ===================================

function clearScene() {
    // Remove all objects except camera
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Clear particles array
    particles = [];

    // Clear interactive objects
    interactiveObjects = [];

    // Clear user data
    scene.userData = {};
}

// ===================================
// SOUND SYSTEM
// ===================================

function playSound(type) {
    // Simulate sound playing (in real implementation, would use actual audio)
    const soundMap = {
        'argument': 'ambient-argument',
        'home': 'ambient-home',
        'city': 'ambient-city',
        'wind': 'wind-sound',
        'chime': 'chime-sound',
        'piano': 'piano-sound',
        'footstep': 'footstep-sound',
        'transition': 'transition-sound'
    };

    const audioId = soundMap[type];
    if (!audioId) return;

    const audio = document.getElementById(audioId);
    if (audio) {
        audio.volume = 0.4;
        audio.play().catch(e => console.log(`Sound ${type} not available:`, e));
    }
}

function stopAllSounds() {
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

    if (isSceneActive) {
        // Smooth camera movement
        camera.position.x += (targetCameraX - camera.position.x) * CAMERA_MOVE_SPEED;
        camera.position.y += (1.7 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;

        // Look at center point based on scene
        if (currentScene === SCENES.LEAVE) {
            camera.lookAt(0, 1.5, 0);
        } else {
            camera.lookAt(0, 1.5, 0);
        }

        // Scene-specific animations
        if (currentScene === SCENES.ARGUMENT) {
            animateArgumentScene(elapsedTime);
        } else if (currentScene === SCENES.COMMUNICATE) {
            animateCommunicateScene(elapsedTime);
        } else if (currentScene === SCENES.LEAVE) {
            animateLeaveScene(elapsedTime);
        }

        // Animate particles
        particles.forEach(particleSystem => {
            const positions = particleSystem.geometry.attributes.position.array;
            const velocities = particleSystem.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap or reset particles based on scene
                if (currentScene === SCENES.LEAVE && positions[i * 3 + 1] < 0) {
                    positions[i * 3 + 1] = 20;
                } else if (currentScene !== SCENES.LEAVE) {
                    if (positions[i * 3] > 10) positions[i * 3] = -10;
                    if (positions[i * 3] < -10) positions[i * 3] = 10;
                    if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
                    if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 5;
                    if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -10;
                    if (positions[i * 3 + 2] < -10) positions[i * 3 + 2] = 10;
                }
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;
        });
    }

    renderer.render(scene, camera);
}

function animateArgumentScene(time) {
    // Flickering TV light
    if (scene.userData.tvLight) {
        scene.userData.tvLight.intensity = 0.4 + Math.sin(time * 5) * 0.1;
    }

    // Coffee table trembling
    if (scene.userData.coffeeTable) {
        const table = scene.userData.coffeeTable.userData.table;
        if (table) {
            table.position.y += (Math.sin(time * 10) * 0.002);
        }
    }

    // Occasional lightning flash (rare)
    if (scene.userData.stormWindow && Math.random() > 0.998) {
        scene.userData.stormWindow.material.opacity = 0.9;
        setTimeout(() => {
            if (scene.userData.stormWindow) {
                scene.userData.stormWindow.material.opacity = 0.5;
            }
        }, 100);
    }
}

function animateCommunicateScene(time) {
    // Gentle atmosphere light breathing
    if (scene.userData.atmosphereLight) {
        scene.userData.atmosphereLight.intensity = 0.6 + Math.sin(time * 0.5) * 0.15;
    }

    // Family members gentle breathing
    if (scene.userData.familyMembers) {
        scene.userData.familyMembers.forEach((member, index) => {
            member.position.y = Math.sin(time * 0.8 + index) * 0.02;
        });
    }
}

function animateLeaveScene(time) {
    // Character walking animation
    if (scene.userData.character && scene.userData.character.userData.walking) {
        const char = scene.userData.character;
        char.rotation.y = Math.sin(time * 0.3) * 0.05;
        char.position.y = Math.abs(Math.sin(time * 2)) * 0.05;

        // Subtle forward movement
        char.position.z -= 0.002;
    }

    // Neon lights flickering
    if (scene.userData.neonLights) {
        scene.userData.neonLights.forEach(neon => {
            neon.light.intensity = neon.baseIntensity +
                Math.sin(time * neon.flickerSpeed) * 0.2;
        });
    }

    // Buildings subtle rotation for parallax
    if (cityscape) {
        cityscape.rotation.y = Math.sin(time * 0.1) * 0.02;
    }
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c💔 Family Choice - Interactive Narrative 💔', 'color: #8888ff; font-size: 18px; font-weight: bold;');
console.log('%cYour choices shape your path...', 'color: #6666cc; font-size: 12px;');
