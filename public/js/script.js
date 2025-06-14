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

let scaleValue = 1;
let opacityValue = 1;
let scrollingEnabled = false;


const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
document.querySelector('.trans-image').appendChild(scrollIndicator);

window.addEventListener('wheel', (event) => {
    if (!scrollingEnabled) {
        event.preventDefault(); 
        
        if (event.deltaY > 0) {
            scaleValue = Math.min(scaleValue + event.deltaY * 0.005, 6);
            opacityValue = Math.max(opacityValue - event.deltaY * 0.002, 0);
        }
        else {
            scaleValue = Math.max(scaleValue + event.deltaY * 0.005, 1);
            opacityValue = Math.min(opacityValue - event.deltaY * 0.002, 1);
        }

        const cover = document.querySelector('.black-cover');
        cover.style.transform = `scale(${scaleValue})`;
        cover.style.opacity = opacityValue;

        
        const textOverlay = document.querySelector('.text-overlay');
        const parallaxY = Math.min(scaleValue * 40, 120);
        const textScale = Math.max(1 - (scaleValue - 1) * 0.15, 0.7); 
        textOverlay.style.transform = `translateY(-${parallaxY}px) scale(${textScale})`;
        textOverlay.style.opacity = opacityValue + 0.2;

        
        scrollIndicator.style.opacity = Math.max(opacityValue * 2 - 0.2, 0);

        if (opacityValue <= 0) {
            scrollingEnabled = true;
            document.body.style.overflowY = 'auto'; 
            cover.style.display = 'none'; 
            scrollIndicator.style.display = 'none';
            textOverlay.style.transform = '';
            textOverlay.style.opacity = '';
        }
    }
}, { passive: false });

