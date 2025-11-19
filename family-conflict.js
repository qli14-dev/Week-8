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
let dustParticles, cityFog, playerCharacter;
let isDragging = false, dragStartX = 0, cameraRotationAngle = 0;
let audioContext, sounds = {};

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
        initAudio();
    });

    // Mouse movement for camera control
    window.addEventListener('mousemove', onMouseMove);

    // Click detection for interactive objects
    window.addEventListener('click', onMouseClick);

    // Mouse drag for camera rotation
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseDrag);

    // Touch events for mobile
    window.addEventListener('touchstart', (e) => {
        if (sceneState.phase === 'runaway') {
            isDragging = true;
            dragStartX = e.touches[0].clientX;
        }
    });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
        if (isDragging && sceneState.phase === 'runaway') {
            const deltaX = e.touches[0].clientX - dragStartX;
            cameraRotationAngle += deltaX * 0.005;
            dragStartX = e.touches[0].clientX;
        }
    });

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

        if (object.userData.clickable) {
            handleObjectClick(object);
            break;
        }
    }
}

function onMouseDown(event) {
    if (sceneState.phase === 'runaway') {
        isDragging = true;
        dragStartX = event.clientX;
    }
}

function onMouseUp(event) {
    isDragging = false;
}

function onMouseDrag(event) {
    if (isDragging && sceneState.phase === 'runaway') {
        const deltaX = event.clientX - dragStartX;
        cameraRotationAngle += deltaX * 0.005;
        dragStartX = event.clientX;
    }
}

