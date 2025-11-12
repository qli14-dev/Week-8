// ===================================
// FAMILY CONFLICT NARRATIVE
// A 3D Interactive Emotional Journey
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let livingRoom, parents, interactiveObjects;
let clock, currentPath = null, isSceneActive = false;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0, targetCameraZ = 5;

// Scene state
let sceneState = {
    phase: 'intro', // intro, argument, choice, communicate, runaway
    tensionLevel: 0,
    choiceMade: false
};

// Constants
const CAMERA_MOVE_SPEED = 0.03;
const MOUSE_SENSITIVITY = 0.0005;

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

    // Initialize Three.js components
    initThreeJS();
    createLighting();
    createLivingRoom();
    createParents();
    createInteractiveObjects();
    createTensionParticles();

    // Start animation loop
    animate();
}

// ===================================
// THREE.JS SETUP
// ===================================

function initThreeJS() {
    // Scene setup with dark, tense atmosphere
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 8, 25);
    scene.background = new THREE.Color(0x16213e);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        70,
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
    renderer.toneMappingExposure = 0.6;

    // Raycaster for mouse interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Clock for animations
    clock = new THREE.Clock();
}

// ===================================
// LIGHTING SYSTEM - TENSE & DRAMATIC
// ===================================

function createLighting() {
    // Dim ambient light for tension
    const ambientLight = new THREE.AmbientLight(0x4a5568, 0.3);
    scene.add(ambientLight);

    // Main overhead light - dim and flickering
    const overheadLight = new THREE.PointLight(0xffa500, 0.8, 15);
    overheadLight.position.set(0, 3, 0);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 1024;
    overheadLight.shadow.mapSize.height = 1024;
    scene.add(overheadLight);
    scene.userData.overheadLight = overheadLight;

    // Window light - stormy outside
    const windowLight = new THREE.DirectionalLight(0x4a6fa5, 0.4);
    windowLight.position.set(-5, 3, 2);
    windowLight.castShadow = true;
    scene.add(windowLight);
    scene.userData.windowLight = windowLight;

    // Tension indicator light (red tint)
    const tensionLight = new THREE.PointLight(0xe74c3c, 0.5, 10);
    tensionLight.position.set(0, 2, 0);
    scene.add(tensionLight);
    scene.userData.tensionLight = tensionLight;

    // Corner lamps for atmosphere
    const lamp1 = new THREE.PointLight(0xff8c42, 0.4, 6);
    lamp1.position.set(-3, 1.5, -3);
    scene.add(lamp1);

    const lamp2 = new THREE.PointLight(0xff8c42, 0.4, 6);
    lamp2.position.set(3, 1.5, -3);
    scene.add(lamp2);
}

// ===================================
// LIVING ROOM ENVIRONMENT
// ===================================

function createLivingRoom() {
    livingRoom = new THREE.Group();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a52,
        roughness: 0.9,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    livingRoom.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c2c3e,
        roughness: 0.95,
        metalness: 0.05
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    backWall.position.set(0, 3, -10);
    backWall.receiveShadow = true;
    livingRoom.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    leftWall.position.set(-10, 3, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    livingRoom.add(leftWall);

    // Right wall with window
    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    rightWall.position.set(10, 3, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    livingRoom.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.9
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 6;
    ceiling.receiveShadow = true;
    livingRoom.add(ceiling);

    // Window with stormy view
    createWindow();

    // Coffee table in center
    createCoffeeTable();

    // Couch
    createCouch();

    // Wall decorations
    createWallDecorations();

    scene.add(livingRoom);
}

// ===================================
// WINDOW WITH STORM
// ===================================

function createWindow() {
    const windowGroup = new THREE.Group();

    // Window frame
    const frameGeometry = new THREE.BoxGeometry(3, 3, 0.2);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(9.9, 3, 0);
    frame.rotation.y = -Math.PI / 2;

    // Window glass with storm reflection
    const glassGeometry = new THREE.PlaneGeometry(2.8, 2.8);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2c4a7c,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.7
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(9.85, 3, 0);
    glass.rotation.y = -Math.PI / 2;
    scene.userData.windowGlass = glass;

    windowGroup.add(frame);
    windowGroup.add(glass);
    livingRoom.add(windowGroup);
}

// ===================================
// FURNITURE
// ===================================

function createCoffeeTable() {
    const tableGroup = new THREE.Group();
    tableGroup.name = 'coffeeTable';

    // Table top
    const topGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3f35,
        roughness: 0.6,
        metalness: 0.3
    });
    const top = new THREE.Mesh(topGeometry, tableMaterial);
    top.position.y = 0.5;
    top.castShadow = true;
    top.receiveShadow = true;
    tableGroup.add(top);

    // Table legs
    const legGeometry = new THREE.BoxGeometry(0.08, 0.5, 0.08);
    const legPositions = [
        [-0.9, 0.25, -0.4],
        [0.9, 0.25, -0.4],
        [-0.9, 0.25, 0.4],
        [0.9, 0.25, 0.4]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, tableMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        tableGroup.add(leg);
    });

    tableGroup.position.set(0, 0, 1);
    tableGroup.userData.originalY = 0;
    tableGroup.userData.canTremble = true;
    scene.userData.coffeeTable = tableGroup;
    livingRoom.add(tableGroup);
}

