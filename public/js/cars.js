let cars = []; 
let currentCar = null; 

document.addEventListener("DOMContentLoaded", async () => {
  try {
    

    const response = await fetch("http://localhost:3000/cars");
    cars = await response.json();
    
   
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };
    
    const carId = getQueryParam("id");
    const car = cars.find(c => c.id == carId);
    currentCar = car; 

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
      
      // Initialize comparison dropdown after cars are loaded
      populateCompareDropdown();
      
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

// Scroll reveal animation
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

  reveal();
  window.addEventListener('scroll', reveal);
})();

// COMPARISON FUNCTIONS
// ====================

// Populate the compare dropdown with available cars
function populateCompareDropdown() {
  const compareSelect = document.getElementById('compareCar');
  
  if (!compareSelect || !cars.length) return;
  
  // Clear existing options
  compareSelect.innerHTML = '<option value="">Choose a car to compare...</option>';
  
  // Add cars to dropdown (excluding current car)
  cars.forEach(car => {
    if (currentCar && car.id != currentCar.id) {
      const option = document.createElement('option');
      option.value = car.id;
      option.textContent = `${car.year} ${car.make} ${car.model}`;
      compareSelect.appendChild(option);
    }
  });
}

// Open compare modal
function openCompareModal() {
  const modal = document.getElementById('compareModal');
  if (!modal) {
    console.error('Compare modal not found in HTML');
    return;
  }
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Ensure dropdown is populated
  populateCompareDropdown();
  
  // Reset the comparison
  const compareSelect = document.getElementById('compareCar');
  const comparisonResult = document.getElementById('comparisonResult');
  
  if (compareSelect) compareSelect.value = '';
  if (comparisonResult) {
    comparisonResult.innerHTML = `
      <div class="no-comparison">
        Select a car from the dropdown above to start comparing
      </div>
    `;
  }
}

// Close compare modal
function closeCompareModal() {
  const modal = document.getElementById('compareModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Update comparison with slide-up animation
function updateComparison() {
  const selectedCarId = document.getElementById('compareCar').value;
  const comparisonResult = document.getElementById('comparisonResult');
  const loading = document.getElementById('loading');
  
  if (!selectedCarId) {
    comparisonResult.innerHTML = `
      <div class="no-comparison">
        Select a car from the dropdown above to start comparing
      </div>
    `;
    return;
  }

  // Show loading animation
  if (loading) loading.classList.add('show');
  if (comparisonResult) comparisonResult.style.opacity = '0';
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    const selectedCar = cars.find(car => car.id == selectedCarId);
    
    if (selectedCar && currentCar) {
      renderComparison(currentCar, selectedCar);
    }
    
    // Hide loading and show result with animation
    if (loading) loading.classList.remove('show');
    if (comparisonResult) comparisonResult.style.opacity = '1';
    
    // Trigger the slide-up animation
    const container = comparisonResult.querySelector('.comparison-container');
    if (container) {
      setTimeout(() => {
        container.classList.add('show');
      }, 100);
    }
  }, 800);
}

// Render the comparison
function renderComparison(currentCarData, compareCarData) {
  const comparisonResult = document.getElementById('comparisonResult');
  
  // Map your car data structure to display labels
  const getCarDisplayData = (car) => {
    return {
      name: `${car.year} ${car.make} ${car.model}`,
      price: car.price,
      image: car.image || `/partials/img/products/${car.make} ${car.model}/${car.make} ${car.model}.jpg`,
      year: car.year,
      engine: car.engine || 'N/A',
      horsepower: car.horsepower ? `${car.horsepower} hp` : 'N/A',
      mileage: car.mileage ? `${car.mileage} km` : 'N/A',
      condition: car.condition || 'N/A',
      doors: car.doors || 'N/A',
      exteriorColor: car.exteriorColor || 'N/A',
      interiorColor: car.interiorColor || 'N/A'
    };
  };

  const currentDisplay = getCarDisplayData(currentCarData);
  const compareDisplay = getCarDisplayData(compareCarData);

  function createCarCard(carData, isCurrent = false) {
    return `
      <div class="car-card ${isCurrent ? 'current-car' : ''}">
        <div class="car-header">
          <div class="car-name">${carData.name}</div>
          <div class="car-price">${carData.price}</div>
        </div>
        <div class="specs-grid">
          <div class="spec-row">
            <div class="spec-label">Year</div>
            <div class="spec-value">${carData.year}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Engine</div>
            <div class="spec-value">${carData.engine}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Horsepower</div>
            <div class="spec-value">${carData.horsepower}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Mileage</div>
            <div class="spec-value">${carData.mileage}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Condition</div>
            <div class="spec-value">${carData.condition}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Doors</div>
            <div class="spec-value">${carData.doors}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Exterior Color</div>
            <div class="spec-value">${carData.exteriorColor}</div>
          </div>
          <div class="spec-row">
            <div class="spec-label">Interior Color</div>
            <div class="spec-value">${carData.interiorColor}</div>
          </div>
        </div>
      </div>
    `;
  }

  comparisonResult.innerHTML = `
    <div class="comparison-container">
      <div class="comparison-grid">
        ${createCarCard(currentDisplay, true)}
        ${createCarCard(compareDisplay)}
      </div>
    </div>
  `;
}


document.addEventListener('DOMContentLoaded', function() {
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('compareModal');
    if (event.target === modal) {
      closeCompareModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeCompareModal();
    }
  });
});