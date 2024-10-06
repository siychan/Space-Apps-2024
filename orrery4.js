// Set up Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 0, 0);  // Light at the sun's position
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);  // Ambient light for better visibility
scene.add(ambientLight);

// Orbit controls (for interaction)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Create the Sun (yellow)
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets (size, distance from sun, color)
const planets = [
    { name: 'Mercury', radius: 0.5, distance: 10, color: 0xaaaaaa, speed: 0.04 },
    { name: 'Venus', radius: 0.9, distance: 15, color: 0xffcc00, speed: 0.03 },
    { name: 'Earth', radius: 1, distance: 20, color: 0x0000ff, speed: 0.02 },
    { name: 'Mars', radius: 0.8, distance: 25, color: 0xff3300, speed: 0.018 },
    { name: 'Jupiter', radius: 2, distance: 35, color: 0xff8800, speed: 0.01 },
    { name: 'Saturn', radius: 1.7, distance: 45, color: 0xffdd99, speed: 0.008 },
    { name: 'Uranus', radius: 1.4, distance: 55, color: 0x00ffff, speed: 0.006 },
    { name: 'Neptune', radius: 1.4, distance: 65, color: 0x0000ff, speed: 0.005 }
];

// Create planets and their orbits
let planetMeshes = [];
let angles = planets.map(() => 0);  // Start angles for each planet's orbit

planets.forEach((planet, index) => {
    // Create planet geometry
    const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: planet.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Position planets along their orbits (initial positions)
    planetMesh.position.x = planet.distance;
    scene.add(planetMesh);
    planetMeshes.push(planetMesh);

    // Draw orbit path (for visualization)
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;  // Align orbit horizontally
    scene.add(orbit);
});

// Set camera position
camera.position.z = 100;

// Adjust for screen resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation loop for rendering and updating planet orbits
function animate() {
    requestAnimationFrame(animate);

    // Update each planet's position in orbit
    planets.forEach((planet, index) => {
        angles[index] += planet.speed;  // Increment orbit angle
        planetMeshes[index].position.x = planet.distance * Math.cos(angles[index]);
        planetMeshes[index].position.z = planet.distance * Math.sin(angles[index]);
        planetMeshes[index].rotation.y += 0.01;  // Rotate planet on its axis
    });

    controls.update();  // Smooth camera movement
    renderer.render(scene, camera);  // Render the scene
}
animate();
