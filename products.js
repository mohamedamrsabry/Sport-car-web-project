let lastScrollY = window.scrollY;
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling Down - Hide Navbar
        navbar.classList.add("nav-hidden");
    } else {
        // Scrolling Up - Show Navbar
        navbar.classList.remove("nav-hidden");
    }
    lastScrollY = window.scrollY;
});
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
sidebarToggle.addEventListener('click', () => {
    sidebarOverlay.classList.toggle('open');
});

const sections=document.querySelectorAll('section');
const observer=new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold:0.1
});

sections.forEach(section => {
    observer.observe(section);
}
);
const divs=document.querySelectorAll('div');
const observers=new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold:0.1
});

divs.forEach(div => {
    observers.observe(div);
}
);



const cars = [
  {
    id: 1,
    make: "Mercedes-Benz",
    model: "AMG ONE",
    year: 2025,
    price: "80,000,000 EGP",
    mileage: 12,
    condition: "New",
    image: "img/products/Mercedes-Benz AMG ONE/Mercedes-Benz AMG ONE.jpg",
    exteriorColor: "Silver",
    interiorColor: "Black",
    engine: "1.6L V6 hybrid",
    horsepower: 1063,
    doors: 2
  },
  {
    id: 2,
    make: "Porsche",
    model: "Cayenne GTS",
    year: 2025,
    price: "5,000,000 EGP",
    mileage: 7,
    condition: "New",
    image: "img/products/Porsche Cayenne GTS/Porsche Cayenne GTS.jpg",
    exteriorColor: "White",
    interiorColor: "Black",
    engine: "4.0L V8 twin-turbo",
    horsepower: 453,
    doors: 4
  },
  {
    id: 3,
    make: "BMW",
    model: "M4 Competition (G82)",
    year: 2025,
    price: "4,200,000 EGP",
    mileage: 18,
    condition: "New",
    image: "img/products/BMW M4 Competition (G82)/BMW M4 Competition (G82).jpg",
    exteriorColor: "Portimao Blue",
    interiorColor: "Black",
    engine: "3.0L I6 twin-turbo",
    horsepower: 503,
    doors: 2
  },
  {
    id: 4,
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2025,
    price: "19,000,000 EGP",
    mileage: 5,
    condition: "New",
    image: "img/products/Ferrari SF90 Stradale/Ferrari SF90 Stradale.jpg",
    exteriorColor: "Rosso Corsa",
    interiorColor: "Black",
    engine: "4.0L V8 hybrid",
    horsepower: 986,
    doors: 2
  },
  {
    id: 5,
    make: "Audi",
    model: "RS6 Avant Performance",
    year: 2025,
    price: "4,000,000 EGP",
    mileage: 22,
    condition: "New",
    image: "img/products/Audi RS6 Avant Performance/Audi RS6 Avant Performance.jpg",
    exteriorColor: "Nardo Grey",
    interiorColor: "Black",
    engine: "4.0L V8 twin-turbo",
    horsepower: 621,
    doors: 5
  },
  {
    id: 6,
    make: "McLaren",
    model: "Artura",
    year: 2025,
    price: "7,000,000 EGP",
    mileage: 16,
    condition: "New",
    image: "img/products/McLaren Artura/McLaren Artura.jpg",
    exteriorColor: "McLaren Orange",
    interiorColor: "Black",
    engine: "3.0L V6 hybrid",
    horsepower: 671,
    doors: 2
  },
  {
    id: 7,
    make: "Rolls-Royce",
    model: "Phantom",
    year: 2025,
    price: "17,000,000 EGP",
    mileage: 8,
    condition: "New",
    image: "img/products/Rolls-Royce Phantom/Rolls-Royce Phantom.jpg",
    exteriorColor: "Black",
    interiorColor: "White",
    engine: "6.75L V12",
    horsepower: 563,
    doors: 4
  },
  {
    id: 8,
    make: "Lamborghini",
    model: "Urus Performante",
    year: 2025,
    price: "8,000,000 EGP",
    mileage: 20,
    condition: "New",
    image: "img/products/Lamborghini Urus Performante/Lamborghini Urus Performante.jpg",
    exteriorColor: "Verde Mantis",
    interiorColor: "Black",
    engine: "4.0L V8 twin-turbo",
    horsepower: 657,
    doors: 4
  },
  {
    id: 9,
    make: "Porsche",
    model: "Panamera Turbo S E-Hybrid",
    year: 2025,
    price: "10,000,000 EGP",
    mileage: 11,
    condition: "New",
    image: "img/products/Porsche Panamera Turbo S E-Hybrid/Porsche Panamera Turbo S E-Hybrid.jpg",
    exteriorColor: "Silver",
    interiorColor: "Black",
    engine: "4.0L V8 hybrid",
    horsepower: 690,
    doors: 4
  },
  {
    id: 10,
    make: "Bentley",
    model: "Continental GT Speed",
    year: 2025,
    price: "8,000,000 EGP",
    mileage: 14,
    condition: "New",
    image: "img/products/Bentley Continental GT Speed/Bentley Continental GT Speed.jpg",
    exteriorColor: "Sequin Blue",
    interiorColor: "White",
    engine: "6.0L W12 twin-turbo",
    horsepower: 650,
    doors: 2
  },
  {
    id: 11,
    make: "BMW",
    model: "M5 Competition (F90)",
    year: 2023,
    price: "5,500,000 EGP",
    mileage: 9,
    condition: "New",
    image: "img/products/BMW M5 Competition (F90)/BMW M5 Competition (F90).jpg",
    exteriorColor: "Black Sapphire",
    interiorColor: "Red",
    engine: "4.4L V8 twin-turbo",
    horsepower: 617,
    doors: 4
  },
  {
    id: 12,
    make: "Mercedes-Benz",
    model: "G 63",
    year: 2025,
    price: "7,000,000 EGP",
    mileage: 13,
    condition: "New",
    image: "img/products/Mercedes-Benz G 63/Mercedes-Benz G 63.jpg",
    exteriorColor: "Polar White",
    interiorColor: "Black",
    engine: "4.0L V8 twin-turbo",
    horsepower: 577,
    doors: 4
  },
  {
    id: 13,
    make: "Audi",
    model: "R8 V10 Performance Quattro",
    year: 2025,
    price: "6,000,000 EGP",
    mileage: 17,
    condition: "New",
    image: "img/products/Audi R8 V10 Performance Quattro/Audi R8 V10 Performance Quattro.jpg",
    exteriorColor: "Tango Red",
    interiorColor: "Black",
    engine: "5.2L V10",
    horsepower: 602,
    doors: 2
  },
  {
    id: 14,
    make: "Rolls-Royce",
    model: "Cullinan",
    year: 2025,
    price: "10,000,000 EGP",
    mileage: 6,
    color: "Silver",
    condition: "New",
    image: "img/products/Rolls-Royce Cullinan/Rolls-Royce Cullinan.jpg",
    exteriorColor: "Silver",
    interiorColor: "White",
    engine: "6.75L V12",
    horsepower: 563,
    doors: 4
  },
  {
    id: 15,
    make: "McLaren",
    model: "P1",
    year: 2025,
    price: "35,000,000 EGP",
    mileage: 5,
    condition: "New",
    image: "img/products/McLaren P1/McLaren P1.jpg",
    exteriorColor: "Volcano Orange",
    interiorColor: "Black",
    engine: "3.8L V8 hybrid",
    horsepower: 903,
    doors: 2
  },
  {
    id: 16,
    make: "Porsche",
    model: "911 Turbo S",
    year: 2025,
    price: "8,000,000 EGP",
    mileage: 10,
    condition: "New",
    image: "img/products/Porsche 911 Turbo S/Porsche 911 Turbo S.jpg",
    exteriorColor: "Jet Black",
    interiorColor: "Black",
    engine: "3.8L flat-6 twin-turbo",
    horsepower: 640,
    doors: 2
  },
  {
    id: 17,
    make: "Bentley",
    model: "Flying Spur Speed",
    year: 2025,
    price: "7,000,000 EGP",
    mileage: 12,
    condition: "New",
    image: "img/products/Bentley Flying Spur Speed/Bentley Flying Spur Speed.jpg",
    exteriorColor: "Anthracite",
    interiorColor: "White",
    engine: "6.0L W12 twin-turbo",
    horsepower: 626,
    doors: 4
  },
  {
    id: 18,
    make: "BMW",
    model: "M3 Competition (G80)",
    year: 2025,
    price: "4,000,000 EGP",
    mileage: 15,
    condition: "New",
    image: "img/products/BMW M3 Competition (G80)/BMW M3 Competition (G80).jpg",
    exteriorColor: "Alpine White",
    interiorColor: "Black",
    engine: "3.0L I6 twin-turbo",
    horsepower: 503,
    doors: 4
  },
  {
    id: 19,
    make: "Mercedes-Benz",
    model: "SL 63 S E Performance",
    year: 2025,
    price: "10,000,000 EGP",
    mileage: 9,
    condition: "New",
    image: "img/products/Mercedes-Benz SL 63 S E Performance/Mercedes-Benz SL 63 S E Performance.jpg",
    exteriorColor: "Brilliant Blue",
    interiorColor: "White",
    engine: "4.0L V8 hybrid",
    horsepower: 831,
    doors: 2
  },
  {
    id: 20,
    make: "Ferrari",
    model: "812 Superfast",
    year: 2025,
    price: "10,000,000 EGP",
    mileage: 7,
    condition: "New",
    image: "img/products/Ferrari 812 Superfast/Ferrari 812 Superfast.jpg",
    exteriorColor: "Rosso Corsa",
    interiorColor: "Black",
    engine: "6.5L V12",
    horsepower: 789,
    doors: 2
  },
  {
    id: 21,
    make: "Lamborghini",
    model: "Revuelto",
    year: 2025,
    price: "13,000,000 EGP",
    mileage: 14,
    condition: "New",
    image: "img/products/Lamborghini Revuelto/Lamborghini Revuelto.jpg",
    exteriorColor: "Orange",
    interiorColor: "Orange/Black",
    engine: "6.5L V12 Hybrid",
    horsepower: 1001,
    doors: 2
  },
  {
    id: 22,
    make: "Audi",
    model: "RS7 Sportback Performance",
    year: 2025,
    price: "4,000,000 EGP",
    mileage: 19,
    condition: "New",
    image: "img/products/Audi RS7 Sportback Performance/Audi RS7 Sportback Performance.jpg",
    exteriorColor: "Grey",
    interiorColor: "Black with Carbon Trim",
    engine: "4.0L V8 Twin-Turbo",
    horsepower: 621,
    doors: 4
  },
  {
    id: 23,
    make: "BMW",
    model: "M4 Competition (F82)",
    year: 2018,
    price: "3,500,000 EGP",
    mileage: 20,
    condition: "New",
    image: "img/products/BMW M4 Competition (F82)/BMW M4 Competition (F82).jpg",
    exteriorColor: "Blue",
    interiorColor: "Silverstone Leather",
    engine: "3.0L I6 Twin-Turbo",
    horsepower: 503,
    doors: 2
  },
  {
    id: 24,
    make: "McLaren",
    model: "750S",
    year: 2025,
    price: "9,000,000 EGP",
    mileage: 11,
    condition: "New",
    image: "img/products/McLaren 750S/McLaren 750S.jpg",
    exteriorColor: "White",
    interiorColor: "Black Alcantara",
    engine: "4.0L V8 Twin-Turbo",
    horsepower: 740,
    doors: 2
  },
  {
    id: 25,
    make: "Bentley",
    model: "Bentayga Speed",
    year: 2025,
    price: "7,000,000 EGP",
    mileage: 13,
    condition: "New",
    image: "img/products/Bentley Bentayga Speed/Bentley Bentayga Speed.jpg",
    exteriorColor: "Green",
    interiorColor: "Tan Leather",
    engine: "6.0L W12 Twin-Turbo",
    horsepower: 626,
    doors: 4
  },
  {
    id: 26,
    make: "Ferrari",
    model: "Purosangue",
    year: 2025,
    price: "20,000,000 EGP",
    mileage: 8,
    condition: "New",
    image: "img/products/Ferrari Purosangue/Ferrari Purosangue.jpg",
    exteriorColor: "Yellow",
    interiorColor: "Red/Black Leather",
    engine: "6.5L V12 NA",
    horsepower: 715,
    doors: 4
  },
  {
    id: 27,
    make: "Mercedes-Benz",
    model: "S 680 4MATIC",
    year: 2025,
    price: "9,000,000 EGP",
    mileage: 10,
    condition: "New",
    image: "img/products/Mercedes-Benz S 680 4MATIC/Mercedes-Benz S 680 4MATIC.jpg",
    exteriorColor: "Black",
    interiorColor: "White Nappa Leather",
    engine: "6.0L V12 Biturbo",
    horsepower: 621,
    doors: 4
  },
  {
    id: 28,
    make: "Audi",
    model: "RS Q8",
    year: 2025,
    price: "5,000,000 EGP",
    mileage: 17,
    condition: "New",
    image: "img/products/Audi RS Q8/Audi RS Q8.jpg",
    exteriorColor: "White",
    interiorColor: "Black/Red Stitching",
    engine: "4.0L V8 Twin-Turbo",
    horsepower: 591,
    doors: 4
  },
  {
    id: 29,
    make: "Mercedes-Benz",
    model: "AMG GT 63 S E Performance",
    year: 2025,
    price: "12,000,000 EGP",
    mileage: 14,
    condition: "New",
    image: "img/products/Mercedes-Benz AMG GT 63 S E Performance/Mercedes-Benz AMG GT 63 S E Performance.jpg",
    exteriorColor: "Silver",
    interiorColor: "Red/Black Nappa Leather",
    engine: "4.0L V8 Hybrid",
    horsepower: 831,
    doors: 4
  },
  {
    id: 30,
    make: "Rolls-Royce",
    model: "Ghost",
    year: 2025,
    price: "10,000,000 EGP",
    mileage: 6,
    condition: "New",
    image: "img/products/Rolls-Royce Ghost/Rolls-Royce Ghost.jpg",
    exteriorColor: "Grey",
    interiorColor: "White Leather with Wood Trim",
    engine: "6.75L V12 Twin-Turbo",
    horsepower: 563,
    doors: 4
  }
];
// create one IntersectionObserver at top of file
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);      // animate only once
      }
    });
  },
  { threshold: 0.1 }
);

