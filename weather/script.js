const apiKey = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key

// Handle Enter Key Press
function handleKeyPress(event) {
    if (event.key === "Enter") {
        getWeather();
    }
}

// Fetch Weather Data
async function getWeather() {
    const city = document.getElementById('city').value;
    const weatherResult = document.getElementById('weather-result');
    const loading = document.getElementById('loading');

    if (city === "") {
        alert("❗️ Please enter a city name.");
        return;
    }

    weatherResult.innerHTML = "";
    loading.classList.remove('hidden');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.cod === 200) {
            const weatherInfo = `
                <h3>${data.name}, ${data.sys.country}</h3>
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
                <p>🌡️ Temperature: <strong>${data.main.temp}°C</strong></p>
                <p>☁️ Condition: <strong>${data.weather[0].description}</strong></p>
                <p>💨 Wind Speed: <strong>${data.wind.speed} m/s</strong></p>
                <p>💧 Humidity: <strong>${data.main.humidity}%</strong></p>
            `;

            weatherResult.innerHTML = weatherInfo;
        } else {
            weatherResult.innerHTML = `<p class="error">❌ City not found. Please try again!</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        loading.classList.add('hidden');
        weatherResult.innerHTML = `<p class="error">⚠️ Error fetching data. Please check your internet connection.</p>`;
    }
}

// Toggle Dark/Light Mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    const button = document.getElementById('toggleMode');
    if (document.body.classList.contains('dark-mode')) {
        button.innerHTML = '☀️ Light Mode';
    } else {
        button.innerHTML = '🌙 Dark Mode';
    }
}

// Gradient Background Animation
const gradientCanvas = document.getElementById('gradient-bg');
const gradientCtx = gradientCanvas.getContext('2d');
gradientCanvas.width = window.innerWidth;
gradientCanvas.height = window.innerHeight;

let hue = 0;

function drawGradient() {
    const gradient = gradientCtx.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
    gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 100%, 50%)`);

    gradientCtx.fillStyle = gradient;
    gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

    hue += 0.5;
    requestAnimationFrame(drawGradient);
}

// Particle Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numParticles = 100;

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Update particle position
    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Create Particle Array
function initParticles() {
    for (let i = 0; i < numParticles; i++) {
        let size = Math.random() * 5;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#ffffff';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animate Particles
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// Resize Canvas on Window Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gradientCanvas.width = window.innerWidth;
    gradientCanvas.height = window.innerHeight;
    particlesArray.length = 0;
    initParticles();
});

// Initialize and Animate Particles and Gradient
initParticles();
animateParticles();
drawGradient();
