// ===================================
// FAMILY CONFLICT - INTERACTIVE NARRATIVE
// A 3D Interactive Experience
// ===================================

// Global variables
let scene, camera, renderer, controls, raycaster, mouse;
let clock, currentScene = 'intro';
let sceneObjects = {};
let animationMixers = [];

// Scene state
const sceneState = {
    current: null,
    transitioning: false
};

// Constants
const SCENES = {
    ARGUMENT: 'argument',
    COMMUNICATE: 'communicate',
    RUNAWAY: 'runaway'
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

function init() {
    // Remove loading screen after delay
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
    scene.fog = new THREE.Fog(0x1a1a2e, 5, 50);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.6, 5);

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
    renderer.toneMappingExposure = 1.0;

    // Orbit Controls for camera
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enabled = false;

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
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', startExperience);

    // Choice buttons
    const communicateBtn = document.getElementById('communicate-btn');
    const runawayBtn = document.getElementById('runaway-btn');

    communicateBtn.addEventListener('click', () => chooseScene(SCENES.COMMUNICATE));
    runawayBtn.addEventListener('click', () => chooseScene(SCENES.RUNAWAY));

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Mouse move for raycasting
    window.addEventListener('mousemove', onMouseMove);

    // Click for interactions
    window.addEventListener('click', onMouseClick);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    if (!controls.enabled) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        handleObjectClick(clickedObject);
    }
}

// ===================================
// SCENE MANAGEMENT
// ===================================

function startExperience() {
    const introScreen = document.getElementById('intro-screen');
    const canvas = document.getElementById('scene-canvas');
    const controlsHint = document.getElementById('controls-hint');

    introScreen.classList.add('hidden');
    canvas.classList.add('visible');
    controlsHint.classList.remove('hidden');
    controlsHint.classList.add('visible');

    controls.enabled = true;
    sceneState.current = SCENES.ARGUMENT;

    createArgumentScene();

    // Show choices after 5 seconds
    setTimeout(() => {
        showChoices();
    }, 5000);
}

function showChoices() {
    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.remove('hidden');
    choiceOverlay.classList.add('visible');
}

function hideChoices() {
    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.remove('visible');
    choiceOverlay.classList.add('hidden');
}

function chooseScene(sceneName) {
    if (sceneState.transitioning) return;

    sceneState.transitioning = true;
    hideChoices();

    // Fade out current scene
    fadeOutScene(() => {
        clearScene();

        if (sceneName === SCENES.COMMUNICATE) {
            createCommunicateScene();
        } else if (sceneName === SCENES.RUNAWAY) {
            createRunAwayScene();
        }

        fadeInScene();
        sceneState.current = sceneName;
        sceneState.transitioning = false;
    });
}

function clearScene() {
    // Remove all objects from scene
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    sceneObjects = {};
    animationMixers = [];
}

function fadeOutScene(callback) {
    const canvas = document.getElementById('scene-canvas');
    canvas.style.transition = 'opacity 1s';
    canvas.style.opacity = '0';

    setTimeout(() => {
        if (callback) callback();
    }, 1000);
}

function fadeInScene() {
    const canvas = document.getElementById('scene-canvas');
    setTimeout(() => {
        canvas.style.opacity = '1';
    }, 100);
}

// ===================================
// ARGUMENT SCENE - LIVING ROOM
// ===================================

function createArgumentScene() {
    // Set dark, tense atmosphere
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 5, 20);

    // Lighting - dim and moody
    const ambientLight = new THREE.AmbientLight(0x3a3a5a, 0.3);
    scene.add(ambientLight);

    // Dim ceiling light
    const ceilingLight = new THREE.PointLight(0x8a8a6a, 0.8, 15);
    ceilingLight.position.set(0, 3, 0);
    ceilingLight.castShadow = true;
    scene.add(ceilingLight);

    // Flickering lamp
    const lampLight = new THREE.PointLight(0xff9955, 0.6, 8);
    lampLight.position.set(-3, 2, -2);
    lampLight.userData.flicker = true;
    scene.add(lampLight);

    // Create living room
    createLivingRoom();

    // Create family figures
    createFamilyFigures();

    // Create trembling table items
    createTableItems();

    // Create stormy window
    createStormyWindow();

    // Update scene title
    updateSceneTitle('The Argument', 'Voices rise, emotions clash...');

    // Camera position
    camera.position.set(0, 1.6, 6);
    controls.target.set(0, 1.5, 0);
    controls.update();
}

