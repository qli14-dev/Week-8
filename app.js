// ===================================
// FAMILY CHOICE - INTERACTIVE 3D NARRATIVE
// A Choice-Driven Experience
// ===================================

// Global variables
let scene, camera, renderer, raycaster, mouse;
let clock;
let currentScene = 'intro'; // intro, argument, communicate, leave
let isSceneActive = false;

// Scene-specific objects
let livingRoom, familyMembers = [];
let warmScene, warmFamily = [];
let cityScene, characterModel, cityLights = [];
let particles, fog;

// Mouse tracking
let mouseX = 0, mouseY = 0;
let isDragging = false;
let previousMouseX = 0, previousMouseY = 0;

// Camera control
let targetCameraRotationX = 0, targetCameraRotationY = 0;
let cameraRotationX = 0, cameraRotationY = 0;

// Audio
let audioContext;

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
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.6, 3);

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
    const communicateBtn = document.querySelector('.communicate-btn');
    const leaveBtn = document.querySelector('.leave-btn');

    if (communicateBtn) {
        communicateBtn.addEventListener('click', () => choosePath('communicate'));
    }
    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => choosePath('leave'));
    }

    // Mouse events
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', onMouseClick);

    // Touch events for mobile
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    if (!isSceneActive) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        if (currentScene === 'leave') {
            targetCameraRotationY -= deltaX * 0.005;
            targetCameraRotationX -= deltaY * 0.005;
            targetCameraRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetCameraRotationX));
        } else if (currentScene === 'communicate') {
            createWarmthParticles(event.clientX, event.clientY);
        }

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
}

function onMouseDown(event) {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseUp() {
    isDragging = false;
}

function onMouseClick(event) {
    if (!isSceneActive) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        handleObjectClick(intersects[0].object);
    }
}

function onTouchStart(event) {
    if (event.touches.length > 0) {
        isDragging = true;
        previousMouseX = event.touches[0].clientX;
        previousMouseY = event.touches[0].clientY;
    }
}

function onTouchMove(event) {
    if (!isSceneActive || event.touches.length === 0) return;

    event.preventDefault();

    const touch = event.touches[0];
    mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
        const deltaX = touch.clientX - previousMouseX;
        const deltaY = touch.clientY - previousMouseY;

        if (currentScene === 'leave') {
            targetCameraRotationY -= deltaX * 0.005;
            targetCameraRotationX -= deltaY * 0.005;
            targetCameraRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetCameraRotationX));
        } else if (currentScene === 'communicate') {
            createWarmthParticles(touch.clientX, touch.clientY);
        }

        previousMouseX = touch.clientX;
        previousMouseY = touch.clientY;
    }
}

function onTouchEnd() {
    isDragging = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SCENE 1: FAMILY ARGUMENT (DIM LIVING ROOM)
// ===================================

function startArgumentScene() {
    currentScene = 'argument';

    // Hide intro screen
    const introScreen = document.getElementById('intro-screen');
    introScreen.classList.add('hidden');

    // Show canvas
    const canvas = document.getElementById('scene-canvas');
    canvas.style.opacity = '1';

    isSceneActive = true;

    // Clear scene
    clearScene();

    // Create dim living room
    createDimLivingRoom();

    // Play tense ambient sound
    playSound('ambient-tense', 0.3, true);

    // Show choices after 3 seconds
    setTimeout(() => {
        showChoices();
    }, 3000);
}

function createDimLivingRoom() {
    livingRoom = new THREE.Group();

    // Dim lighting
    const ambientLight = new THREE.AmbientLight(0x4a4a5a, 0.3);
    scene.add(ambientLight);

    // Single harsh overhead light
    const overheadLight = new THREE.PointLight(0x8080a0, 0.8, 15);
    overheadLight.position.set(0, 3, 0);
    overheadLight.castShadow = true;
    scene.add(overheadLight);

    // Flickering light effect
    overheadLight.userData.flickering = true;
    scene.userData.overheadLight = overheadLight;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a4a,
        roughness: 0.9,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    livingRoom.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a5a,
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

    // Create family members (silhouettes)
    createFamilySilhouettes();

    // Shaking objects
    createShakingObjects();

    // Add fog
    scene.fog = new THREE.Fog(0x2a2a3a, 5, 15);
    scene.background = new THREE.Color(0x2a2a3a);

    scene.add(livingRoom);
}

function createFamilySilhouettes() {
    const personMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2a,
        roughness: 0.8
    });

    // Person 1 (left)
    const person1 = new THREE.Group();
    const body1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8),
        personMaterial
    );
    body1.position.y = 0.75;
    const head1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        personMaterial
    );
    head1.position.y = 1.75;
    person1.add(body1, head1);
    person1.position.set(-2, 0, -3);
    person1.userData.shaking = true;
    familyMembers.push(person1);
    livingRoom.add(person1);

    // Person 2 (right)
    const person2 = person1.clone();
    person2.position.set(2, 0, -3);
    person2.userData.shaking = true;
    familyMembers.push(person2);
    livingRoom.add(person2);

    // Person 3 (center, slightly back)
    const person3 = person1.clone();
    person3.position.set(0, 0, -4);
    person3.scale.set(0.9, 0.9, 0.9);
    person3.userData.shaking = true;
    familyMembers.push(person3);
    livingRoom.add(person3);
}

