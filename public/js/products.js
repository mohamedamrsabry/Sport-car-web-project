

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

let cars = [];

async function fetchCars() {
  try {
    const res = await fetch("http://localhost:3000/cars");
    cars = await res.json();
    populateFilters(); // now populate dropdowns
    const makeParam = getQueryParam("make");
    if (makeParam) {
      document.getElementById("makeFilter").value = makeParam;
      document.getElementById("makeFilter").dispatchEvent(new Event("change"));
      applyFilters();
    } else {
      renderCars(cars);
    }
  } catch (err) {
    console.error("Failed to fetch cars:", err);
  }
}

fetchCars(); // call the function on load


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