function createLivingRoom() {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a4a,
        roughness: 0.9
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 5),
        wallMaterial
    );
    backWall.position.set(0, 2.5, -8);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 5),
        wallMaterial
    );
    leftWall.position.set(-10, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 5),
        wallMaterial
    );
    rightWall.position.set(10, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 0x2a2a3a })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    scene.add(ceiling);

    // Couch
    createCouch();
}

function createCouch() {
    const couchGroup = new THREE.Group();

    // Couch base
    const baseGeometry = new THREE.BoxGeometry(3, 0.5, 1.5);
    const couchMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3a2a,
        roughness: 0.7
    });
    const base = new THREE.Mesh(baseGeometry, couchMaterial);
    base.position.y = 0.25;
    base.castShadow = true;
    couchGroup.add(base);

    // Couch back
    const backGeometry = new THREE.BoxGeometry(3, 1, 0.3);
    const back = new THREE.Mesh(backGeometry, couchMaterial);
    back.position.set(0, 0.75, -0.6);
    back.castShadow = true;
    couchGroup.add(back);

    // Armrests
    const armGeometry = new THREE.BoxGeometry(0.3, 0.8, 1.5);
    const leftArm = new THREE.Mesh(armGeometry, couchMaterial);
    leftArm.position.set(-1.5, 0.4, 0);
    leftArm.castShadow = true;
    couchGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, couchMaterial);
    rightArm.position.set(1.5, 0.4, 0);
    rightArm.castShadow = true;
    couchGroup.add(rightArm);

    couchGroup.position.set(-4, 0, -3);
    scene.add(couchGroup);
}

function createFamilyFigures() {
    // Simple human-like figures
    const figureMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a5a6a,
        roughness: 0.7
    });

    // Parent 1 - standing, arms crossed
    const parent1 = createHumanFigure(figureMaterial);
    parent1.position.set(-2, 0, 0);
    parent1.userData.name = 'parent1';
    parent1.userData.emotion = 'angry';
    scene.add(parent1);
    sceneObjects.parent1 = parent1;

    // Parent 2 - standing, hand gesturing
    const parent2 = createHumanFigure(figureMaterial);
    parent2.position.set(2, 0, 0);
    parent2.userData.name = 'parent2';
    parent2.userData.emotion = 'frustrated';
    scene.add(parent2);
    sceneObjects.parent2 = parent2;

    // User figure - standing in middle
    const userFigure = createHumanFigure(new THREE.MeshStandardMaterial({
        color: 0x4a7a9a,
        roughness: 0.7
    }));
    userFigure.position.set(0, 0, 2);
    userFigure.userData.name = 'user';
    scene.add(userFigure);
    sceneObjects.user = userFigure;
}

function createHumanFigure(material) {
    const figure = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1, 8);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 1;
    body.castShadow = true;
    figure.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.7;
    head.castShadow = true;
    figure.add(head);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.3, 1.2, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.castShadow = true;
    figure.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.3, 1.2, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.castShadow = true;
    figure.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 6);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.15, 0.5, 0);
    leftLeg.castShadow = true;
    figure.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.15, 0.5, 0);
    rightLeg.castShadow = true;
    figure.add(rightLeg);

    return figure;
}

function createTableItems() {
    // Coffee table
    const tableGroup = new THREE.Group();

    const tableTop = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.1, 1),
        new THREE.MeshStandardMaterial({ color: 0x3a2a1a })
    );
    tableTop.position.y = 0.5;
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1a0a });

    const positions = [[-0.6, 0.25, -0.4], [0.6, 0.25, -0.4], [-0.6, 0.25, 0.4], [0.6, 0.25, 0.4]];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        tableGroup.add(leg);
    });

    // Items on table - they will tremble
    const cupGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.12, 8);
    const cupMaterial = new THREE.MeshStandardMaterial({ color: 0xaa5555 });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.set(0.3, 0.61, 0.2);
    cup.userData.trembles = true;
    cup.castShadow = true;
    tableGroup.add(cup);
    sceneObjects.cup = cup;

    // Book
    const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.05, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x4a4a6a })
    );
    book.position.set(-0.3, 0.58, -0.1);
    book.rotation.y = Math.PI / 4;
    book.userData.trembles = true;
    book.castShadow = true;
    tableGroup.add(book);
    sceneObjects.book = book;

    tableGroup.position.set(0, 0, 0);
    scene.add(tableGroup);
}