function handleObjectClick(object) {
    const atmosphereMessage = document.getElementById('atmosphere-message');
    const messageText = atmosphereMessage.querySelector('.fade-text');

    let message = '';

    // Handle neon sign clicks in city scene
    if (object.name && object.name.includes('neon')) {
        const neonLight = object.userData.neonLight;
        const originalIntensity = object.userData.originalIntensity;

        // Flicker effect
        let flickerCount = 0;
        const flickerInterval = setInterval(() => {
            flickerCount++;
            neonLight.intensity = flickerCount % 2 === 0 ? originalIntensity : 0.2;
            object.material.opacity = flickerCount % 2 === 0 ? 0.7 : 0.2;

            if (flickerCount >= 8) {
                clearInterval(flickerInterval);
                neonLight.intensity = originalIntensity;
                object.material.opacity = 0.7;
            }
        }, 100);

        return;
    }

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
// AUDIO SYSTEM
// ===================================

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio system initialized');
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playSound(type) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different interactions
    switch(type) {
        case 'piano':
            oscillator.frequency.value = 261.63; // Middle C
            gainNode.gain.value = 0.3;
            break;
        case 'chime':
            oscillator.frequency.value = 523.25; // High C
            gainNode.gain.value = 0.2;
            oscillator.type = 'sine';
            break;
        case 'footstep':
            oscillator.frequency.value = 80;
            gainNode.gain.value = 0.15;
            oscillator.type = 'square';
            break;
        case 'glow':
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.1;
            oscillator.type = 'sine';
            break;
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
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
    // Play soft piano sound
    playSound('piano');

    // Gradually brighten the scene to warm golden sunlight
    const overheadLight = scene.userData.overheadLight;
    const windowLight = scene.userData.windowLight;
    const tensionLight = scene.userData.tensionLight;
    const windowGlass = scene.userData.windowGlass;

    // Create dust particles floating in sunlight
    createDustParticles();

    // Animate lighting change
    let progress = 0;
    const lightTransition = setInterval(() => {
        progress += 0.008;

        if (progress >= 1) {
            progress = 1;
            clearInterval(lightTransition);
            // Show dialogue bubbles after transition
            setTimeout(() => showReassuringDialogueBubbles(), 1000);
        }

        // Brighten lights to golden sunshine
        overheadLight.intensity = 0.8 + progress * 1.2;
        overheadLight.color.setHex(lerpColor(0xffa500, 0xffd89b, progress));

        // Strong golden window light (like afternoon sun)
        windowLight.intensity = 0.4 + progress * 1.5;
        windowLight.color.setHex(lerpColor(0x4a6fa5, 0xffd89b, progress));

        // Reduce tension light completely
        tensionLight.intensity = 0.5 * (1 - progress);

        // Clear storm - show sunny blue sky
        windowGlass.material.color.setHex(lerpColor(0x2c4a7c, 0x87ceeb, progress));
        windowGlass.material.opacity = 0.6 - progress * 0.3;

        // Fade out tension particles
        scene.userData.tensionParticles.material.opacity = 0.4 * (1 - progress);

        // Change scene to warm, hopeful atmosphere
        scene.fog.color.setHex(lerpColor(0x1a1a2e, 0xfff4e0, progress));
        scene.background.setHex(lerpColor(0x16213e, 0xffefd5, progress));

        // Update dust particles opacity
        if (dustParticles) {
            dustParticles.material.opacity = 0.6 * progress;
        }

    }, 30);

    // Animate parents to sit together and reconnect
    animateReconciliation();
}

function createDustParticles() {
    const particleCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        // Particles concentrated in sunlight beam area
        positions[i * 3] = (Math.random() - 0.5) * 8 + 3; // Bias toward window side
        positions[i * 3 + 1] = Math.random() * 5 + 1;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        velocities.push({
            x: (Math.random() - 0.5) * 0.002,
            y: Math.random() * 0.003 + 0.001, // Slow upward drift
            z: (Math.random() - 0.5) * 0.002
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.04,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    dustParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    dustParticles.userData.velocities = velocities;
    scene.add(dustParticles);
    scene.userData.dustParticles = dustParticles;
}

function animateReconciliation() {
    const mother = scene.userData.mother;
    const father = scene.userData.father;

    // Move parents to sit together on couch
    let progress = 0;
    const reconcileInterval = setInterval(() => {
        progress += 0.008;

        if (progress >= 1) {
            progress = 1;
            clearInterval(reconcileInterval);
            // Make family members clickable for interactions
            makeFamilyMembersInteractive();
        }

        // Mother moving to sit on couch and calming
        mother.position.x = lerp(-2, -0.8, progress);
        mother.position.z = lerp(-1, -3.5, progress);
        mother.rotation.y = lerp(Math.PI / 6, 0, progress);
        mother.userData.rightArm.rotation.z = lerp(-Math.PI / 6, -Math.PI / 12, progress);
        mother.userData.leftArm.rotation.z = lerp(Math.PI / 6, Math.PI / 12, progress);
        mother.userData.head.rotation.y = lerp(mother.userData.head.rotation.y, Math.PI / 8, progress * 0.1);

        // Father moving to sit on couch and calming
        father.position.x = lerp(2, 0.8, progress);
        father.position.z = lerp(-1, -3.5, progress);
        father.rotation.y = lerp(-Math.PI / 6, 0, progress);
        father.userData.leftArm.rotation.z = lerp(Math.PI / 6, Math.PI / 12, progress);
        father.userData.rightArm.rotation.z = lerp(-Math.PI / 6, -Math.PI / 12, progress);
        father.userData.head.rotation.y = lerp(father.userData.head.rotation.y, -Math.PI / 8, progress * 0.1);

    }, 30);

    // Camera circles around the family
    setTimeout(() => {
        startFamilyCircle();
    }, 3000);
}

function makeFamilyMembersInteractive() {
    const mother = scene.userData.mother;
    const father = scene.userData.father;

    mother.userData.clickable = true;
    mother.userData.interactionType = 'mother';
    mother.name = 'mother';

    father.userData.clickable = true;
    father.userData.interactionType = 'father';
    father.name = 'father';

    // Update click handler
    const originalHandler = handleObjectClick;
    window.handleObjectClick = function(object) {
        if (object.userData.interactionType === 'mother') {
            playSound('chime');
            // Animate mother nodding
            const head = object.userData.head;
            const startRotation = head.rotation.x;
            let nodProgress = 0;
            const nodInterval = setInterval(() => {
                nodProgress += 0.1;
                if (nodProgress >= 1) {
                    head.rotation.x = startRotation;
                    clearInterval(nodInterval);
                } else {
                    head.rotation.x = startRotation + Math.sin(nodProgress * Math.PI * 2) * 0.15;
                }
            }, 30);
            showTextBubble("It's okay", '25%', '40%');
        } else if (object.userData.interactionType === 'father') {
            playSound('piano');
            // Animate father reaching out
            const rightArm = object.userData.rightArm;
            const startRotation = rightArm.rotation.z;
            let reachProgress = 0;
            const reachInterval = setInterval(() => {
                reachProgress += 0.05;
                if (reachProgress >= 1) {
                    clearInterval(reachInterval);
                    setTimeout(() => {
                        let returnProgress = 0;
                        const returnInterval = setInterval(() => {
                            returnProgress += 0.05;
                            if (returnProgress >= 1) {
                                rightArm.rotation.z = startRotation;
                                clearInterval(returnInterval);
                            } else {
                                rightArm.rotation.z = lerp(-Math.PI / 3, startRotation, returnProgress);
                            }
                        }, 30);
                    }, 500);
                } else {
                    rightArm.rotation.z = lerp(startRotation, -Math.PI / 3, reachProgress);
                }
            }, 30);
            showTextBubble("We're here", '65%', '45%');
        } else {
            originalHandler(object);
        }
    };
}

function showReassuringDialogueBubbles() {
    playSound('glow');

    const dialogues = [
        { text: "I'm sorry... I didn't mean to hurt you.", x: '20%', y: '35%', delay: 0 },
        { text: "I know. I'm sorry too.", x: '65%', y: '40%', delay: 2000 },
        { text: "Let's talk about this together.", x: '42%', y: '58%', delay: 4000 },
        { text: "We can work through anything.", x: '35%', y: '30%', delay: 6500 }
    ];

    dialogues.forEach(dialogue => {
        setTimeout(() => {
            playSound('chime');
            showTextBubble(dialogue.text, dialogue.x, dialogue.y);
        }, dialogue.delay);
    });
}

function showTextBubble(text, x, y, duration = 4000) {
    const dialogueContainer = document.getElementById('dialogue-container');

    const bubble = document.createElement('div');
    bubble.className = 'dialogue-bubble';
    bubble.textContent = text;
    bubble.style.left = x;
    bubble.style.top = y;
    dialogueContainer.appendChild(bubble);

    setTimeout(() => {
        bubble.classList.add('visible');
    }, 100);

    // Remove after duration
    setTimeout(() => {
        bubble.classList.remove('visible');
        setTimeout(() => bubble.remove(), 1000);
    }, duration);
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

    // Change scene to dark futuristic city atmosphere
    scene.fog = new THREE.Fog(0x0a0a1a, 10, 80);
    scene.background = new THREE.Color(0x05050f);

    // Create large city ground/street
    const streetGeometry = new THREE.PlaneGeometry(100, 200);
    const streetMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f0f1a,
        roughness: 0.8,
        metalness: 0.3
    });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.rotation.x = -Math.PI / 2;
    street.receiveShadow = true;
    scene.add(street);

    // Create tall skyscrapers
    createSkyscrapers();

    // Create dynamic fog
    createCityFog();

    // Create player character standing alone
    createPlayerCharacter();

    // Create neon lights and signs
    createNeonLights();

    // Create memory puddles on wet pavement
    createMemoryPuddles();

    // Add ambient city lighting
    addCityLighting();

    // Show memory fragments
    setTimeout(() => showMemoryFragments(), 2000);

    // Enable camera rotation
    enableCameraRotation();
}

function createSkyscrapers() {
    const buildingData = [
        // Left side buildings
        { x: -25, z: -40, width: 15, height: 60, depth: 15, color: 0x1a1a2e },
        { x: -30, z: -70, width: 12, height: 80, depth: 12, color: 0x15151f },
        { x: -20, z: -100, width: 18, height: 70, depth: 18, color: 0x1a1a28 },
        { x: -35, z: -130, width: 14, height: 90, depth: 14, color: 0x12121a },

        // Right side buildings
        { x: 25, z: -35, width: 14, height: 55, depth: 14, color: 0x1a1a2e },
        { x: 32, z: -65, width: 16, height: 75, depth: 16, color: 0x15151f },
        { x: 28, z: -95, width: 13, height: 85, depth: 13, color: 0x1a1a28 },
        { x: 38, z: -125, width: 15, height: 95, depth: 15, color: 0x12121a },

        // Far distance buildings
        { x: -15, z: -150, width: 20, height: 100, depth: 20, color: 0x0f0f15 },
        { x: 15, z: -160, width: 22, height: 110, depth: 22, color: 0x0f0f15 },
        { x: 0, z: -180, width: 25, height: 120, depth: 25, color: 0x0a0a10 }
    ];

    buildingData.forEach(building => {
        const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
        const material = new THREE.MeshStandardMaterial({
            color: building.color,
            roughness: 0.8,
            metalness: 0.2,
            emissive: building.color,
            emissiveIntensity: 0.1
        });
        const skyscraper = new THREE.Mesh(geometry, material);
        skyscraper.position.set(building.x, building.height / 2, building.z);
        skyscraper.castShadow = true;
        skyscraper.receiveShadow = true;

        // Add window lights to buildings
        addBuildingWindows(skyscraper, building);

        scene.add(skyscraper);
    });
}

function addBuildingWindows(building, data) {
    const windowsPerFloor = Math.floor(data.width / 2);
    const floors = Math.floor(data.height / 3);

    for (let floor = 0; floor < floors; floor++) {
        for (let window = 0; window < windowsPerFloor; window++) {
            // Randomly lit windows
            if (Math.random() > 0.6) {
                const windowLight = new THREE.PointLight(0xffffaa, 0.3, 5);
                const xOffset = (window - windowsPerFloor / 2) * 2;
                const yOffset = (floor - floors / 2) * 3;
                windowLight.position.set(
                    data.x + xOffset,
                    data.height / 2 + yOffset,
                    data.z
                );
                scene.add(windowLight);
            }
        }
    }
}

function createCityFog() {
    const fogParticles = new THREE.Group();
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 150;
        positions[i * 3 + 1] = Math.random() * 30 + 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;

        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.005,
            z: Math.random() * 0.02
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x4a5a7a,
        size: 2.0,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    cityFog = new THREE.Points(geometry, material);
    cityFog.userData.velocities = velocities;
    scene.add(cityFog);
    scene.userData.cityFog = cityFog;
}

function createPlayerCharacter() {
    playerCharacter = new THREE.Group();
    playerCharacter.name = 'player';

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a3a5a,
        roughness: 0.8
    });

    // Body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8),
        bodyMaterial
    );
    body.position.y = 0.6;
    playerCharacter.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        bodyMaterial
    );
    head.position.y = 1.4;
    playerCharacter.add(head);

    // Backpack
    const backpack = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.5, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x3a4a6a, roughness: 0.9 })
    );
    backpack.position.set(0, 0.8, -0.25);
    playerCharacter.add(backpack);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.4, 0.6, 0);
    leftArm.rotation.z = Math.PI / 12;
    playerCharacter.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.4, 0.6, 0);
    rightArm.rotation.z = -Math.PI / 12;
    playerCharacter.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 8);
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(-0.18, -0.3, 0);
    playerCharacter.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(0.18, -0.3, 0);
    playerCharacter.add(rightLeg);

    playerCharacter.position.set(0, 0, 0);
    playerCharacter.userData.leftLeg = leftLeg;
    playerCharacter.userData.rightLeg = rightLeg;

    scene.add(playerCharacter);
    scene.userData.playerCharacter = playerCharacter;
}

