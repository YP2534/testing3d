// =========================================
// 1. THREE.JS SCENE SETUP
// =========================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera Setup (Field of View, Aspect Ratio, Near, Far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Starting position

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true,         // Allows CSS background to show through
    antialias: false     // Turned off for better performance on older hardware
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Limit pixel ratio to save processing power while keeping it looking sharp
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 

// =========================================
// 2. CREATE THE 3D CYBER ENVIRONMENT
// =========================================
// We are using points (particles) instead of heavy 3D models for speed
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800; // Optimized count for smooth frame rates
const posArray = new Float32Array(particlesCount * 3); // X, Y, Z for each particle

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread the particles out randomly across a wide 3D space
    posArray[i] = (Math.random() - 0.5) * 40; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material: How the particles look
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x00e5ff, // Cyber neon blue
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending // Makes overlapping particles glow brighter
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// =========================================
// 3. THE ANIMATION LOOP
// =========================================
function animate() {
    requestAnimationFrame(animate);
    
    // Constant slow rotation to give the scene life even when not scrolling
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    renderer.render(scene, camera);
}
// Start the loop
animate();

// =========================================
// 4. GSAP SCROLL MAGIC
// =========================================
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation 1: Move the camera forward through space as you scroll
gsap.to(camera.position, {
    z: -15, // How far deep into the Z-axis we travel
    ease: "none", // Linear movement looks best for scrolling
    scrollTrigger: {
        trigger: ".content-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // Ties the animation smoothly to the scrollbar
    }
});

// Animation 2: Twist the particle galaxy as you scroll down
gsap.to(particlesMesh.rotation, {
    x: 1.5,
    y: 1.5,
    ease: "none",
    scrollTrigger: {
        trigger: ".content-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

// =========================================
// 5. RESPONSIVE RESIZING
// =========================================
// Ensures the 3D canvas scales correctly if the user resizes their window
window.addEventListener('resize', () => {
    // Update Camera Aspect Ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
});
