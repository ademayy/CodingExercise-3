import * as THREE from 'three';

// 1. Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x110508); // Dark burgundy studio background tint

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 2. Lighting with Neon Accents
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff0055, 3, 50); // Neon pink/magenta
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ffff, 3, 50); // Neon cyan
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// 3. Creating Primitives & Glassmorphism Material
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x4a0e17, // Dark burgundy primary tint
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.6, // Frosted glass effect
    thickness: 1.2,
    transparent: true,
    opacity: 0.9
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add orbiting primitive spheres responding to external time/motion data
const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const spheres = [];
for (let i = 0; i < 5; i++) {
    const sphereMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff0055 : 0x00ffff,
        emissive: i % 2 === 0 ? 0x330011 : 0x003333,
        roughness: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMat);
    scene.add(sphere);
    spheres.push({ mesh: sphere, angle: (i / 5) * Math.PI * 2, radius: 2.5 });
}

// 4. Interactivity & Mouse Data Integration
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 200;
    mouseY = (event.clientY - window.innerHeight / 2) / 200;
});

// Window Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 5. Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth damping (lerp) towards mouse coordinates
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    torusKnot.rotation.x = elapsedTime * 0.5 + targetY;
    torusKnot.rotation.y = elapsedTime * 0.3 + targetX;

    // Manipulate orbiting primitive objects based on elapsed time and data loop
    spheres.forEach((item, index) => {
        item.angle += 0.01 + (index * 0.002);
        item.mesh.position.x = Math.cos(item.angle) * item.radius;
        item.mesh.position.z = Math.sin(item.angle) * item.radius;
        item.mesh.position.y = Math.sin(elapsedTime * 2 + index) * 0.5;
    });

    renderer.render(scene, camera);
}

animate();