function createNeonLights() {
    const neonSigns = [
        // Close neon signs
        { x: -8, y: 6, z: -15, width: 3, height: 0.8, color: 0xff0080, text: 'HOTEL' },
        { x: 8, y: 5, z: -12, width: 2.5, height: 0.7, color: 0x00ffff, text: 'BAR' },
        { x: -6, y: 7, z: -25, width: 4, height: 1, color: 0xff6600, text: 'DINER' },
        { x: 10, y: 8, z: -30, width: 3.5, height: 0.9, color: 0x00ff00, text: 'TAXI' },

        // Distant neon signs
        { x: -12, y: 12, z: -50, width: 5, height: 1.5, color: 0xff0099, text: '' },
        { x: 15, y: 10, z: -55, width: 4, height: 1.2, color: 0x00ccff, text: '' },
        { x: -18, y: 15, z: -80, width: 6, height: 2, color: 0xff3300, text: '' },
        { x: 20, y: 14, z: -75, width: 5.5, height: 1.8, color: 0x66ff00, text: '' }
    ];

    neonSigns.forEach((sign, index) => {
        // Neon light
        const neonLight = new THREE.PointLight(sign.color, 1.2, 20);
        neonLight.position.set(sign.x, sign.y, sign.z);
        scene.add(neonLight);

        // Neon sign mesh (clickable)
        const signGeometry = new THREE.BoxGeometry(sign.width, sign.height, 0.1);
        const signMaterial = new THREE.MeshBasicMaterial({
            color: sign.color,
            transparent: true,
            opacity: 0.7
        });
        const signMesh = new THREE.Mesh(signGeometry, signMaterial);
        signMesh.position.set(sign.x, sign.y, sign.z);
        signMesh.userData.clickable = true;
        signMesh.userData.neonLight = neonLight;
        signMesh.userData.originalIntensity = 1.2;
        signMesh.userData.flickerIndex = index;
        signMesh.name = `neon${index}`;
        scene.add(signMesh);

        // Add random flickering
        scene.userData[`neon${index}`] = { light: neonLight, mesh: signMesh };
    });
}