function createCouch() {
    const couchGroup = new THREE.Group();

    const couchMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a4a42,
        roughness: 0.9
    });

    // Couch base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.6, 1),
        couchMaterial
    );
    base.position.set(0, 0.3, -4);
    base.castShadow = true;
    base.receiveShadow = true;
    couchGroup.add(base);

    // Couch back
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1, 0.3),
        couchMaterial
    );
    back.position.set(0, 0.9, -4.35);
    back.castShadow = true;
    couchGroup.add(back);

    // Armrests
    const armrest1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.8, 1),
        couchMaterial
    );
    armrest1.position.set(-1.35, 0.7, -4);
    armrest1.castShadow = true;
    couchGroup.add(armrest1);

    const armrest2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.8, 1),
        couchMaterial
    );
    armrest2.position.set(1.35, 0.7, -4);
    armrest2.castShadow = true;
    couchGroup.add(armrest2);

    livingRoom.add(couchGroup);
}

// ===================================
// WALL DECORATIONS & FAMILY PHOTOS
// ===================================

function createWallDecorations() {
    // Family photo frames - clickable
    const photoPositions = [
        { x: -3, y: 3.5, z: -9.9, name: 'Family vacation' },
        { x: 0, y: 3.8, z: -9.9, name: 'Graduation day' },
        { x: 3, y: 3.5, z: -9.9, name: 'Birthday celebration' }
    ];

    photoPositions.forEach((pos, index) => {
        const photoGroup = new THREE.Group();
        photoGroup.name = `photo${index}`;

        // Frame
        const frameGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.05);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.5,
            metalness: 0.3
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);

        // Photo (warm color to represent happy memories)
        const photoGeometry = new THREE.PlaneGeometry(0.55, 0.75);
        const photoMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd4a3,
            roughness: 0.8,
            emissive: 0xffd4a3,
            emissiveIntensity: 0.2
        });
        const photo = new THREE.Mesh(photoGeometry, photoMaterial);
        photo.position.z = 0.026;

        photoGroup.add(frame);
        photoGroup.add(photo);
        photoGroup.position.set(pos.x, pos.y, pos.z);
        photoGroup.userData.clickable = true;
        photoGroup.userData.memoryText = pos.name;
        photoGroup.userData.originalEmissive = 0.2;

        livingRoom.add(photoGroup);
    });
}

// ===================================
// PARENT CHARACTERS
// ===================================

function createParents() {
    parents = new THREE.Group();
    parents.name = 'parents';

    // Mother figure (left side)
    const mother = createHumanFigure(0x8b7355, 'mother');
    mother.position.set(-2, 0, -1);
    mother.rotation.y = Math.PI / 6;
    parents.add(mother);

    // Father figure (right side)
    const father = createHumanFigure(0x6a5d52, 'father');
    father.position.set(2, 0, -1);
    father.rotation.y = -Math.PI / 6;
    parents.add(father);

    scene.userData.mother = mother;
    scene.userData.father = father;
    scene.add(parents);
}