function createStormyWindow() {
    // Window frame
    const frameGeometry = new THREE.BoxGeometry(2, 2.5, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(5, 2, -3);
    frame.rotation.y = -Math.PI / 4;
    scene.add(frame);

    // Window glass with storm effect
    const glassGeometry = new THREE.PlaneGeometry(1.8, 2.3);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a3a,
        transparent: true,
        opacity: 0.5,
        roughness: 0.3
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(5, 2, -3);
    glass.rotation.y = -Math.PI / 4;
    scene.add(glass);

    // Lightning effect (flashing light)
    const lightning = new THREE.PointLight(0xaaaaff, 0, 20);
    lightning.position.set(5, 2, -3);
    lightning.userData.lightning = true;
    scene.add(lightning);
    sceneObjects.lightning = lightning;
}

// ===================================
// COMMUNICATE SCENE - RECONCILIATION
// ===================================

function createCommunicateScene() {
    // Set warm, peaceful atmosphere
    scene.background = new THREE.Color(0xffe4c4);
    scene.fog = new THREE.Fog(0xffe4c4, 10, 30);

    // Warm lighting
    const ambientLight = new THREE.AmbientLight(0xffd4a3, 0.6);
    scene.add(ambientLight);

    // Golden sunlight
    const sunLight = new THREE.DirectionalLight(0xffd89b, 1.2);
    sunLight.position.set(5, 8, 3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Soft fill light
    const fillLight = new THREE.PointLight(0xffebcd, 0.8, 20);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    // Create peaceful living room
    createPeacefulLivingRoom();

    // Create family sitting together
    createFamilyTogether();

    // Create warm particles
    createWarmParticles();

    // Create sunny window
    createSunnyWindow();

    // Update scene title
    updateSceneTitle('Understanding', 'Words heal, bonds strengthen...');

    // Show dialogue bubbles
    setTimeout(() => showDialogueBubbles(), 2000);

    // Camera position
    camera.position.set(0, 2, 8);
    controls.target.set(0, 1.5, 0);
    controls.update();
}

function createPeacefulLivingRoom() {
    // Bright floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.7
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Bright walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.8
    });

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 5),
        wallMaterial
    );
    backWall.position.set(0, 2.5, -8);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Warm couch
    const couchGroup = new THREE.Group();
    const couchMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        roughness: 0.6
    });

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.5, 1.8),
        couchMaterial
    );
    base.position.y = 0.25;
    base.castShadow = true;
    couchGroup.add(base);

    const back = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.2, 0.3),
        couchMaterial
    );
    back.position.set(0, 0.85, -0.75);
    back.castShadow = true;
    couchGroup.add(back);

    couchGroup.position.set(0, 0, 0);
    scene.add(couchGroup);
    sceneObjects.couch = couchGroup;
}

function createFamilyTogether() {
    // Peaceful family figures sitting together
    const figureMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a7a6a,
        roughness: 0.6
    });

    // Parent 1 - sitting, relaxed
    const parent1 = createSittingFigure(figureMaterial);
    parent1.position.set(-1, 0.5, 0);
    parent1.userData.clickable = true;
    parent1.userData.dialogue = "I understand now...";
    scene.add(parent1);
    sceneObjects.parent1 = parent1;

    // Parent 2 - sitting, smiling
    const parent2 = createSittingFigure(figureMaterial);
    parent2.position.set(1, 0.5, 0);
    parent2.userData.clickable = true;
    parent2.userData.dialogue = "We're here for you.";
    scene.add(parent2);
    sceneObjects.parent2 = parent2;

    // User - sitting in middle
    const userFigure = createSittingFigure(new THREE.MeshStandardMaterial({
        color: 0x6a9aba,
        roughness: 0.6
    }));
    userFigure.position.set(0, 0.5, 0.3);
    userFigure.userData.clickable = true;
    userFigure.userData.dialogue = "Thank you for listening...";
    scene.add(userFigure);
    sceneObjects.user = userFigure;
}

function createSittingFigure(material) {
    const figure = new THREE.Group();

    // Body (sitting)
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8),
        material
    );
    body.position.y = 0.5;
    body.castShadow = true;
    figure.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        material
    );
    head.position.y = 1;
    head.castShadow = true;
    figure.add(head);

    // Arms (relaxed)
    const armGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 6);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.25, 0.6, 0);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.castShadow = true;
    figure.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.25, 0.6, 0);
    rightArm.rotation.z = -Math.PI / 4;
    rightArm.castShadow = true;
    figure.add(rightArm);

    return figure;
}