// observe anything that is already present and should animate
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ----------  renderCars  ---------- */
function renderCars(carList) {
  const container = document.getElementById("carList");
  container.innerHTML = "";
  carList.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card reveal";   // starts hidden
    card.innerHTML = `
        <img src="${car.image}" alt="${car.make} ${car.model}" />
        <h3>${car.year} ${car.make.toUpperCase()} ${car.model.toUpperCase()}</h3>
        <p><strong>${car.price}</strong> (inc.VAT)</p>
        <div class="details">
          <p><strong>Model Year:</strong> ${car.year}</p>
          <p><strong>Mileage (KM):</strong> ${car.mileage}</p>
          <p><strong>Exterior Color:</strong> ${car.exteriorColor}</p>
        </div>
        <button class="btn" onclick="location.href='cars.html?id=${car.id}'">Check Out</button>`;
    container.appendChild(card);

    revealObserver.observe(card);         // now it will animate
  });
}
  function parsePrice(priceStr){
    return Number(priceStr.replace(/[^0-9]/g, ""));
}
  
  function applyFilters() {
    // Existing dropdown values
    const make  = document.getElementById("makeFilter").value;
    const model = document.getElementById("modelFilter").value;
    const year  = document.getElementById("yearFilter").value;

    // NEW: price-range values (default 0 → Infinity)
    const priceFrom = +document.getElementById("priceFrom").value || 0;
    const priceTo   = +document.getElementById("priceTo").value   || Infinity;

    // Apply every active filter
    const filtered = cars.filter(car => {
        const priceNum = parsePrice(car.price);   // helper from Step-3
        return (!make  || car.make  === make)  &&
               (!model || car.model === model) &&
               (!year  || car.year.toString() === year) &&
               priceNum >= priceFrom &&
               priceNum <= priceTo;
    });

    renderCars(filtered);
}