function createHumanFigure(color, name) {
    const figure = new THREE.Group();
    figure.name = name;

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8
    });

    // Body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 1, 8),
        material
    );
    body.position.y = 1;
    body.castShadow = true;
    figure.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        material
    );
    head.position.y = 1.7;
    head.castShadow = true;
    figure.add(head);
    figure.userData.head = head;

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8);

    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.35, 0.9, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.castShadow = true;
    figure.add(leftArm);
    figure.userData.leftArm = leftArm;

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.35, 0.9, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.castShadow = true;
    figure.add(rightArm);
    figure.userData.rightArm = rightArm;

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 8);

    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.15, 0.05, 0);
    leftLeg.castShadow = true;
    figure.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.15, 0.05, 0);
    rightLeg.castShadow = true;
    figure.add(rightLeg);

    figure.userData.originalRotation = { y: figure.rotation.y };

    return figure;
}

// ===================================
// INTERACTIVE OBJECTS ON TABLE
// ===================================

function createInteractiveObjects() {
    interactiveObjects = new THREE.Group();
    interactiveObjects.name = 'tableObjects';

    // Coffee mug
    const mug = createMug();
    mug.position.set(-0.4, 0.55, 1);
    mug.name = 'mug';
    mug.userData.clickable = true;
    mug.userData.canTremble = true;
    mug.userData.originalY = 0.55;
    scene.userData.mug = mug;
    interactiveObjects.add(mug);

    // Book
    const book = createBook();
    book.position.set(0.5, 0.55, 0.8);
    book.rotation.y = Math.PI / 4;
    book.name = 'book';
    book.userData.clickable = true;
    book.userData.canTremble = true;
    book.userData.originalY = 0.55;
    scene.userData.book = book;
    interactiveObjects.add(book);

    // Remote control
    const remote = createRemote();
    remote.position.set(0, 0.55, 1.2);
    remote.name = 'remote';
    remote.userData.clickable = true;
    remote.userData.canTremble = true;
    remote.userData.originalY = 0.55;
    scene.userData.remote = remote;
    interactiveObjects.add(remote);

    scene.add(interactiveObjects);
}

function createMug() {
    const mug = new THREE.Group();

    const mugGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16);
    const mugMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.6
    });
    const mugMesh = new THREE.Mesh(mugGeometry, mugMaterial);
    mugMesh.castShadow = true;
    mug.add(mugMesh);

    // Handle
    const handleGeometry = new THREE.TorusGeometry(0.05, 0.015, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeometry, mugMaterial);
    handle.position.set(0.08, 0, 0);
    handle.rotation.z = Math.PI / 2;
    handle.rotation.y = Math.PI / 2;
    mug.add(handle);

    return mug;
}

function createBook() {
    const book = new THREE.Group();

    const bookGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.4);
    const bookMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a5d8b,
        roughness: 0.9
    });
    const bookMesh = new THREE.Mesh(bookGeometry, bookMaterial);
    bookMesh.castShadow = true;
    book.add(bookMesh);

    return book;
}

function createRemote() {
    const remote = new THREE.Group();

    const remoteGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.05);
    const remoteMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.7
    });
    const remoteMesh = new THREE.Mesh(remoteGeometry, remoteMaterial);
    remoteMesh.castShadow = true;
    remote.add(remoteMesh);

    return remote;
}

// ===================================
// TENSION PARTICLES
// ===================================