function createWarmParticles() {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = Math.random() * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    sceneObjects.particles = particles;
}

function createSunnyWindow() {
    // Bright window with sunlight
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x8b7355 })
    );
    frame.position.set(6, 2.5, -2);
    scene.add(frame);

    // Bright glass
    const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 2.8),
        new THREE.MeshPhysicalMaterial({
            color: 0xffd89b,
            transparent: true,
            opacity: 0.4,
            transmission: 0.8
        })
    );
    glass.position.set(6, 2.5, -2);
    scene.add(glass);

    // Sun rays
    for (let i = 0; i < 5; i++) {
        const ray = new THREE.Mesh(
            new THREE.ConeGeometry(0.1, 4, 8),
            new THREE.MeshBasicMaterial({
                color: 0xffd89b,
                transparent: true,
                opacity: 0.3
            })
        );
        ray.position.set(6 - i * 0.5, 2.5, -2 + i * 0.3);
        ray.rotation.z = Math.PI / 2;
        scene.add(ray);
    }
}

function showDialogueBubbles() {
    const container = document.getElementById('dialogue-container');
    container.classList.remove('hidden');

    const dialogues = [
        { text: "I'm sorry...", delay: 0, left: '20%', top: '30%' },
        { text: "We love you.", delay: 1000, left: '70%', top: '35%' },
        { text: "Let's talk more.", delay: 2000, left: '45%', top: '55%' }
    ];

    dialogues.forEach(dialogue => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'dialogue-bubble';
            bubble.textContent = dialogue.text;
            bubble.style.left = dialogue.left;
            bubble.style.top = dialogue.top;
            container.appendChild(bubble);

            setTimeout(() => {
                bubble.style.opacity = '0';
                setTimeout(() => bubble.remove(), 600);
            }, 3000);
        }, dialogue.delay);
    });
}

// ===================================
// RUN AWAY SCENE - LONELY NIGHT STREET
// ===================================

function createRunAwayScene() {
    // Set dark, lonely atmosphere
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.Fog(0x0a0a1a, 5, 40);

    // Dim ambient light
    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 0.3);
    scene.add(ambientLight);

    // Street lights
    createStreetLights();

    // Create city street
    createCityStreet();

    // Create lone figure
    createLoneFigure();

    // Create neon signs
    createNeonSigns();

    // Create rain particles
    createRainParticles();

    // Create memory puddles
    createMemoryPuddles();

    // Update scene title
    updateSceneTitle('Solitude', 'Walking into the unknown...');

    // Camera position
    camera.position.set(0, 2, 10);
    controls.target.set(0, 1, 0);
    controls.update();
}

function createCityStreet() {
    // Wet street
    const streetGeometry = new THREE.PlaneGeometry(40, 100);
    const streetMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2a,
        roughness: 0.3,
        metalness: 0.7
    });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.rotation.x = -Math.PI / 2;
    street.receiveShadow = true;
    scene.add(street);

    // Sidewalks
    const sidewalkMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        roughness: 0.8
    });

    const leftSidewalk = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 100),
        sidewalkMaterial
    );
    leftSidewalk.rotation.x = -Math.PI / 2;
    leftSidewalk.position.set(-10, 0.05, 0);
    scene.add(leftSidewalk);

    const rightSidewalk = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 100),
        sidewalkMaterial
    );
    rightSidewalk.rotation.x = -Math.PI / 2;
    rightSidewalk.position.set(10, 0.05, 0);
    scene.add(rightSidewalk);

    // Buildings
    createBuildings();
}