function createShakingObjects() {
    const objectMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a4a3a,
        roughness: 0.7
    });

    // Table
    const table = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.1, 1),
        objectMaterial
    );
    table.position.set(0, 0.8, 0);
    table.userData.shaking = true;
    table.castShadow = true;
    livingRoom.add(table);

    // Vase on table
    const vase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x8a6a4a })
    );
    vase.position.set(0, 1.1, 0);
    vase.userData.shaking = true;
    vase.userData.shakeIntensity = 0.02;
    livingRoom.add(vase);
}

// ===================================
// CHOICE SYSTEM
// ===================================

function showChoices() {
    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.remove('hidden');

    // Animate buttons
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.animation = 'slideIn 0.5s ease forwards';
        }, index * 200);
    });
}

function choosePath(choice) {
    // Hide choices
    const choiceOverlay = document.getElementById('choice-overlay');
    choiceOverlay.classList.add('hidden');

    // Stop tense audio
    stopSound('ambient-tense');

    // Clear current scene
    clearScene();

    if (choice === 'communicate') {
        createCommunicateScene();
    } else if (choice === 'leave') {
        createLeaveScene();
    }
}

// ===================================
// SCENE 2: COMMUNICATE (WARM FAMILY REUNION)
// ===================================

function createCommunicateScene() {
    currentScene = 'communicate';

    // Show communicate UI
    const communicateUI = document.getElementById('communicate-ui');
    communicateUI.classList.remove('hidden');

    // Warm lighting
    scene.background = new THREE.Color(0xffe4c4);
    scene.fog = new THREE.Fog(0xffd4a3, 10, 30);

    const ambientLight = new THREE.AmbientLight(0xffd4a3, 0.6);
    scene.add(ambientLight);

    // Golden sunlight
    const sunLight = new THREE.DirectionalLight(0xffd89b, 1.8);
    sunLight.position.set(-5, 8, 3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Additional warm lights
    const fillLight = new THREE.PointLight(0xffebcd, 1.0, 20);
    fillLight.position.set(3, 3, 2);
    scene.add(fillLight);

    // Create warm room
    createWarmRoom();

    // Create happy family
    createHappyFamily();

    // Create warm particles
    createFloatingDustParticles();

    // Play warm ambient sound
    playSound('ambient-warm', 0.4, true);

    // Position camera
    camera.position.set(0, 1.6, 5);
    camera.lookAt(0, 1.5, 0);
}

function createWarmRoom() {
    const roomGroup = new THREE.Group();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.9
    });

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        wallMaterial
    );
    backWall.position.set(0, 3, -10);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Window with sunlight
    const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x8b7355 })
    );
    windowFrame.position.set(-4, 3, -9.9);
    roomGroup.add(windowFrame);

    const windowGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(2.8, 2.8),
        new THREE.MeshPhysicalMaterial({
            color: 0xffd89b,
            transparent: true,
            opacity: 0.4,
            transmission: 0.9
        })
    );
    windowGlass.position.set(-4, 3, -9.85);
    roomGroup.add(windowGlass);

    scene.add(roomGroup);
}