function createTensionParticles() {
    const particleCount = 150;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = Math.random() * 6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        velocities.push({
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xe74c3c,
        size: 0.03,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData.velocities = velocities;
    scene.userData.tensionParticles = particles;
    scene.add(particles);
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Enter button
    const enterButton = document.querySelector('.enter-button');
    enterButton.addEventListener('click', () => {
        enterScene();
    });

    // Mouse movement for camera control
    window.addEventListener('mousemove', onMouseMove);

    // Click detection for interactive objects
    window.addEventListener('click', onMouseClick);

    // Choice buttons
    document.getElementById('communicate-btn').addEventListener('click', () => {
        choosePathCommunicate();
    });

    document.getElementById('runaway-btn').addEventListener('click', () => {
        choosePathRunAway();
    });

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    if (!isSceneActive) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = mouseX * 2;
    targetCameraY = mouseY * 1;
}

function onMouseClick(event) {
    if (!isSceneActive || sceneState.choiceMade) return;

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

        if (object.userData.clickable) {
            handleObjectClick(object);
            break;
        }
    }
}

function handleObjectClick(object) {
    const atmosphereMessage = document.getElementById('atmosphere-message');
    const messageText = atmosphereMessage.querySelector('.fade-text');

    let message = '';

    if (object.name.includes('photo')) {
        message = `"${object.userData.memoryText}... when things were simpler."`;
        // Pulse the photo
        const originalIntensity = object.userData.originalEmissive;
        const photo = object.children[1];
        photo.material.emissiveIntensity = 0.6;
        setTimeout(() => {
            photo.material.emissiveIntensity = originalIntensity;
        }, 1000);
    } else if (object.name === 'mug') {
        message = '"Cold coffee. How long have we been arguing?"';
    } else if (object.name === 'book') {
        message = '"A gift from them... from better times."';
    } else if (object.name === 'remote') {
        message = '"The TV is off. Only our voices fill the room."';
    }

    if (message) {
        messageText.textContent = message;
        atmosphereMessage.classList.remove('hidden');
        setTimeout(() => {
            atmosphereMessage.classList.add('hidden');
        }, 4000);
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

function enterScene() {
    const introScreen = document.getElementById('intro-screen');
    const canvas = document.getElementById('scene-canvas');
    const uiOverlay = document.getElementById('ui-overlay');

    // Fade out intro screen
    introScreen.classList.add('hidden');

    // Fade in 3D scene
    setTimeout(() => {
        canvas.classList.add('visible');
        uiOverlay.classList.remove('hidden');
        isSceneActive = true;
        sceneState.phase = 'argument';

        // Start argument sequence
        startArgumentSequence();
    }, 500);
}

function startArgumentSequence() {
    // Increase tension over time
    sceneState.tensionLevel = 0;

    const tensionInterval = setInterval(() => {
        if (sceneState.tensionLevel < 1 && sceneState.phase === 'argument') {
            sceneState.tensionLevel += 0.01;
        } else {
            clearInterval(tensionInterval);
            // Show choices when tension reaches peak
            setTimeout(() => {
                showChoices();
            }, 2000);
        }
    }, 50);

    // Animate parents arguing
    animateArgument();
}

function animateArgument() {
    const mother = scene.userData.mother;
    const father = scene.userData.father;

    // Gestural animation for parents
    function gestureLoop() {
        if (sceneState.phase !== 'argument') return;

        // Mother gesturing
        const motherArmRotation = Math.sin(clock.getElapsedTime() * 2) * 0.5;
        mother.userData.rightArm.rotation.z = -Math.PI / 6 + motherArmRotation;
        mother.userData.head.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.3;

        // Father gesturing
        const fatherArmRotation = Math.sin(clock.getElapsedTime() * 2 + Math.PI) * 0.5;
        father.userData.leftArm.rotation.z = Math.PI / 6 + fatherArmRotation;
        father.userData.head.rotation.y = Math.sin(clock.getElapsedTime() * 1.5 + Math.PI) * 0.3;
    }

    // Start gesture loop
    scene.userData.gestureLoop = gestureLoop;
}

function showChoices() {
    sceneState.phase = 'choice';
    const choiceContainer = document.getElementById('choice-container');
    const sceneTitle = document.getElementById('scene-title-text');
    const sceneSubtitle = document.getElementById('scene-subtitle');

    // Update title
    sceneTitle.textContent = 'What Will You Do?';
    sceneSubtitle.textContent = 'This moment will change everything';

    // Show choices
    choiceContainer.classList.remove('hidden');
}

// ===================================
// CHOICE PATH: COMMUNICATE
// ===================================

function choosePathCommunicate() {
    if (sceneState.choiceMade) return;

    sceneState.choiceMade = true;
    sceneState.phase = 'communicate';
    currentPath = 'communicate';

    // Hide choices
    document.getElementById('choice-container').classList.add('hidden');

    // Update title
    const sceneTitle = document.getElementById('scene-title-text');
    const sceneSubtitle = document.getElementById('scene-subtitle');
    sceneTitle.textContent = 'Understanding';
    sceneSubtitle.textContent = 'The storm begins to clear';

    // Transition to reconciliation
    transitionToCommunicate();
}

function transitionToCommunicate() {
    // Gradually brighten the scene
    const overheadLight = scene.userData.overheadLight;
    const windowLight = scene.userData.windowLight;
    const tensionLight = scene.userData.tensionLight;
    const windowGlass = scene.userData.windowGlass;

    // Animate lighting change
    let progress = 0;
    const lightTransition = setInterval(() => {
        progress += 0.01;

        if (progress >= 1) {
            progress = 1;
            clearInterval(lightTransition);
            showDialogueBubbles();
        }

        // Brighten lights
        overheadLight.intensity = 0.8 + progress * 0.7;
        overheadLight.color.setHex(lerpColor(0xffa500, 0xffd89b, progress));

        windowLight.intensity = 0.4 + progress * 0.8;
        windowLight.color.setHex(lerpColor(0x4a6fa5, 0x87ceeb, progress));

        // Reduce tension light
        tensionLight.intensity = 0.5 * (1 - progress);

        // Clear storm from window
        windowGlass.material.color.setHex(lerpColor(0x2c4a7c, 0x87ceeb, progress));

        // Reduce tension particles
        scene.userData.tensionParticles.material.opacity = 0.4 * (1 - progress);

        // Change scene fog
        scene.fog.color.setHex(lerpColor(0x1a1a2e, 0xffd4a3, progress));
        scene.background.setHex(lerpColor(0x16213e, 0xffe4c4, progress));

    }, 30);

    // Animate parents to calm poses
    animateReconciliation();
}

function animateReconciliation() {
    const mother = scene.userData.mother;
    const father = scene.userData.father;

    let progress = 0;
    const reconcileInterval = setInterval(() => {
        progress += 0.01;

        if (progress >= 1) {
            progress = 1;
            clearInterval(reconcileInterval);
        }

        // Mother calming down
        mother.userData.rightArm.rotation.z = lerp(-Math.PI / 6, -Math.PI / 8, progress);
        mother.userData.leftArm.rotation.z = lerp(Math.PI / 6, Math.PI / 8, progress);
        mother.userData.head.rotation.y = lerp(mother.userData.head.rotation.y, 0, progress * 0.1);

        // Father calming down
        father.userData.leftArm.rotation.z = lerp(Math.PI / 6, Math.PI / 8, progress);
        father.userData.rightArm.rotation.z = lerp(-Math.PI / 6, -Math.PI / 8, progress);
        father.userData.head.rotation.y = lerp(father.userData.head.rotation.y, 0, progress * 0.1);

    }, 30);

    // Camera circles around the family
    setTimeout(() => {
        startFamilyCircle();
    }, 2000);
}

function showDialogueBubbles() {
    const dialogueContainer = document.getElementById('dialogue-container');

    const dialogues = [
        { text: "I'm sorry... I didn't mean to raise my voice.", x: '20%', y: '35%', delay: 0 },
        { text: "I know. I'm sorry too. Let's talk.", x: '65%', y: '40%', delay: 1500 },
        { text: "We can work through this together.", x: '42%', y: '60%', delay: 3000 }
    ];

    dialogues.forEach(dialogue => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'dialogue-bubble';
            bubble.textContent = dialogue.text;
            bubble.style.left = dialogue.x;
            bubble.style.top = dialogue.y;
            dialogueContainer.appendChild(bubble);

            setTimeout(() => {
                bubble.classList.add('visible');
            }, 100);

            // Remove after some time
            setTimeout(() => {
                bubble.classList.remove('visible');
                setTimeout(() => bubble.remove(), 1000);
            }, 4000);
        }, dialogue.delay);
    });
}