function createBuildings() {
    const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        roughness: 0.8
    });

    // Left side buildings
    for (let i = 0; i < 10; i++) {
        const height = 8 + Math.random() * 10;
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(8, height, 8),
            buildingMaterial
        );
        building.position.set(-15, height / 2, -20 + i * 10);
        building.castShadow = true;
        scene.add(building);

        // Random lit windows
        for (let w = 0; w < 5; w++) {
            if (Math.random() > 0.6) {
                const windowLight = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.5, 0.5),
                    new THREE.MeshBasicMaterial({
                        color: 0xffdd88,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                windowLight.position.set(
                    -11,
                    2 + Math.random() * (height - 4),
                    -20 + i * 10 + (Math.random() - 0.5) * 6
                );
                windowLight.rotation.y = Math.PI / 2;
                scene.add(windowLight);
            }
        }
    }

    // Right side buildings
    for (let i = 0; i < 10; i++) {
        const height = 8 + Math.random() * 10;
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(8, height, 8),
            buildingMaterial
        );
        building.position.set(15, height / 2, -20 + i * 10);
        building.castShadow = true;
        scene.add(building);

        // Random lit windows
        for (let w = 0; w < 5; w++) {
            if (Math.random() > 0.6) {
                const windowLight = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.5, 0.5),
                    new THREE.MeshBasicMaterial({
                        color: 0xffdd88,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                windowLight.position.set(
                    11,
                    2 + Math.random() * (height - 4),
                    -20 + i * 10 + (Math.random() - 0.5) * 6
                );
                windowLight.rotation.y = -Math.PI / 2;
                scene.add(windowLight);
            }
        }
    }
}

function createStreetLights() {
    // Street lamps on both sides
    for (let i = 0; i < 8; i++) {
        // Left side
        const leftPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x3a3a3a })
        );
        leftPole.position.set(-8, 2, -15 + i * 10);
        scene.add(leftPole);

        const leftLight = new THREE.PointLight(0xff9955, 1, 12);
        leftLight.position.set(-8, 4, -15 + i * 10);
        leftLight.castShadow = true;
        scene.add(leftLight);

        // Right side
        const rightPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x3a3a3a })
        );
        rightPole.position.set(8, 2, -15 + i * 10);
        scene.add(rightPole);

        const rightLight = new THREE.PointLight(0xff9955, 1, 12);
        rightLight.position.set(8, 4, -15 + i * 10);
        rightLight.castShadow = true;
        scene.add(rightLight);
    }
}

function createLoneFigure() {
    // Lone walker figure
    const figureMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a5a6a,
        roughness: 0.7
    });

    const figure = createHumanFigure(figureMaterial);
    figure.position.set(0, 0, 2);

    // Add backpack
    const backpack = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.4, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x3a4a5a })
    );
    backpack.position.set(0, 1.2, -0.15);
    backpack.castShadow = true;
    figure.add(backpack);

    figure.userData.walking = true;
    scene.add(figure);
    sceneObjects.loneFigure = figure;
}

function createNeonSigns() {
    const neonColors = [0xff00ff, 0x00ffff, 0xff0066, 0x00ff99];

    for (let i = 0; i < 4; i++) {
        const neonLight = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 1),
            new THREE.MeshBasicMaterial({
                color: neonColors[i],
                transparent: true,
                opacity: 0.6
            })
        );
        neonLight.position.set(
            i % 2 === 0 ? -11 : 11,
            3 + Math.random() * 2,
            -10 + i * 8
        );
        neonLight.rotation.y = i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;
        scene.add(neonLight);

        // Neon glow
        const neonGlow = new THREE.PointLight(neonColors[i], 0.5, 8);
        neonGlow.position.copy(neonLight.position);
        neonGlow.userData.flicker = true;
        scene.add(neonGlow);
    }
}

function createRainParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = Math.random() * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        velocities.push(0.05 + Math.random() * 0.1);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x888888,
        size: 0.05,
        transparent: true,
        opacity: 0.4
    });

    const rain = new THREE.Points(geometry, material);
    rain.userData.velocities = velocities;
    scene.add(rain);
    sceneObjects.rain = rain;
}

function createMemoryPuddles() {
    // Puddles with memory reflections
    for (let i = 0; i < 5; i++) {
        const puddle = new THREE.Mesh(
            new THREE.CircleGeometry(0.5 + Math.random() * 0.3, 16),
            new THREE.MeshBasicMaterial({
                color: 0x2a3a5a,
                transparent: true,
                opacity: 0.6
            })
        );
        puddle.rotation.x = -Math.PI / 2;
        puddle.position.set(
            (Math.random() - 0.5) * 8,
            0.02,
            -5 + i * 5
        );
        puddle.userData.clickable = true;
        scene.add(puddle);
    }
}

// ===================================
// INTERACTION HANDLERS
// ===================================

function handleObjectClick(object) {
    if (object.userData.clickable) {
        if (object.userData.dialogue) {
            showTemporaryDialogue(object.userData.dialogue, object.position);
        }
    }
}