function createHappyFamily() {
    const personMaterial = new THREE.MeshStandardMaterial({
        color: 0xffb380,
        roughness: 0.7
    });

    // Create 3 family members
    for (let i = 0; i < 3; i++) {
        const person = new THREE.Group();
        person.name = 'familyMember';
        person.userData.clickable = true;
        person.userData.memberIndex = i;

        // Body
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16),
            personMaterial
        );
        body.position.y = 0.75;
        body.castShadow = true;

        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 16, 16),
            personMaterial
        );
        head.position.y = 1.75;
        head.castShadow = true;

        // Arms (reaching out)
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb380,
            roughness: 0.7
        });
        const leftArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
            armMaterial
        );
        leftArm.position.set(-0.35, 1.2, 0);
        leftArm.rotation.z = Math.PI / 4;

        const rightArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
            armMaterial
        );
        rightArm.position.set(0.35, 1.2, 0);
        rightArm.rotation.z = -Math.PI / 4;

        person.add(body, head, leftArm, rightArm);

        // Position
        const positions = [
            [-1.5, 0, 1],
            [0, 0, 0.5],
            [1.5, 0, 1]
        ];
        person.position.set(...positions[i]);

        warmFamily.push(person);
        scene.add(person);
    }
}

function createFloatingDustParticles() {
    const particleCount = 150;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = Math.random() * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: Math.random() * 0.005,
            z: (Math.random() - 0.5) * 0.01
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd89b,
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData.velocities = velocities;
    scene.add(particles);
}

function createWarmthParticles(x, y) {
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.8
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    // Convert screen coordinates to 3D position
    const vector = new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
        0.5
    );
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    particle.position.copy(pos);
    particle.userData.createdAt = Date.now();
    particle.userData.velocity = {
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.03 + 0.02,
        z: (Math.random() - 0.5) * 0.02
    };

    scene.add(particle);
}

// ===================================
// SCENE 3: LEAVE (DARK FUTURISTIC CITY)
// ===================================

function createLeaveScene() {
    currentScene = 'leave';

    // Show leave UI
    const leaveUI = document.getElementById('leave-ui');
    leaveUI.classList.remove('hidden');

    // Dark atmosphere
    scene.background = new THREE.Color(0x0a0a15);
    scene.fog = new THREE.Fog(0x0a0a15, 10, 80);

    // Minimal ambient light
    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 0.3);
    scene.add(ambientLight);

    // Create city
    createFuturisticCity();

    // Create character
    createCharacter();

    // Create fog effect
    createCityFog();

    // Play city ambient sound
    playSound('ambient-city', 0.3, true);

    // Position camera behind character
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1.6, 0);
}

function createFuturisticCity() {
    const cityGroup = new THREE.Group();

    // Ground - wet pavement
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2a,
        roughness: 0.3,
        metalness: 0.5
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = 'ground';
    ground.userData.clickable = true;
    cityGroup.add(ground);

    // Create skyscrapers
    for (let i = 0; i < 30; i++) {
        const height = Math.random() * 30 + 20;
        const width = Math.random() * 3 + 2;
        const depth = Math.random() * 3 + 2;

        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a1a,
            roughness: 0.7,
            metalness: 0.3
        });

        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

        // Position buildings in a grid around the character
        const angle = (i / 30) * Math.PI * 2;
        const distance = Math.random() * 30 + 15;
        building.position.set(
            Math.cos(angle) * distance,
            height / 2,
            Math.sin(angle) * distance
        );

        building.castShadow = true;
        building.receiveShadow = true;
        cityGroup.add(building);

        // Add neon lights to buildings
        createBuildingLights(building, i);
    }

    scene.add(cityGroup);
}

function createBuildingLights(building, index) {
    const lightCount = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < lightCount; i++) {
        const colors = [0xff006f, 0x00ffff, 0xff00ff, 0x00ff00, 0xffff00];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const lightGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });

        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(
            building.position.x + (Math.random() - 0.5) * building.geometry.parameters.width,
            building.position.y + (Math.random() - 0.5) * building.geometry.parameters.height,
            building.position.z + building.geometry.parameters.depth / 2 + 0.05
        );

        light.name = 'cityLight';
        light.userData.clickable = true;
        light.userData.originalOpacity = 0.8;
        light.userData.flickerSpeed = Math.random() * 2 + 1;

        cityLights.push(light);
        scene.add(light);

        // Add point light for glow
        const pointLight = new THREE.PointLight(color, 0.5, 5);
        pointLight.position.copy(light.position);
        scene.add(pointLight);
    }
}

