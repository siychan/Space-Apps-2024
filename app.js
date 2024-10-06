// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient and directional light
const ambientLight = new THREE.AmbientLight(0x404040, 1);  // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Define planets and comets data
const planets = [
  { name: 'Mercury', a: 2, b: 1.5, radius: 0.1, color: 0xaaaaaa, period: 88 },
  { name: 'Venus', a: 3, b: 2.5, radius: 0.15, color: 0xffcc00, period: 225 },
  { name: 'Earth', a: 4, b: 3, radius: 0.15, color: 0x0000ff, period: 365 },
  { name: 'Mars', a: 5, b: 4, radius: 0.1, color: 0xff0000, period: 687 },
  { name: 'Jupiter', a: 7, b: 5.5, radius: 0.3, color: 0xffa500, period: 4333 },
  { name: 'Saturn', a: 9, b: 6, radius: 0.25, color: 0xcd853f, period: 10759 },
  { name: 'Uranus', a: 11, b: 7, radius: 0.2, color: 0x87cefa, period: 30688 },
  { name: 'Neptune', a: 13, b: 7.5, radius: 0.2, color: 0x00008b, period: 60182 }
];

const comets = [
  { name: 'Halley', a: 18.4, b: 8.7, radius: 0.05, color: 0xffffff, period: 75 },
  { name: 'Encke', a: 2.2, b: 1.8, radius: 0.03, color: 0xcccccc, period: 3.3 },
  { name: 'Hale-Bopp', a: 186, b: 166, radius: 0.05, color: 0xc0c0c0, period: 2533 },
  { name: 'Hyakutake', a: 53, b: 50, radius: 0.03, color: 0xffcc00, period: 17000 },
  { name: 'Tempel 1', a: 3.1, b: 2.9, radius: 0.03, color: 0xffffff, period: 5.5 },
  { name: 'Borrelly', a: 3.5, b: 2.9, radius: 0.03, color: 0xaaaaaa, period: 6.9 },
  { name: 'Wild 2', a: 4.8, b: 4.7, radius: 0.02, color: 0xffffff, period: 6.4 },
  { name: 'Swift-Tuttle', a: 26.1, b: 25.9, radius: 0.05, color: 0xffcc00, period: 133 },
  { name: 'West', a: 20.3, b: 18.1, radius: 0.03, color: 0xaaaaaa, period: 558 },
  { name: 'Lovejoy', a: 100, b: 85, radius: 0.05, color: 0x87cefa, period: 600 }
];

// Store celestial objects in an array
let celestialObjects = [];
let speedMultiplier = 1;
let isShowingPlanets = true;

// Create planet/comet meshes and add to the scene
function createCelestialObjects() {
  celestialObjects.forEach(obj => scene.remove(obj)); // Remove old objects
  celestialObjects = [];

  const selectedObjects = isShowingPlanets ? planets : comets;

  selectedObjects.forEach(obj => {
    const geometry = new THREE.SphereGeometry(obj.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: obj.color });
    const celestialMesh = new THREE.Mesh(geometry, material);
    
    celestialMesh.userData = { ...obj }; // Store original data
    scene.add(celestialMesh);
    celestialObjects.push(celestialMesh);
  });
}

// Calculate the position of celestial objects
function updatePositions() {
  celestialObjects.forEach((obj, index) => {
    const data = obj.userData;
    const time = (Date.now() / 1000) / data.period * speedMultiplier; // Time factor
    const angle = time * 2 * Math.PI;

    const x = Math.cos(angle) * data.a; // Elliptical orbit calculation
    const z = Math.sin(angle) * data.b; // Elliptical orbit calculation
    obj.position.set(x, 0, z); // Set position
  });
}

// Handle input changes for speed and celestial selection
document.getElementById('speedRange').addEventListener('input', function () {
  speedMultiplier = this.value;
});

document.querySelectorAll('input[name="viewType"]').forEach(input => {
  input.addEventListener('change', function () {
    isShowingPlanets = document.getElementById('viewPlanets').checked;
    createCelestialObjects();
  });
});

// Adjust camera position based on the angle slider
document.getElementById('angleRange').addEventListener('input', function () {
  const angle = THREE.MathUtils.degToRad(this.value); // Convert to radians
  camera.position.y = 20 * Math.sin(angle); // Change height based on angle
  camera.position.z = 20 * Math.cos(angle); // Change depth based on angle
  camera.lookAt(0, 0, 0); // Always look at the center
});

// Handle zoom range input
document.getElementById('zoomRange').addEventListener('input', function () {
  camera.position.set(0, 20, this.value); // Change the zoom based on the slider value
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  updatePositions();
  renderer.render(scene, camera);
}

// Initial camera position
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// Create celestial objects initially
createCelestialObjects();
animate(); // Start the animation loop

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
