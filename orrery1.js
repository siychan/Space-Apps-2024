// Define planetary data (same as before)
const planets = [
  { name: 'Mercury', distance: 39, radius: 3, color: 'gray', period: 88 },
  { name: 'Venus', distance: 72, radius: 6, color: 'yellow', period: 225 },
  { name: 'Earth', distance: 100, radius: 6, color: 'blue', period: 365 },
  { name: 'Mars', distance: 152, radius: 4, color: 'red', period: 687 },
  { name: 'Jupiter', distance: 520, radius: 10, color: 'orange', period: 4333 },
  { name: 'Saturn', distance: 950, radius: 9, color: 'goldenrod', period: 10759 },
  { name: 'Uranus', distance: 1920, radius: 7, color: 'lightblue', period: 30688 },
  { name: 'Neptune', distance: 3000, radius: 7, color: 'darkblue', period: 60182 }
];

// Define cometary data (example comets)
const comets = [
  { name: 'Halley\'s Comet', distance: 3500, radius: 4, color: 'white', period: 27540 },
  { name: 'Hale-Bopp', distance: 3950, radius: 5, color: 'cyan', period: 253321 },
  { name: 'Encke\'s Comet', distance: 200, radius: 2, color: 'gray', period: 1205 },
  { name: 'Swift-Tuttle', distance: 3850, radius: 4, color: 'lightgreen', period: 45460 }
];

const sun = { x: 500, y: 500, radius: 15 };  // Position of the Sun
const scaleDistance = 0.1;  // Scaling factor to fit the solar system within the canvas
const scaleRadius = 1.5;  // Scaling for planet/comet sizes

let currentView = 'planets';  // Toggle state, default is planets

// Function to draw the Sun
function drawSun(ctx) {
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, sun.radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'yellow';
  ctx.fill();
}

// Function to draw celestial bodies (either planets or comets)
function drawCelestialBodies(ctx, bodies) {
  const time = Date.now() / 1000;  // Current time for calculating position

  bodies.forEach(body => {
    const angle = (time / body.period) * 2 * Math.PI;
    const x = sun.x + body.distance * scaleDistance * Math.cos(angle);
    const y = sun.y + body.distance * scaleDistance * Math.sin(angle);

    // Draw the orbit
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, body.distance * scaleDistance, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Draw the body (planet or comet)
    ctx.beginPath();
    ctx.arc(x, y, body.radius * scaleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = body.color;
    ctx.fill();
  });
}

// Function to clear the canvas and draw everything
function draw() {
  const canvas = document.getElementById('orreryCanvas');
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

  drawSun(ctx);  // Draw the Sun

  if (currentView === 'planets') {
    drawCelestialBodies(ctx, planets);
  } else {
    drawCelestialBodies(ctx, comets);
  }

  requestAnimationFrame(draw);  // Animation loop
}

// Event listener for switching views
document.getElementById('toggleView').addEventListener('click', function() {
  if (currentView === 'planets') {
    currentView = 'comets';
    this.textContent = 'Switch to Planets';
  } else {
    currentView = 'planets';
    this.textContent = 'Switch to Comets';
  }
});

// Start the animation loop
draw();