function startFamilyCircle() {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    function circleCamera() {
        if (sceneState.phase !== 'communicate') return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const angle = progress * Math.PI * 2;

        targetCameraX = Math.sin(angle) * 4;
        targetCameraZ = Math.cos(angle) * 4;
        camera.lookAt(0, 1.5, -1);

        if (progress < 1) {
            requestAnimationFrame(circleCamera);
        }
    }

    circleCamera();
}

// ===================================
// CHOICE PATH: RUN AWAY
// ===================================

function choosePathRunAway() {
    if (sceneState.choiceMade) return;

    sceneState.choiceMade = true;
    sceneState.phase = 'runaway';
    currentPath = 'runaway';

    // Hide choices
    document.getElementById('choice-container').classList.add('hidden');

    // Update title
    const sceneTitle = document.getElementById('scene-title-text');
    const sceneSubtitle = document.getElementById('scene-subtitle');
    sceneTitle.textContent = 'Escape';
    sceneSubtitle.textContent = 'Into the unknown night';

    // Transition to street
    transitionToStreet();
}

function transitionToStreet() {
    // Fade out living room
    const fadeInterval = setInterval(() => {
        livingRoom.children.forEach(child => {
            if (child.material) {
                child.material.opacity = Math.max(0, child.material.opacity - 0.02);
                child.material.transparent = true;
            }
        });

        parents.children.forEach(parent => {
            parent.children.forEach(part => {
                if (part.material) {
                    part.material.opacity = Math.max(0, part.material.opacity - 0.02);
                    part.material.transparent = true;
                }
            });
        });

        interactiveObjects.children.forEach(obj => {
            obj.children.forEach(part => {
                if (part.material) {
                    part.material.opacity = Math.max(0, part.material.opacity - 0.02);
                    part.material.transparent = true;
                }
            });
        });

        // Check if fade is complete
        if (livingRoom.children[0].material && livingRoom.children[0].material.opacity <= 0) {
            clearInterval(fadeInterval);
            createStreetScene();
        }
    }, 50);
}