document.addEventListener("DOMContentLoaded", () => {
    let counter = document.getElementById("speedCounter");
    let video= document.getElementById("car-image");
    let audio = document.getElementById("engineSound");
    let speed = 0;
    let revving = false;
    let interval = null;
    let text=document.querySelector(".start");

   
    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "w" && !revving) {
            revving = true;
            audio.play();
            video.play();
            text.style.backgroundColor="#0000008f";
            text.textContent="-KEEP HOLDING W-";
            interval = setInterval(() => {
                if (speed < 325) {
                    speed += 0.7;
                    counter.textContent = Math.floor(speed) + " km/h";
                }
            }, 50);
        }
    });

    
    document.addEventListener("keyup", (event) => {
        if (event.key.toLowerCase() === "w") {
            revving = false;
            audio.pause();
            video.pause();
            video.currentTime=0;
            text.style.backgroundColor="#0000003a";
            text.textContent="-PRESS W TO START-";
            audio.currentTime = 0;
            speed = 0; 
            counter.textContent = "0 km/h";
            clearInterval(interval);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.schedule-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Scheduling...';
                submitBtn.disabled = true;
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Visit scheduled successfully! We will contact you shortly to confirm.');
                    form.reset();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('An error occurred. Please try again later.');
                console.error('Error:', error);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

var swiper = new Swiper(".vehicles-slider", {
    allowTouchMove: true,
    simulateTouch: true,
    touchStartPreventDefault: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 1.5, 
    spaceBetween: 20, 
    autoplay: {
      delay: 9500,
      disableOnInteraction: false,
    },
    effect: "coverflow",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false,
      scale: 0.9, 
      opacity: 0.5, 
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "bullets",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    
  });

let cars = []; 

document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('carLoading');
    
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    try {
        const response = await fetch("http://localhost:3000/api/cars");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        cars = await response.json();

        populateBrands();

        const params = new URLSearchParams(location.search);
        const brand = params.get('brand');
        const model = params.get('model');

        if (brand) {
            document.getElementById('brandSelect').value = brand;
            updateModels();

            if (model) {
                setTimeout(() => {
                    document.getElementById('modelSelect').value = model;
                }, 100);
            }
        }
    } catch (error) {
        console.error('Error fetching car data:', error);
        console.log('Error loading car data: ' + error.message);
    } finally {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    createModal();
});


function createModal() {
    const modalHTML = `
        <div id="installmentModal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Installment Calculation Result</h3>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body" id="modalBody">
                    <!-- Result content will be inserted here -->
                </div>
                <div class="modal-footer">
                    <button class="btn close-modal-btn" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .modal-content {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                padding: 20px 20px 0 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #eee;
                margin-bottom: 20px;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.4em;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .close-btn:hover {
                background-color: #f5f5f5;
                color: #333;
            }
            
            .modal-body {
                padding: 0 20px 20px 20px;
            }
            
            .result-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .result-item:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 1.1em;
                color: #2c5aa0;
                margin-top: 10px;
                padding-top: 15px;
                border-top: 2px solidrgb(21, 21, 22);
            }
            
            .result-label {
                font-weight: 500;
                color: #555;
            }
            
            .result-value {
                font-weight: 600;
                color: #333;
            }
            
            .modal-footer {
                padding: 0 20px 20px 20px;
                text-align: center;
            }
            
            .close-modal-btn {
                background-color:rgb(0, 0, 0);
                color: white;
                border: none;
                padding: 10px 30px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.2s ease;
            }
            
            .close-modal-btn:hover {
                background-color:rgb(0, 0, 0);
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
}


function showModal(resultData) {
    const modal = document.getElementById('installmentModal');
    const modalBody = document.getElementById('modalBody');
    
    const resultHTML = `
        <div class="result-item">
            <span class="result-label">Car:</span>
            <span class="result-value">${resultData.brand} ${resultData.model}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Car Price:</span>
            <span class="result-value">EGP ${resultData.carPrice.toLocaleString()}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Down Payment (${resultData.downPaymentPercent}%):</span>
            <span class="result-value">EGP ${resultData.downPaymentAmount.toLocaleString()}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Loan Amount:</span>
            <span class="result-value">EGP ${resultData.loanAmount.toLocaleString()}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Term:</span>
            <span class="result-value">${resultData.termMonths} months</span>
        </div>
        <div class="result-item">
            <span class="result-label">Job Title:</span>
            <span class="result-value">${resultData.jobTitle}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Monthly Installment:</span>
            <span class="result-value">EGP ${resultData.monthlyInstallment.toFixed(2)}</span>
        </div>
    `;
    
    modalBody.innerHTML = resultHTML;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}


function closeModal() {
    const modal = document.getElementById('installmentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}


document.addEventListener('click', (e) => {
    const modal = document.getElementById('installmentModal');
    if (e.target === modal) {
        closeModal();
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});


function populateBrands() {
    const brandSelect = document.getElementById('brandSelect');
    
    if (!brandSelect) return;

    
    const brands = [...new Set(cars.map(car => car.make))].sort();

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}


function updateModels() {
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    
    if (!brandSelect || !modelSelect) return;
    
    const brand = brandSelect.value;

    modelSelect.innerHTML = '<option value="">Choose…</option>';

    if (!brand) return;

    
    const brandModels = cars
        .filter(car => car.make === brand)
        .map(car => car.model);

    
    const uniqueModels = [...new Set(brandModels)].sort();

    
    uniqueModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const brandSelect = document.getElementById('brandSelect');
    if (brandSelect) {
        brandSelect.addEventListener('change', updateModels);
    }
});


function calculateInstallment() {
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    const downPaymentInput = document.getElementById('downPayment');
    const termSelect = document.getElementById('termSelect');
    const jobTitleInput = document.getElementById('jobTitle');

  
    const selectedBrand = brandSelect.value;
    const selectedModel = modelSelect.value;
    const downPaymentPercent = parseFloat(downPaymentInput.value) || 0;
    const termMonths = parseInt(termSelect.value);
    const jobTitle = jobTitleInput.value;

 
    if (!selectedBrand || !selectedModel) {
        alert('Please select both car brand and model');
        return;
    }

    if (!termMonths) {
        alert('Please select the number of months');
        return;
    }

   
    const selectedCar = cars.find(car => 
        car.make === selectedBrand && car.model === selectedModel
    );

    if (!selectedCar) {
        alert('Selected car not found');
        return;
    }

   
    let carPrice = 0;
    
    
    if (selectedCar.price) {
        carPrice = parseFloat(selectedCar.price.toString().replace(/[,EGP]/g, ''));
    } else if (selectedCar.Price) {
        carPrice = parseFloat(selectedCar.Price.toString().replace(/[,EGP]/g, ''));
    } else if (selectedCar.cost) {
        carPrice = parseFloat(selectedCar.cost.toString().replace(/[,EGP]/g, ''));
    } else if (selectedCar.value) {
        carPrice = parseFloat(selectedCar.value.toString().replace(/[,EGP]/g, ''));
    } else {
        
        carPrice = 50000;
        console.log('No price found for selected car, using default price');
        console.log('Available car properties:', Object.keys(selectedCar));
    }

    
    if (isNaN(carPrice) || carPrice <= 0) {
        carPrice = 50000; 
    }

    const downPaymentAmount = (carPrice * downPaymentPercent) / 100;
    const loanAmount = carPrice - downPaymentAmount;
    
    
    const monthlyInstallment = loanAmount / termMonths;

   
    const resultData = {
        brand: selectedBrand,
        model: selectedModel,
        carPrice: carPrice,
        downPaymentPercent: downPaymentPercent,
        downPaymentAmount: downPaymentAmount,
        loanAmount: loanAmount,
        termMonths: termMonths,
        monthlyInstallment: monthlyInstallment,
        jobTitle: jobTitle
    };

    
    showModal(resultData);
    
    

    console.log('Selected Car Object:', selectedCar);
    console.log('Available properties:', Object.keys(selectedCar));
    console.log('Installment Calculation:', resultData);
}


document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateInstallment);
    }
});
