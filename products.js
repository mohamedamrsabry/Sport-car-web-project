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
sidebarToggle.addEventListener('click', () => {
    sidebarOverlay.classList.toggle('open');
});

const cars = [
    {
      make: "Mercedes-Benz",
      model: "AMG ONE",
      year: 2025,
      price: "80,000,000 EGP",
      mileage: 12,
      color: "Red",
      condition: "New",
      image: "mercedes_amg_one.jpg"
    },
    {
      make: "Porsche",
      model: "Cayenne GTS",
      year: 2025,
      price: "5,000,000 EGP",
      mileage: 7,
      color: "White",
      condition: "New",
      image: "porsche_cayenne_gts.jpg"
    },
    {
      make: "BMW",
      model: "M4 Competition (G82)",
      year: 2025,
      price: "4,200,000 EGP",
      mileage: 18,
      color: "Blue",
      condition: "New",
      image: "bmw_m4_g82.jpg"
    },
    {
      make: "Ferrari",
      model: "SF90 Stradale",
      year: 2025,
      price: "19,000,000 EGP",
      mileage: 5,
      color: "Yellow",
      condition: "New",
      image: "ferrari_sf90.jpg"
    },
    {
      make: "Audi",
      model: "RS6 Avant Performance",
      year: 2025,
      price: "4,000,000 EGP",
      mileage: 22,
      color: "Grey",
      condition: "New",
      image: "audi_rs6.jpg"
    },
    {
      make: "McLaren",
      model: "Artura",
      year: 2025,
      price: "7,000,000 EGP",
      mileage: 16,
      color: "Orange",
      condition: "New",
      image: "mclaren_artura.jpg"
    },
    {
      make: "Rolls-Royce",
      model: "Phantom",
      year: 2025,
      price: "17,000,000 EGP",
      mileage: 8,
      color: "Black",
      condition: "New",
      image: "rolls_royce_phantom.jpg"
    },
    {
      make: "Lamborghini",
      model: "Urus Performante",
      year: 2025,
      price: "8,000,000 EGP",
      mileage: 20,
      color: "Green",
      condition: "New",
      image: "lamborghini_urus_performante.jpg"
    },
    {
      make: "Porsche",
      model: "Panamera Turbo S E-Hybrid",
      year: 2025,
      price: "10,000,000 EGP",
      mileage: 11,
      color: "Silver",
      condition: "New",
      image: "porsche_panamera_turbo_s_ehybrid.jpg"
    },
    {
      make: "Bentley",
      model: "Continental GT Speed",
      year: 2025,
      price: "8,000,000 EGP",
      mileage: 14,
      color: "Blue",
      condition: "New",
      image: "bentley_continental_gt_speed.jpg"
    },
    {
      make: "BMW",
      model: "M5 Competition (F90)",
      year: 2025,
      price: "5,500,000 EGP",
      mileage: 9,
      color: "Black",
      condition: "New",
      image: "bmw_m5_f90.jpg"
    },
    {
      make: "Mercedes-Benz",
      model: "G 63",
      year: 2025,
      price: "7,000,000 EGP",
      mileage: 13,
      color: "White",
      condition: "New",
      image: "mercedes_g63.jpg"
    },
    {
      make: "Audi",
      model: "R8 V10 Performance Quattro",
      year: 2025,
      price: "6,000,000 EGP",
      mileage: 17,
      color: "Red",
      condition: "New",
      image: "audi_r8_v10.jpg"
    },
    {
      make: "Rolls-Royce",
      model: "Cullinan",
      year: 2025,
      price: "10,000,000 EGP",
      mileage: 6,
      color: "Silver",
      condition: "New",
      image: "rolls_royce_cullinan.jpg"
    },
    {
      make: "McLaren",
      model: "P1",
      year: 2025,
      price: "35,000,000 EGP",
      mileage: 5,
      color: "Orange",
      condition: "New",
      image: "mclaren_p1.jpg"
    },
    {
      make: "Porsche",
      model: "911 Turbo S",
      year: 2025,
      price: "8,000,000 EGP",
      mileage: 10,
      color: "Black",
      condition: "New",
      image: "porsche_911_turbo_s.jpg"
    },
    {
      make: "Bentley",
      model: "Flying Spur Speed",
      year: 2025,
      price: "7,000,000 EGP",
      mileage: 12,
      color: "Grey",
      condition: "New",
      image: "bentley_flying_spur_speed.jpg"
    },
    {
      make: "BMW",
      model: "M3 Competition (G80)",
      year: 2025,
      price: "4,000,000 EGP",
      mileage: 15,
      color: "White",
      condition: "New",
      image: "bmw_m3_g80.jpg"
    },
    {
      make: "Mercedes-Benz",
      model: "SL 63 S E Performance",
      year: 2025,
      price: "10,000,000 EGP",
      mileage: 9,
      color: "Blue",
      condition: "New",
      image: "mercedes_sl63_s_e.jpg"
    },
    {
      make: "Ferrari",
      model: "812 Superfast",
      year: 2025,
      price: "10,000,000 EGP",
      mileage: 7,
      color: "Red",
      condition: "New",
      image: "ferrari_812_superfast.jpg"
    },
    {
      make: "Lamborghini",
      model: "Revuelto",
      year: 2025,
      price: "13,000,000 EGP",
      mileage: 14,
      color: "Black",
      condition: "New",
      image: "lamborghini_revuelto.jpg"
    },
    {
      make: "Audi",
      model: "RS7 Sportback Performance",
      year: 2025,
      price: "4,000,000 EGP",
      mileage: 19,
      color: "Grey",
      condition: "New",
      image: "audi_rs7.jpg"
    },
    {
      make: "BMW",
      model: "M4 Competition (F82)",
      year: 2025,
      price: "3,500,000 EGP",
      mileage: 20,
      color: "Blue",
      condition: "New",
      image: "bmw_m4_f82.jpg"
    },
    {
      make: "McLaren",
      model: "750S",
      year: 2025,
      price: "9,000,000 EGP",
      mileage: 11,
      color: "White",
      condition: "New",
      image: "mclaren_750s.jpg"
    },
    {
      make: "Bentley",
      model: "Bentayga Speed",
      year: 2025,
      price: "7,000,000 EGP",
      mileage: 13,
      color: "Green",
      condition: "New",
      image: "bentley_bentayga_speed.jpg"
    },
    {
      make: "Ferrari",
      model: "Purosangue",
      year: 2025,
      price: "20,000,000 EGP",
      mileage: 8,
      color: "Yellow",
      condition: "New",
      image: "ferrari_purosangue.jpg"
    },
    {
      make: "Mercedes-Benz",
      model: "S 680 4MATIC",
      year: 2025,
      price: "9,000,000 EGP",
      mileage: 10,
      color: "Black",
      condition: "New",
      image: "maybach_s680.jpg"
    },
    {
      make: "Audi",
      model: "RS Q8",
      year: 2025,
      price: "5,000,000 EGP",
      mileage: 17,
      color: "White",
      condition: "New",
      image: "audi_rs_q8.jpg"
    },
    {
      make: "Mercedes-Benz",
      model: "AMG GT 63 S E Performance",
      year: 2025,
      price: "12,000,000 EGP",
      mileage: 14,
      color: "Silver",
      condition: "New",
      image: "mercedes_gt63_s_e.jpg"
    },
    {
      make: "Rolls-Royce",
      model: "Ghost",
      year: 2025,
      price: "10,000,000 EGP",
      mileage: 6,
      color: "Grey",
      condition: "New",
      image: "rolls_royce_ghost.jpg"
    }
  ];
  
  
  // Dynamically render car cards
  function renderCars(carList) {
    const container = document.getElementById("carList");
    container.innerHTML = ""; // Clear previous entries
    carList.forEach(car => {
      const card = document.createElement("div");
      card.className = "car-card";
      card.innerHTML = `
        <img src="${car.image}" alt="${car.make} ${car.model}" />
        <h3>${car.year} ${car.make.toUpperCase()} ${car.model.toUpperCase()}</h3>
        <p><strong>${car.price}</strong> (inc.VAT)</p>
        <div class="details">
          <p><strong>Model Year:</strong> ${car.year}</p>
          <p><strong>Mileage (KM):</strong> ${car.mileage}</p>
          <p><strong>Exterior Color:</strong> ${car.color}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  function applyFilters() {
    const make = document.getElementById("makeFilter").value;
    const model = document.getElementById("modelFilter").value;
    const year = document.getElementById("yearFilter").value;

    // Update the URL with the selected filters
    const urlParams = new URLSearchParams();
    if (make) urlParams.set("make", make); // Use lowercase "make"
    if (model) urlParams.set("model", model);
    if (year) urlParams.set("year", year);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.pushState(null, "", newUrl);

    // Filter the cars based on the selected filters
    const filtered = cars.filter(car =>
        (!make || car.make === make) &&
        (!model || car.model === model) &&
        (!year || car.year.toString() === year)
    );

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
    selectElement.innerHTML = '<option value="">Select</option>'; // Clear existing options
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