function createStreetScene() {
    // Clear previous scene
    scene.remove(livingRoom);
    scene.remove(parents);
    scene.remove(interactiveObjects);

    // Change scene atmosphere
    scene.fog = new THREE.Fog(0x0a0a1a, 5, 30);
    scene.background = new THREE.Color(0x0a0a1a);

    // Create street ground
    const streetGeometry = new THREE.PlaneGeometry(10, 100);
    const streetMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2a,
        roughness: 0.9,
        metalness: 0.2
    });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.rotation.x = -Math.PI / 2;
    street.receiveShadow = true;
    scene.add(street);

    // Create neon lights
    createNeonLights();

    // Create memory puddles
    createMemoryPuddles();

    // Start walking animation
    startWalkingSequence();

    // Show memory fragments
    showMemoryFragments();
}

function createNeonLights() {
    const neonPositions = [
        { x: -4, y: 4, z: -10, color: 0xff0080 },
        { x: 4, y: 3.5, z: -20, color: 0x00ffff },
        { x: -3, y: 4.5, z: -30, color: 0xff6600 },
        { x: 3.5, y: 4, z: -40, color: 0x00ff00 }
    ];

    neonPositions.forEach(pos => {
        const neonLight = new THREE.PointLight(pos.color, 0.8, 15);
        neonLight.position.set(pos.x, pos.y, pos.z);
        scene.add(neonLight);

        // Neon glow mesh
        const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: pos.color,
            transparent: true,
            opacity: 0.6
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(neonLight.position);
        scene.add(glow);
    });
}

function createMemoryPuddles() {
    const puddlePositions = [
        { x: -2, z: -5 },
        { x: 1, z: -12 },
        { x: -1.5, z: -18 },
        { x: 2, z: -25 }
    ];

    puddlePositions.forEach(pos => {
        const puddleGeometry = new THREE.CircleGeometry(1, 32);
        const puddleMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a7ba7,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x2a4a6a,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const puddle = new THREE.Mesh(puddleGeometry, puddleMaterial);
        puddle.rotation.x = -Math.PI / 2;
        puddle.position.set(pos.x, 0.01, pos.z);
        scene.add(puddle);
    });
}

function startWalkingSequence() {
    // Move camera forward
    const startZ = camera.position.z;
    const startTime = Date.now();
    const duration = 15000; // 15 seconds

    function walk() {
        if (sceneState.phase !== 'runaway') return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Move forward
        targetCameraZ = startZ - progress * 40;

        // Slight bobbing motion
        camera.position.y = 1.6 + Math.sin(elapsed * 0.005) * 0.05;

        if (progress < 1) {
            requestAnimationFrame(walk);
        }
    }

    walk();
}