function addCityLighting() {
    // Dim ambient light
    const cityAmbient = new THREE.AmbientLight(0x2a3a5a, 0.2);
    scene.add(cityAmbient);

    // Distant city glow
    const cityGlow = new THREE.HemisphereLight(0x4a5a7a, 0x0a0a1a, 0.3);
    scene.add(cityGlow);

    // Street lights
    const streetLightPositions = [
        { x: -5, z: -5 },
        { x: 5, z: -5 },
        { x: -5, z: -20 },
        { x: 5, z: -20 },
        { x: -5, z: -40 },
        { x: 5, z: -40 }
    ];

    streetLightPositions.forEach(pos => {
        const streetLight = new THREE.PointLight(0xffffaa, 0.5, 12);
        streetLight.position.set(pos.x, 4, pos.z);
        scene.add(streetLight);
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

function enableCameraRotation() {
    // Position camera behind and above player character
    targetCameraX = 0;
    targetCameraY = 2.5;
    targetCameraZ = 5;
    cameraRotationAngle = 0;
}

function showMemoryFragments() {
    const fragmentsContainer = document.getElementById('memory-fragments');
    fragmentsContainer.classList.remove('hidden');

    const memories = [
        { text: '"Remember when we used to laugh together?"', delay: 1000 },
        { text: '"Family dinners every Sunday..."', delay: 4000 },
        { text: '"They said they were proud of me once."', delay: 7000 },
        { text: '"Will they even notice I\'m gone?"', delay: 10000 },
        { text: '"The city lights look like stars from here."', delay: 13000 },
        { text: '"Maybe I can find myself out here..."', delay: 16000 }
    ];

    memories.forEach(memory => {
        setTimeout(() => {
            playSound('glow');
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
            }, 3500);
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
        // Smooth camera movement based on path
        if (sceneState.phase === 'runaway') {
            // Rotate camera around player character
            const radius = 5;
            const cameraX = Math.sin(cameraRotationAngle) * radius;
            const cameraZ = Math.cos(cameraRotationAngle) * radius + playerCharacter.position.z;

            camera.position.x += (cameraX - camera.position.x) * CAMERA_MOVE_SPEED;
            camera.position.y += (2.5 - camera.position.y) * CAMERA_MOVE_SPEED;
            camera.position.z += (cameraZ - camera.position.z) * CAMERA_MOVE_SPEED;
            camera.lookAt(playerCharacter.position.x, 1.5, playerCharacter.position.z);

            // Animate player character walking
            if (playerCharacter) {
                const walkCycle = Math.sin(elapsedTime * 2);
                playerCharacter.userData.leftLeg.rotation.x = walkCycle * 0.3;
                playerCharacter.userData.rightLeg.rotation.x = -walkCycle * 0.3;
            }

            // Animate city fog
            if (cityFog) {
                const positions = cityFog.geometry.attributes.position.array;
                const velocities = cityFog.userData.velocities;

                for (let i = 0; i < positions.length / 3; i++) {
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;

                    // Wrap fog particles
                    if (positions[i * 3] > 75) positions[i * 3] = -75;
                    if (positions[i * 3] < -75) positions[i * 3] = 75;
                    if (positions[i * 3 + 1] > 35) positions[i * 3 + 1] = 5;
                    if (positions[i * 3 + 1] < 5) positions[i * 3 + 1] = 35;
                }

                cityFog.geometry.attributes.position.needsUpdate = true;
            }

            // Random neon light flickering
            if (Math.random() > 0.98) {
                const neonIndex = Math.floor(Math.random() * 8);
                const neonData = scene.userData[`neon${neonIndex}`];
                if (neonData) {
                    const flickerDuration = 200;
                    neonData.light.intensity = 0.3;
                    neonData.mesh.material.opacity = 0.3;
                    setTimeout(() => {
                        neonData.light.intensity = neonData.mesh.userData.originalIntensity;
                        neonData.mesh.material.opacity = 0.7;
                    }, flickerDuration);
                }
            }
        } else {
            // Normal camera movement for argument and communicate paths
            camera.position.x += (targetCameraX - camera.position.x) * CAMERA_MOVE_SPEED;
            camera.position.y += (1.6 + targetCameraY - camera.position.y) * CAMERA_MOVE_SPEED;
            camera.position.z += (targetCameraZ - camera.position.z) * CAMERA_MOVE_SPEED;
            camera.lookAt(0, 1.5, 0);
        }

        // Animate dust particles in COMMUNICATE path
        if (dustParticles && sceneState.phase === 'communicate') {
            const positions = dustParticles.geometry.attributes.position.array;
            const velocities = dustParticles.userData.velocities;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y + Math.sin(elapsedTime + i * 0.1) * 0.001;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap dust particles in sunlight area
                if (positions[i * 3] > 7) positions[i * 3] = -1;
                if (positions[i * 3] < -1) positions[i * 3] = 7;
                if (positions[i * 3 + 1] > 6) positions[i * 3 + 1] = 1;
                if (positions[i * 3 + 1] < 1) positions[i * 3 + 1] = 6;
                if (positions[i * 3 + 2] > 4) positions[i * 3 + 2] = -4;
                if (positions[i * 3 + 2] < -4) positions[i * 3 + 2] = 4;
            }

            dustParticles.geometry.attributes.position.needsUpdate = true;
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