function createCharacter() {
    characterModel = new THREE.Group();
    characterModel.name = 'character';

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        roughness: 0.8
    });

    // Body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16),
        bodyMaterial
    );
    body.position.y = 0.75;
    body.castShadow = true;

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        bodyMaterial
    );
    head.position.y = 1.75;
    head.castShadow = true;

    // Backpack
    const backpack = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.5, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2a })
    );
    backpack.position.set(0, 1, -0.25);
    backpack.castShadow = true;

    characterModel.add(body, head, backpack);
    characterModel.position.set(0, 0, 0);

    scene.add(characterModel);
}

function createCityFog() {
    const fogParticleCount = 100;
    const fogGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(fogParticleCount * 3);
    const velocities = [];

    for (let i = 0; i < fogParticleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = Math.random() * 3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: 0,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    fogGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const fogMaterial = new THREE.PointsMaterial({
        color: 0x4a4a6a,
        size: 2,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    fog = new THREE.Points(fogGeometry, fogMaterial);
    fog.userData.velocities = velocities;
    scene.add(fog);
}

// ===================================
// INTERACTION HANDLERS
// ===================================

function handleObjectClick(object) {
    if (currentScene === 'communicate') {
        // Check if clicked on family member
        let familyMember = object;
        while (familyMember && familyMember.name !== 'familyMember') {
            familyMember = familyMember.parent;
        }

        if (familyMember && familyMember.name === 'familyMember') {
            showFamilyMessage(familyMember.userData.memberIndex);
            animateFamilyMember(familyMember);
            playSound('piano-chime', 0.5, false);
        }
    } else if (currentScene === 'leave') {
        // Check if clicked on city light
        if (object.name === 'cityLight') {
            flickerLight(object);
        }

        // Check if clicked on ground
        if (object.name === 'ground') {
            moveCharacterForward();
            playSound('footstep', 0.6, false);
        }
    }
}

function showFamilyMessage(index) {
    const messages = [
        "It's okay.",
        "We're here.",
        "Let's talk.",
        "We love you.",
        "Together we're stronger.",
        "Thank you for staying."
    ];

    const message = messages[index % messages.length];
    const messageBubble = document.getElementById('message-bubble');
    messageBubble.textContent = message;
    messageBubble.classList.remove('hidden');

    setTimeout(() => {
        messageBubble.classList.add('hidden');
    }, 2500);
}

function animateFamilyMember(member) {
    const originalY = member.position.y;
    const startTime = Date.now();
    const duration = 500;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            member.position.y = originalY + Math.sin(progress * Math.PI) * 0.2;
            member.rotation.y = Math.sin(progress * Math.PI * 2) * 0.1;
            requestAnimationFrame(animate);
        } else {
            member.position.y = originalY;
            member.rotation.y = 0;
        }
    }

    animate();
}

function flickerLight(light) {
    const originalOpacity = light.material.opacity;
    const startTime = Date.now();
    const duration = 300;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            light.material.opacity = originalOpacity * (0.2 + Math.random() * 0.8);
            requestAnimationFrame(animate);
        } else {
            light.material.opacity = originalOpacity;
        }
    }

    animate();
}

function moveCharacterForward() {
    if (!characterModel) return;

    const startZ = characterModel.position.z;
    const targetZ = startZ - 1;
    const startTime = Date.now();
    const duration = 500;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            characterModel.position.z = startZ + (targetZ - startZ) * progress;

            // Bob animation
            characterModel.position.y = Math.abs(Math.sin(progress * Math.PI * 4)) * 0.1;

            requestAnimationFrame(animate);
        } else {
            characterModel.position.z = targetZ;
            characterModel.position.y = 0;
        }
    }

    animate();
}

// ===================================
// AUDIO SYSTEM
// ===================================

function playSound(soundId, volume = 0.5, loop = false) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.volume = volume;
        sound.loop = loop;
        sound.play().catch(e => console.log(`Sound ${soundId} error:`, e));
    }
}

function stopSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}

// ===================================
// SCENE MANAGEMENT
// ===================================

function clearScene() {
    // Remove all objects except camera
    while (scene.children.length > 0) {
        const object = scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            } else {
                object.material.dispose();
            }
        }
        scene.remove(object);
    }

    // Clear arrays
    familyMembers = [];
    warmFamily = [];
    cityLights = [];
    particles = null;
    fog = null;
}