function showMemoryFragments() {
    const fragmentsContainer = document.getElementById('memory-fragments');
    fragmentsContainer.classList.remove('hidden');

    const memories = [
        { text: '"Remember when we used to laugh together?"', delay: 2000 },
        { text: '"Family dinners every Sunday..."', delay: 5000 },
        { text: '"They said they were proud of me once."', delay: 8000 },
        { text: '"Will they even notice I\'m gone?"', delay: 11000 },
        { text: '"The city lights look like stars from here."', delay: 14000 }
    ];

    memories.forEach(memory => {
        setTimeout(() => {
            const fragment = document.createElement('div');
            fragment.className = 'memory-fragment';
            fragment.textContent = memory.text;
            fragment.style.left = `${20 + Math.random() * 60}%`;
            fragment.style.top = `${20 + Math.random() * 60}%`;
            fragmentsContainer.appendChild(fragment);

            setTimeout(() => {
                fragment.classList.add('visible');
            }, 100);

            // Remove after animation
            setTimeout(() => {
                fragment.remove();
            }, 3000);
        }, memory.delay);
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
        camera.position.y += (1.6 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
        camera.position.z += (targetCameraZ - camera.position.z) * CAMERA_MOVE_SPEED;

        if (sceneState.phase !== 'runaway') {
            camera.lookAt(0, 1.5, 0);
        }

        // Tension effects during argument
        if (sceneState.phase === 'argument' || sceneState.phase === 'choice') {
            // Flickering overhead light
            const overheadLight = scene.userData.overheadLight;
            overheadLight.intensity = 0.8 + Math.sin(elapsedTime * 5) * 0.1 * sceneState.tensionLevel;

            // Pulsing tension light
            const tensionLight = scene.userData.tensionLight;
            tensionLight.intensity = 0.5 + Math.sin(elapsedTime * 2) * 0.3 * sceneState.tensionLevel;

            // Trembling objects on table
            const trembleIntensity = 0.003 * sceneState.tensionLevel;

            if (scene.userData.coffeeTable) {
                scene.userData.coffeeTable.position.y =
                    scene.userData.coffeeTable.userData.originalY +
                    Math.sin(elapsedTime * 10) * trembleIntensity;
            }

            if (scene.userData.mug) {
                scene.userData.mug.position.y =
                    scene.userData.mug.userData.originalY +
                    Math.sin(elapsedTime * 12) * trembleIntensity * 1.5;
                scene.userData.mug.rotation.z = Math.sin(elapsedTime * 8) * 0.02 * sceneState.tensionLevel;
            }

            if (scene.userData.book) {
                scene.userData.book.position.y =
                    scene.userData.book.userData.originalY +
                    Math.sin(elapsedTime * 11) * trembleIntensity * 1.5;
            }

            if (scene.userData.remote) {
                scene.userData.remote.position.y =
                    scene.userData.remote.userData.originalY +
                    Math.sin(elapsedTime * 13) * trembleIntensity * 1.5;
            }

            // Run gesture animation for parents
            if (scene.userData.gestureLoop) {
                scene.userData.gestureLoop();
            }
        }

        // Animate tension particles
        if (scene.userData.tensionParticles) {
            const particles = scene.userData.tensionParticles;
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime + i) * 0.002;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap particles
                if (positions[i * 3] > 7.5) positions[i * 3] = -7.5;
                if (positions[i * 3] < -7.5) positions[i * 3] = 7.5;
                if (positions[i * 3 + 1] > 6) positions[i * 3 + 1] = 0;
                if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 6;
                if (positions[i * 3 + 2] > 7.5) positions[i * 3 + 2] = -7.5;
                if (positions[i * 3 + 2] < -7.5) positions[i * 3 + 2] = 7.5;
            }

            particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    renderer.render(scene, camera);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function lerpColor(colorA, colorB, t) {
    const ca = new THREE.Color(colorA);
    const cb = new THREE.Color(colorB);
    return ca.lerp(cb, t).getHex();
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c💔 Family Conflict Narrative 💔', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
console.log('%cEvery choice shapes your journey...', 'color: #e74c3c; font-size: 14px;');
