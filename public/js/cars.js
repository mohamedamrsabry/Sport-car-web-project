let cars = []; // Will store fetched cars

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch cars from backend
    const response = await fetch("http://localhost:3000/cars");
    cars = await response.json();
    
    // Get car ID from URL
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };
    
    const carId = getQueryParam("id");
    const car = cars.find(c => c.id == carId); // Use loose equality for string/number

    if (car) {
      // Set page title and heading
      document.title = `${car.make} ${car.model} – Showroom`;
      document.getElementById("car-title").textContent = `${car.make} ${car.model}`;
      document.getElementById("price").textContent = car.price;

      // Set up enquiry button
      const enquireBtn = document.getElementById("enquire-button");
      enquireBtn.addEventListener("click", () => {
        const url = `quota.html?brand=${encodeURIComponent(car.make)}&model=${encodeURIComponent(car.model)}`;
        location.href = url;
      });

      // Build image paths
      const buildURL = (folder, file) => 
        `/partials/img/products/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

      const folder = `${car.make} ${car.model}`;
      const files = [`${folder}.jpg`, "A.jpg", "B.jpg", "C.jpg"];
      const imgSet = files.map(f => buildURL(folder, f));
      imgSet.push("/partials/img/products/info.jpg");

      // Create image slides
      const slides = document.getElementById("slide-wrapper");
      const thumbs = document.getElementById("thumb-wrapper");
      imgSet.forEach((src, i) => {
        slides.insertAdjacentHTML("beforeend", `<div class="swiper-slide"><img src="${src}" alt="car image ${i + 1}"></div>`);
        thumbs.insertAdjacentHTML("beforeend", `<img src="${src}" data-index="${i}" ${i === 0 ? 'class="active"' : ""}>`);
      });

      // Create specifications grid
      const specPairs = {
        Year: car.year,
        Mileage: `${car.mileage} km`,
        Condition: car.condition,
        Price: car.price,
        Engine: car.engine,
        Horsepower: `${car.horsepower} hp`,
        Doors: car.doors,
        "Exterior Color": car.exteriorColor,
        "Interior Color": car.interiorColor
      };
      
      const grid = document.getElementById("spec-grid");
      Object.entries(specPairs).forEach(([k, v]) => {
        grid.insertAdjacentHTML("beforeend", `<div class="label">${k}</div><div class="value">${v}</div>`);
      });

      // Initialize Swiper
      const swiper = new Swiper(".mainSwiper", {
        loop: true,
        speed: 400,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      });

      // Handle thumbnail clicks
      const thumbImgs = [...document.querySelectorAll(".thumbs img")];
      thumbImgs.forEach(t => t.addEventListener("click", () => 
        swiper.slideToLoop(+t.dataset.index)
      ));

      // Update active thumbnail on slide change
      swiper.on("slideChange", () => {
        const r = swiper.realIndex;
        thumbImgs.forEach(t => 
          t.classList.toggle("active", +t.dataset.index === r)
        );
      });

      // Render similar cars
      renderSimilarCars(cars, car);
    } else {
      document.title = "Car Not Found";
      document.getElementById("car-title").textContent = "Car not found";
    }
  } catch (error) {
    console.error("Error loading car data:", error);
    document.getElementById("car-title").textContent = "Error loading car";
  }
});

function renderSimilarCars(allCars, currentCar) {
  const similar = allCars.filter(c => 
    c.make === currentCar.make && c.id != currentCar.id
  );
  
  const wrap = document.getElementById("similar-wrapper");
  wrap.innerHTML = "";
  
  similar.forEach(c => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="sim-card">
        <img src="${c.image}" alt="${c.make} ${c.model}">
        <div class="info">
          <h3>${c.year} ${c.make.toUpperCase()} ${c.model.toUpperCase()}</h3>
          <div class="price">${c.price}</div>
          <button class="btn" onclick="location.href='cars.html?id=${c.id}'">VIEW DETAILS →</button>
        </div>
      </div>`;
    wrap.appendChild(slide);
  });

  // Initialize Swiper for similar cars
  if (window.simSwiper) window.simSwiper.destroy(true, true);
  window.simSwiper = new Swiper(".similarSwiper", {
    slidesPerView: 1.2,
    spaceBetween: 20,
    navigation: {
      nextEl: ".sim-next",
      prevEl: ".sim-prev"
    },
    breakpoints: {
      600: { slidesPerView: 2.2 },
      900: { slidesPerView: 3 }
    }
  });
}
/* Simple intersection/fade-in.
   Add once, it will work for as many "luxury--card"s as you have. */