function showTemporaryDialogue(text, position) {
    const container = document.getElementById('dialogue-container');
    container.classList.remove('hidden');

    const bubble = document.createElement('div');
    bubble.className = 'dialogue-bubble';
    bubble.textContent = text;
    bubble.style.left = '50%';
    bubble.style.top = '40%';
    container.appendChild(bubble);

    setTimeout(() => {
        bubble.style.opacity = '0';
        setTimeout(() => {
            bubble.remove();
            if (container.children.length === 0) {
                container.classList.add('hidden');
            }
        }, 600);
    }, 3000);
}

function updateSceneTitle(title, subtitle) {
    const sceneTitleEl = document.getElementById('scene-title');
    const titleText = document.getElementById('title-text');
    const subtitleText = document.getElementById('subtitle-text');

    titleText.textContent = title;
    subtitleText.textContent = subtitle;

    sceneTitleEl.classList.remove('hidden');
    sceneTitleEl.classList.add('visible');

    setTimeout(() => {
        sceneTitleEl.classList.remove('visible');
        sceneTitleEl.classList.add('hidden');
    }, 4000);
}

// ===================================
// ANIMATION LOOP
// ===================================

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    if (controls.enabled) {
        controls.update();
    }

    // Scene-specific animations
    if (sceneState.current === SCENES.ARGUMENT) {
        animateArgumentScene(elapsedTime);
    } else if (sceneState.current === SCENES.COMMUNICATE) {
        animateCommunicateScene(elapsedTime);
    } else if (sceneState.current === SCENES.RUNAWAY) {
        animateRunAwayScene(elapsedTime, delta);
    }

    renderer.render(scene, camera);
}

function animateArgumentScene(time) {
    // Trembling items
    if (sceneObjects.cup) {
        sceneObjects.cup.position.x += Math.sin(time * 20) * 0.001;
        sceneObjects.cup.rotation.z = Math.sin(time * 15) * 0.02;
    }

    if (sceneObjects.book) {
        sceneObjects.book.position.y += Math.sin(time * 18) * 0.0008;
    }

    // Lightning flashes
    if (sceneObjects.lightning && Math.random() > 0.98) {
        sceneObjects.lightning.intensity = 3;
        setTimeout(() => {
            if (sceneObjects.lightning) sceneObjects.lightning.intensity = 0;
        }, 100);
    }

    // Figures gesturing
    if (sceneObjects.parent1) {
        sceneObjects.parent1.rotation.y = Math.sin(time * 2) * 0.1;
    }

    if (sceneObjects.parent2) {
        sceneObjects.parent2.rotation.y = Math.sin(time * 1.5 + 1) * 0.1;
    }
}

function animateCommunicateScene(time) {
    // Warm particles floating
    if (sceneObjects.particles) {
        sceneObjects.particles.rotation.y = time * 0.05;
        const positions = sceneObjects.particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] += Math.sin(time + i) * 0.002;

            if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
        }

        sceneObjects.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Subtle breathing animation for figures
    if (sceneObjects.parent1) {
        sceneObjects.parent1.position.y = 0.5 + Math.sin(time * 2) * 0.01;
    }

    if (sceneObjects.parent2) {
        sceneObjects.parent2.position.y = 0.5 + Math.sin(time * 2.2) * 0.01;
    }
}

function animateRunAwayScene(time, delta) {
    // Rain falling
    if (sceneObjects.rain) {
        const positions = sceneObjects.rain.geometry.attributes.position.array;
        const velocities = sceneObjects.rain.userData.velocities;

        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] -= velocities[i];

            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 20;
            }
        }

        sceneObjects.rain.geometry.attributes.position.needsUpdate = true;
    }

    // Lone figure walking
    if (sceneObjects.loneFigure && sceneObjects.loneFigure.userData.walking) {
        sceneObjects.loneFigure.position.z -= 0.02;
        sceneObjects.loneFigure.rotation.y = Math.sin(time * 4) * 0.05;

        // Reset position if too far
        if (sceneObjects.loneFigure.position.z < -30) {
            sceneObjects.loneFigure.position.z = 5;
        }
    }

    // Neon flicker
    scene.traverse((object) => {
        if (object.userData.flicker && object instanceof THREE.PointLight) {
            object.intensity = object.intensity * 0.9 + (0.3 + Math.random() * 0.4) * 0.1;
        }
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🎭 Family Choice - Interactive Narrative 🎭', 'color: #64ffda; font-size: 20px; font-weight: bold;');
console.log('%cMake your choice, shape your story...', 'color: #64ffda; font-size: 14px;');
