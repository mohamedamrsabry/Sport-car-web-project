const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const mainContainer = document.querySelector('.container');
const modal = document.getElementById('carModal');



const dragDropArea = document.getElementById('dragDropArea');
const imageInput = document.getElementById('imageInput');
const uploadedImages = document.getElementById('uploadedImages');
let selectedImages = [];


let originalDashboardContent = '';


mainContainer.style.display = 'none';


loginBtn.addEventListener('click', async () => {
    if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
    }
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            loginModal.classList.remove('active');
            mainContainer.style.display = 'flex';
            document.body.style.overflow = 'auto';
            fetchCars();
        } else {
            showToast('Invalid credentials', 'error');
        }
    } catch (error) {
        showToast('Login failed', 'error');
    }
});


function setupImageUpload() {
    

    dragDropArea.addEventListener('click', () => {
        imageInput.click();
    });
    
    
    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    
    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.classList.add('drag-over');
    });
    
    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.classList.remove('drag-over');
    });
    
    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 4) {
        showToast('Please select maximum 4 images', 'error');
        return;
    }
    
    selectedImages = imageFiles;
    displayImagePreviews();
}

function displayImagePreviews() {
    uploadedImages.innerHTML = '';
    
    selectedImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagePreview = document.createElement('div');
            imagePreview.className = 'image-preview';
            
            const labels = ['Main', 'A', 'B', 'C'];
            
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button class="remove-image" onclick="removeImage(${index})">&times;</button>
                <div class="image-label">${labels[index] || `Image ${index + 1}`}</div>
            `;
            
            uploadedImages.appendChild(imagePreview);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    displayImagePreviews();
}



modal.addEventListener('click', (e) => {
    if (e.target === modal && !loginModal.classList.contains('active')) {
        closeModal();
    }
});



let currentCarId = null;



const carsTableBody = document.getElementById('carsTableBody');
const carForm = document.getElementById('carForm');
const addCarBtn = document.getElementById('addCarBtn');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancelBtn');
const saveCarBtn = document.getElementById('saveCarBtn');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');
const loadingSpinner = document.getElementById('loadingSpinner');
const totalCarsEl = document.getElementById('totalCars');
const newCarsEl = document.getElementById('newCars');
const brandsCountEl = document.getElementById('brandsCount');


const API_URL = '';
const API_ENDPOINTS = {
    GET_CARS: `/api/cars`,
    CREATE_CAR: `/api/cars`,
    GET_CAR: (id) => `/api/cars/${id}`,
    UPDATE_CAR: (id) => `/api/cars/${id}`,
    DELETE_CAR: (id) => `/api/cars/${id}`,
    UPLOAD_IMAGES: `/api/upload-images`,
    GET_RATINGS: `/api/ratings`,
    DELETE_RATING: (id) => `/api/ratings/${id}`
};


document.addEventListener('DOMContentLoaded', () => {
    

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        originalDashboardContent = mainContent.innerHTML;
    }
    
   
    setupSidebarNavigation();
    
    
    addCarBtn.addEventListener('click', openAddCarModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveCarBtn.addEventListener('click', saveCar);
    
   
    setupImageUpload();
    
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal && !loginModal.classList.contains('active')) {
            closeModal();
        }
    });
});


function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            
            link.classList.add('active');
            
            
            const linkText = link.textContent.trim();
            
            if (linkText.includes('Dashboard')) {
                showDashboard();
            } else if (linkText.includes('Ratings')) {
                fetchRatings();
            } else if (linkText.includes('Logout')) {
                handleLogout();
            }
        });
    });
}



function showDashboard() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = originalDashboardContent;
    
   
    rebindDashboardEvents();
    
   
    fetchCars();
}


function rebindDashboardEvents() {
    const newAddCarBtn = document.getElementById('addCarBtn');
    if (newAddCarBtn) {
        newAddCarBtn.addEventListener('click', openAddCarModal);
    }
}


function handleLogout() {
    mainContainer.style.display = 'none';
    loginModal.classList.add('active');
    loginForm.reset();
    document.body.style.overflow = 'hidden';
}


function fetchRatings() {
    showLoading(true);
    
    fetch(API_ENDPOINTS.GET_RATINGS)
        .then(response => response.json())
        .then(ratings => {
            renderRatings(ratings);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error fetching ratings:', error);
            showToast('Failed to load ratings', 'error');
            showLoading(false);
        });
}


function renderRatings(ratings) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="header">
            <h2>Customer Ratings</h2>
            <div class="user-info">
                <div class="avatar">AD</div>
                <div>
                    <h4>Administrator</h4>
                    <p>Customer Feedback</p>
                </div>
            </div>
        </div>
        
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-icon icon-purple">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                    <h3 id="totalRatings">${ratings.length}</h3>
                    <p>Total Ratings</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon icon-blue">
                    <i class="fas fa-calculator"></i>
                </div>
                <div class="stat-info">
                    <h3 id="avgRating">${calculateAverage(ratings)}</h3>
                    <p>Average Rating</p>
                </div>
            </div>
        </div>
        
        <div class="content-box">
            <div class="table-header">
                <h3>Customer Feedback</h3>
            </div>
            <div class="spinner" id="loadingSpinner" style="display: none;"></div>
            <table id="ratingsTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="ratingsTableBody">
                    ${ratings.map(rating => `
                        <tr>
                            <td>${rating.name}</td>
                            <td>
                                ${'★'.repeat(rating.rating)}${'☆'.repeat(5 - rating.rating)}
                                (${rating.rating}/5)
                            </td>
                            <td>${rating.message || 'No message'}</td>
                            <td>${new Date(rating.createdAt).toLocaleDateString()}</td>
                            <td class="actions">
                                <button class="action-btn delete-btn" onclick="deleteRating('${rating._id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}


function calculateAverage(ratings) {
    if (ratings.length === 0) return '0.0';
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
}


function deleteRating(id) {
    if (confirm('Delete this rating permanently?')) {
        fetch(API_ENDPOINTS.DELETE_RATING(id), {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                showToast('Rating deleted', 'success');
                fetchRatings();
            } else {
                throw new Error('Failed to delete rating');
            }
        })
        .catch(error => {
            showToast(error.message, 'error');
        });
    }
}