function populateFilters() {
    const makeSelect = document.getElementById("makeFilter");
    const modelSelect = document.getElementById("modelFilter");
    const yearSelect = document.getElementById("yearFilter");

    // Populate the make dropdown
    const makeSet = new Set(cars.map(car => car.make));
    fillOptions(makeSelect, makeSet);

    // Update model and year dropdowns based on selected make
    makeSelect.addEventListener("change", () => {
        const selectedMake = makeSelect.value;

        // Filter models based on selected make
        const filteredModels = cars
            .filter(car => car.make === selectedMake || !selectedMake)
            .map(car => car.model);
        const modelSet = new Set(filteredModels);

        // Populate the model dropdown
        fillOptions(modelSelect, modelSet);

        // Clear and repopulate the year dropdown
        yearSelect.innerHTML = '<option value="">Select Year</option>';
    });

    // Update year dropdown based on selected model
    modelSelect.addEventListener("change", () => {
        const selectedMake = makeSelect.value;
        const selectedModel = modelSelect.value;

        // Filter years based on selected make and model
        const filteredYears = cars
            .filter(car =>
                (car.make === selectedMake || !selectedMake) &&
                (car.model === selectedModel || !selectedModel)
            )
            .map(car => car.year);
        const yearSet = new Set(filteredYears);

        // Populate the year dropdown
        fillOptions(yearSelect, yearSet);
    });
}

function fillOptions(selectElement, options) {
  let placeholder = 'Select Option';
  if (selectElement.id === 'makeFilter') placeholder = 'Select Make';
  else if (selectElement.id === 'modelFilter') placeholder = 'Select Model';
  else if (selectElement.id === 'yearFilter') placeholder = 'Select Year';

  selectElement.innerHTML = `<option value="">${placeholder}</option>`;
  options.forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      selectElement.appendChild(opt);
  });
}


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Initialize page
window.onload = () => {
    populateFilters(); // Populate the dropdowns first

    const makeParam = getQueryParam("make"); // Get the 'make' query parameter
    const makeSelect = document.getElementById("makeFilter");

    if (makeParam) {
        makeSelect.value = makeParam; // Set the make filter to the query parameter value
        makeSelect.dispatchEvent(new Event("change")); // Trigger the change event to update models and years

        // Directly call the applyFilters function instead of relying on a button click
        applyFilters();
    } else {
        // Render all cars if no filter is applied
        renderCars(cars);
    }
};