(function () {
  const cards = document.querySelectorAll('.luxury--card');

  const reveal = () => {
    cards.forEach(card => {
      const top = card.getBoundingClientRect().top;
      if (top < window.innerHeight - 120) {
        card.classList.add('in-view');
      }
    });
  };

  reveal();                    // run on load
  window.addEventListener('scroll', reveal);
})();
// Add these functions to your existing cars.js file

// Global variable to store all cars data for comparison
let allCarsData = [];
let currentCarData = null;

// Function to load all cars for comparison dropdown
async function loadAllCarsForComparison() {
    try {
        // This would typically be an API call to get all cars
        // For now, using sample data - replace with your actual data source
        const response = await fetch('/api/cars'); // Replace with your API endpoint
        allCarsData = await response.json();
        
        // Populate the compare dropdown
        populateCompareDropdown();
    } catch (error) {
        console.error('Error loading cars data:', error);
        // Fallback sample data
        allCarsData = getSampleCarsData();
        populateCompareDropdown();
    }
}

// Sample data function - replace this with your actual data
function getSampleCarsData() {
    return [
        {
            id: 'bmw-x5',
            name: 'BMW X5 2024',
            brand: 'BMW',
            price: '$75,000',
            engine: '3.0L Turbo I6',
            horsepower: '335 HP',
            transmission: '8-Speed Automatic',
            fuelType: 'Gasoline',
            drivetrain: 'AWD',
            seating: '7 seats',
            fuelEconomy: '21/26 MPG',
            topSpeed: '155 mph',
            acceleration: '5.3 seconds (0-60)',
            image: '/partials/img/bmw-x5.jpg' // Replace with actual image path
        },
        {
            id: 'mercedes-gle',
            name: 'Mercedes GLE 2024',
            brand: 'Mercedes',
            price: '$73,500',
            engine: '2.0L Turbo I4',
            horsepower: '255 HP',
            transmission: '9-Speed Automatic',
            fuelType: 'Gasoline',
            drivetrain: 'AWD',
            seating: '5 seats',
            fuelEconomy: '23/29 MPG',
            topSpeed: '130 mph',
            acceleration: '6.2 seconds (0-60)',
            image: '/partials/img/mercedes-gle.jpg'
        },
        {
            id: 'audi-q7',
            name: 'Audi Q7 2024',
            brand: 'Audi',
            price: '$71,200',
            engine: '3.0L Turbo V6',
            horsepower: '335 HP',
            transmission: '8-Speed Automatic',
            fuelType: 'Gasoline',
            drivetrain: 'AWD',
            seating: '7 seats',
            fuelEconomy: '20/25 MPG',
            topSpeed: '155 mph',
            acceleration: '5.7 seconds (0-60)',
            image: '/partials/img/audi-q7.jpg'
        }
        // Add more cars as needed
    ];
}

// Populate the compare dropdown with available cars
function populateCompareDropdown() {
    const compareSelect = document.getElementById('compareCar');
    const currentCarId = getCurrentCarId(); // You'll need to implement this
    
    // Clear existing options except the first one
    compareSelect.innerHTML = '<option value="">Select a car to compare</option>';
    
    // Add cars to dropdown (excluding current car)
    allCarsData.forEach(car => {
        if (car.id !== currentCarId) {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = car.name;
            compareSelect.appendChild(option);
        }
    });
}

// Get current car ID from URL or page data
function getCurrentCarId() {
    // Extract car ID from URL or page data
    // This is a simple example - adjust based on your URL structure
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'bmw-x5'; // Default fallback
}

// Set current car data
function setCurrentCarData() {
    const currentCarId = getCurrentCarId();
    currentCarData = allCarsData.find(car => car.id === currentCarId);
    
    if (currentCarData) {
        document.getElementById('currentCarOption').textContent = currentCarData.name;
    }
}

// Open compare modal
function openCompareModal() {
    // Load cars data if not already loaded
    if (allCarsData.length === 0) {
        loadAllCarsForComparison();
    }
    
    setCurrentCarData();
    document.getElementById('compareModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close compare modal
function closeCompareModal() {
    document.getElementById('compareModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    
    // Reset the comparison
    document.getElementById('compareCar').value = '';
    document.getElementById('comparisonResult').innerHTML = `
        <div class="no-comparison">
            Select a car from the dropdown above to start comparing
        </div>
    `;
}

// Update comparison
