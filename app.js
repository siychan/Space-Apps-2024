const canvas = document.getElementById('orreryCanvas');
const ctx = canvas.getContext('2d');

// Celestial object datasets
const sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 15 };

// Planets dataset
const planets = [
  { name: 'Mercury', a: 39, b: 35, radius: 3, color: 'gray', period: 88 },
  { name: 'Venus', a: 72, b: 70, radius: 6, color: 'yellow', period: 225 },
  { name: 'Earth', a: 100, b: 98, radius: 6, color: 'blue', period: 365 },
  { name: 'Mars', a: 152, b: 149, radius: 4, color: 'red', period: 687 },
  { name: 'Jupiter', a: 520, b: 516, radius: 10, color: 'orange', period: 4333 },
  { name: 'Saturn', a: 950, b: 945, radius: 9, color: 'goldenrod', period: 10759 },
  { name: 'Uranus', a: 1920, b: 1910, radius: 7, color: 'lightblue', period: 30688 },
  { name: 'Neptune', a: 3000, b: 2980, radius: 7, color: 'darkblue', period: 60182 }
];

// Comets dataset
const comets = [
  { name: 'Halley', a: 7600, b: 1900, radius: 4, color: 'white', period: 27450 },
  { name: 'Hale-Bopp', a: 5700, b: 5500, radius: 4, color: 'cyan', period: 2533 },
  { name: 'Encke', a: 229, b: 100, radius: 2, color: 'gray', period: 1204 },
  { name: 'Hyakutake', a: 8000, b: 7200, radius: 3, color: 'lightblue', period: 28300 },
  { name: 'Tempel 1', a: 350, b: 340, radius: 3, color: 'gray', period: 2048 },
  { name: 'Borrelly', a: 331, b: 290, radius: 3, color: 'white', period: 2088 },
  { name: 'Wild 2', a: 415, b: 400, radius: 2, color: 'white', period: 2480 },
  { name: 'Swift-Tuttle', a: 2600, b: 2550, radius: 4, color: 'orange', period: 26500 },
  { name: 'West', a: 4700, b: 4600, radius: 3, color: 'white', period: 40000 },
  { name: 'Lovejoy', a: 8200, b: 7900, radius: 3, color: 'lightgreen', period: 15000 }
];

const scale = 0.1;  // Scale to fit orbits within canvas
let zoom = 1.0;  // Zoom factor
let offsetX = 0, offsetY = 0;  // Pan offsets
let mouseX, mouseY;  // Mouse position for hover interactivity
let speedMultiplier = 1;  // Speed multiplier controlled by slider
let isShowingPlanets = true;  // Toggle between planets and comets

// Draw the Sun
function drawSun() {
  ctx.beginPath();
  ctx.arc(sun.x + offsetX, sun.y + offsetY, sun.radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'yellow';
  ctx.fill();
}

// Draw celestial objects (planets or comets)
function drawObjects(objects) {
  const time = Date.now() / 1000;  // Get current time

  objects.forEach(obj => {
    // Calculate the position of the object in its orbit based on the selected speed
    const angle = (time / obj.period) * 2 * Math.PI * speedMultiplier;
    const x = sun.x + obj.a * scale * zoom * Math.cos(angle) + offsetX;
    const y = sun.y + obj.b * scale * zoom * Math.sin(angle) + offsetY;

    // Draw the elliptical orbit
    ctx.beginPath();
    ctx.ellipse(sun.x + offsetX, sun.y + offsetY, obj.a * scale * zoom, obj.b * scale * zoom, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    // Draw the object (planet or comet)
    ctx.beginPath();
    ctx.arc(x, y, obj.radius * zoom, 0, 2 * Math.PI);
    ctx.fillStyle = obj.color;
    ctx.fill();

    // Show info when the mouse hovers over the object
    if (Math.hypot(mouseX - x, mouseY - y) < obj.radius * zoom) {
      showObjectInfo(obj, x, y);
    }
  });
}

// Show information when hovering over an object
function showObjectInfo(obj, x, y) {
  const infoBox = document.getElementById('infoBox');
  infoBox.style.display = 'block';
  infoBox.style.left = `${x + 10}px`;
  infoBox.style.top = `${y - 30}px`;
  infoBox.innerHTML = `<strong>${obj.name}</strong><br>Orbit: ${obj.a} AU<br>Period: ${obj.period} days`;
}

// Clear canvas and redraw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
  drawSun();  // Draw the Sun

  // Draw planets or comets based on user selection
  if (isShowingPlanets) {
    drawObjects(planets);
  } else {
    drawObjects(comets);
  }

  requestAnimationFrame(draw);  // Keep the animation running
}

// Handle mouse movement for hover interaction
canvas.addEventListener('mousemove', event => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

// Handle zooming with mouse scroll
canvas.addEventListener('wheel', event => {
  event.preventDefault();
  zoom += event.deltaY * -0.001;  // Adjust zoom factor
  zoom = Math.min(Math.max(0.2, zoom), 3);  // Clamp zoom levels
});

// Handle dragging for panning
let isDragging = false;
let dragStartX, dragStartY;
canvas.addEventListener('mousedown', event => {
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
});
canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mousemove', event => {
  if (isDragging) {
    offsetX += event.clientX - dragStartX;
    offsetY += event.clientY - dragStartY;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  }
});

// Update speed multiplier based on slider value
const speedRange = document.getElementById('speedRange');
speedRange.addEventListener('input', () => {
  speedMultiplier = speedRange.value;  // Update speed based on slider input
});

// Toggle between planets and comets
document.getElementById('showPlanets').addEventListener('change', () => {
  isShowingPlanets = true;
});
document.getElementById('showComets').addEventListener('change', () => {
  isShowingPlanets = false;
});

// Start the animation loop
draw();