// ===================================
// ANIMATION LOOP
// ===================================

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    if (currentScene === 'argument') {
        animateArgumentScene(elapsedTime);
    } else if (currentScene === 'communicate') {
        animateCommunicateScene(elapsedTime);
    } else if (currentScene === 'leave') {
        animateLeaveScene(elapsedTime, deltaTime);
    }

    renderer.render(scene, camera);
}

function animateArgumentScene(time) {
    // Flicker overhead light
    if (scene.userData.overheadLight) {
        const light = scene.userData.overheadLight;
        light.intensity = 0.8 + Math.random() * 0.3;
    }

    // Shake family members and objects
    familyMembers.forEach(member => {
        if (member.userData.shaking) {
            member.position.x += (Math.random() - 0.5) * 0.01;
            member.position.z += (Math.random() - 0.5) * 0.01;
            member.rotation.y += (Math.random() - 0.5) * 0.02;
        }
    });

    // Shake all objects marked as shaking
    scene.traverse(obj => {
        if (obj.userData.shaking) {
            const intensity = obj.userData.shakeIntensity || 0.01;
            obj.rotation.z = Math.sin(time * 10) * intensity;
        }
    });
}

function animateCommunicateScene(time) {
    // Animate floating particles
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.userData.velocities;

        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y + Math.sin(time + i) * 0.001;
            positions[i * 3 + 2] += velocities[i].z;

            if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
        }

        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Animate warmth particles created by dragging
    const particlesToRemove = [];
    scene.children.forEach(child => {
        if (child.userData.createdAt) {
            const age = Date.now() - child.userData.createdAt;
            if (age > 2000) {
                particlesToRemove.push(child);
            } else {
                child.position.x += child.userData.velocity.x;
                child.position.y += child.userData.velocity.y;
                child.position.z += child.userData.velocity.z;
                child.material.opacity = 0.8 * (1 - age / 2000);
                child.scale.setScalar(1 + age / 1000);
            }
        }
    });

    particlesToRemove.forEach(particle => {
        scene.remove(particle);
        if (particle.geometry) particle.geometry.dispose();
        if (particle.material) particle.material.dispose();
    });

    // Gentle breathing animation for family
    warmFamily.forEach((member, index) => {
        member.position.y = Math.sin(time * 0.5 + index) * 0.05;
        member.rotation.y = Math.sin(time * 0.3 + index) * 0.1;
    });
}

function animateLeaveScene(time, deltaTime) {
    // Smooth camera rotation based on drag
    cameraRotationY += (targetCameraRotationY - cameraRotationY) * 0.1;
    cameraRotationX += (targetCameraRotationX - cameraRotationX) * 0.1;

    if (characterModel) {
        const radius = 5;
        camera.position.x = characterModel.position.x + Math.sin(cameraRotationY) * radius;
        camera.position.z = characterModel.position.z + Math.cos(cameraRotationY) * radius;
        camera.position.y = 2 + cameraRotationX * 2;
        camera.lookAt(
            characterModel.position.x,
            characterModel.position.y + 1.6,
            characterModel.position.z
        );
    }

    // Flicker city lights
    cityLights.forEach(light => {
        if (light.userData.flickerSpeed) {
            const flicker = Math.sin(time * light.userData.flickerSpeed) * 0.2 + 0.8;
            light.material.opacity = light.userData.originalOpacity * flicker;
        }
    });

    // Animate fog
    if (fog) {
        const positions = fog.geometry.attributes.position.array;
        const velocities = fog.userData.velocities;

        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 2] += velocities[i].z;

            if (positions[i * 3] > 30) positions[i * 3] = -30;
            if (positions[i * 3] < -30) positions[i * 3] = 30;
            if (positions[i * 3 + 2] > 30) positions[i * 3 + 2] = -30;
            if (positions[i * 3 + 2] < -30) positions[i * 3 + 2] = 30;
        }

        fog.geometry.attributes.position.needsUpdate = true;
    }
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🎭 Family Choice - Interactive 3D Narrative 🎭', 'color: #ffd89b; font-size: 20px; font-weight: bold;');
console.log('%cEvery choice creates a different world...', 'color: #ffd89b; font-size: 14px;');