function fetchCars() {
    showLoading(true);
    
    fetch(API_ENDPOINTS.GET_CARS)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cars => {
            renderCarsTable(cars);
            updateStats(cars);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error fetching cars:', error);
            showToast('Failed to fetch cars: ' + error.message, 'error');
            showLoading(false);
        });
}


function renderCarsTable(cars) {
    const tableBody = document.getElementById('carsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (cars.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 30px;">
                    <i class="fas fa-car" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <h3>No cars found in inventory</h3>
                    <p>Add your first car using the "Add New Car" button</p>
                </td>
            </tr>
        `;
        return;
    }
    
    cars.forEach((car, index) => {
        const row = document.createElement('tr');
        
        
        const displayId = car.id || (index + 1);
        
        row.innerHTML = `
            <td>${displayId}</td>
            <td><img src="${car.image || 'https://via.placeholder.com/70x45?text=Car+Image'}" alt="${car.make} ${car.model}" class="car-image" onerror="this.src='https://via.placeholder.com/70x45?text=Car+Image'"></td>
            <td>${car.make} ${car.model}</td>
            <td>${car.year}</td>
            <td>${car.price}</td>
            <td>${car.condition}</td>
            <td class="actions">
                <button class="action-btn view-btn" onclick="viewCar('${car._id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit-btn" onclick="editCar('${car._id}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteCar('${car._id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}



function updateStats(cars) {
    const totalCarsElement = document.getElementById('totalCars');
    const newCarsElement = document.getElementById('newCars');
    const brandsCountElement = document.getElementById('brandsCount');
    
    if (totalCarsElement) totalCarsElement.textContent = cars.length;
    
    if (newCarsElement) {
        const newCars = cars.filter(car => car.condition === 'New').length;
        newCarsElement.textContent = newCars;
    }
    
    if (brandsCountElement) {
        const uniqueBrands = new Set(cars.map(car => car.make));
        brandsCountElement.textContent = uniqueBrands.size;
    }
}


function openAddCarModal() {
    currentCarId = null;
    const modalTitleEl = document.getElementById('modalTitle');
    if (modalTitleEl) modalTitleEl.textContent = 'Add New Car';
    carForm.reset();
    selectedImages = [];
    if (uploadedImages) uploadedImages.innerHTML = '';
    openModal();
}



function displayExistingImages(car) {
    if (!car.image || !uploadedImages) return;

    uploadedImages.innerHTML = '';

    const imagePath = car.image;
    const folderPath = imagePath.substring(0, imagePath.lastIndexOf('/'));
    const folderName = `${car.make} ${car.model}`;

    const imageNames = [
        `${folderName}`,
        'A',
        'B', 
        'C'
    ];
    
    imageNames.forEach((name, index) => {
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview existing-image';
        
        const imageSrc = `${folderPath}/${name}${getImageExtension(imagePath)}`;
        const labels = ['Main', 'A', 'B', 'C'];
        
        imagePreview.innerHTML = `
            <img src="${imageSrc}" alt="Existing ${labels[index]}" onerror="this.style.display='none'">
            <div class="image-label">${labels[index]} (Current)</div>
            <div class="existing-indicator">Existing</div>
        `;
        
        uploadedImages.appendChild(imagePreview);
    });

    const messageDiv = document.createElement('div');
    messageDiv.className = 'image-update-message';
    messageDiv.innerHTML = `
        <p><i class="fas fa-info-circle"></i> Current images shown above. Upload new images to replace them (optional).</p>
    `;
    uploadedImages.appendChild(messageDiv);
}

function getImageExtension(imagePath) {
    const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
    for (let ext of extensions) {

        return '.jpg';
    }
    return '.jpg';
}

function editCar(id) {
    showLoading(true);
    
    fetch(API_ENDPOINTS.GET_CAR(id))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(car => {
            currentCarId = id;
            const modalTitleEl = document.getElementById('modalTitle');
            if (modalTitleEl) modalTitleEl.textContent = 'Edit Car';

            document.getElementById('carId').value = car.id || '';
            document.getElementById('make').value = car.make || '';
            document.getElementById('model').value = car.model || '';
            document.getElementById('year').value = car.year || '';
            document.getElementById('price').value = car.price || '';
            document.getElementById('mileage').value = car.mileage || '';
            document.getElementById('condition').value = car.condition || '';
            document.getElementById('exteriorColor').value = car.exteriorColor || '';
            document.getElementById('interiorColor').value = car.interiorColor || '';
            document.getElementById('engine').value = car.engine || '';
            document.getElementById('horsepower').value = car.horsepower || '';
            document.getElementById('doors').value = car.doors || '';

            selectedImages = [];
            displayExistingImages(car);
            
            openModal();
            showLoading(false);
        })
        .catch(error => {
            console.error('Error fetching car:', error);
            showToast('Failed to fetch car details: ' + error.message, 'error');
            showLoading(false);
        });
}



function viewCar(id) {
    showLoading(true);
    
    fetch(API_ENDPOINTS.GET_CAR(id))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(car => {
            showLoading(false);
            alert(`Car Details:\n\nMake: ${car.make}\nModel: ${car.model}\nYear: ${car.year}\nPrice: ${car.price}\nMileage: ${car.mileage} km\nCondition: ${car.condition}\nExterior: ${car.exteriorColor}\nInterior: ${car.interiorColor}\nEngine: ${car.engine}\nHorsepower: ${car.horsepower}\nDoors: ${car.doors}`);
        })
        .catch(error => {
            console.error('Error fetching car:', error);
            showToast('Failed to fetch car details: ' + error.message, 'error');
            showLoading(false);
        });
}



function deleteCar(id) {
    if (confirm('Are you sure you want to delete this car?')) {
        showLoading(true);
        
        fetch(API_ENDPOINTS.DELETE_CAR(id), {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fetchCars();
            showToast('Car deleted successfully!', 'success');
        })
        .catch(error => {
            console.error('Error deleting car:', error);
            showToast('Failed to delete car: ' + error.message, 'error');
            showLoading(false);
        });
    }
}



async function uploadImages(make, model) {
    if (selectedImages.length === 0) {
        throw new Error('No images selected');
    }
    
    if (selectedImages.length !== 4) {
        throw new Error('Please select exactly 4 images');
    }
    
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    
    selectedImages.forEach((file, index) => {
        formData.append('images', file);
    });
    
    const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGES, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload images');
    }
    
    return await response.json();
}


async function saveCar() {
    if (!carForm.checkValidity()) {
        carForm.reportValidity();
        return;
    }

    const carId = document.getElementById('carId').value.trim();
    const make = document.getElementById('make').value.trim();
    const model = document.getElementById('model').value.trim();
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value.trim();
    
    if (!carId || !make || !model || !year || !price) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (!currentCarId && selectedImages.length !== 4) {
        showToast('Please upload exactly 4 images for the car', 'error');
        return;
    }

    if (currentCarId && selectedImages.length > 0 && selectedImages.length !== 4) {
        showToast('If updating images, please upload exactly 4 images', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        let imagePath = '';

        if (selectedImages.length > 0) {
            const uploadResult = await uploadImages(make, model);
            imagePath = uploadResult.mainImagePath;
        }
        
        const carData = {
            id: parseInt(carId),
            make: make,
            model: model,
            year: parseInt(year),
            price: price,
            mileage: parseInt(document.getElementById('mileage').value) || 0,
            condition: document.getElementById('condition').value,
            exteriorColor: document.getElementById('exteriorColor').value.trim(),
            interiorColor: document.getElementById('interiorColor').value.trim(),
            engine: document.getElementById('engine').value.trim(),
            horsepower: parseInt(document.getElementById('horsepower').value) || 0,
            doors: parseInt(document.getElementById('doors').value) || 4
        };

        if (imagePath) {
            carData.image = imagePath;
        }
        
        let response;
        
        if (currentCarId) {

            response = await fetch(API_ENDPOINTS.UPDATE_CAR(currentCarId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
        } else {

            carData.image = imagePath;
            response = await fetch(API_ENDPOINTS.CREATE_CAR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        fetchCars();
        showToast(currentCarId ? 'Car updated successfully!' : 'Car added successfully!', 'success');
        closeModal();
        
    } catch (error) {
        console.error('Error saving car:', error);
        showToast('Failed to save car: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}


function showLoading(isLoading) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = isLoading ? 'block' : 'none';
    }
}


function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedImages = [];
    if (uploadedImages) {
        uploadedImages.innerHTML = '';
    }
}


function showToast(message, type) {
    if (toast) {
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else {
      
        alert(message);
    }
}