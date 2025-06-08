
        const ADMIN_CREDENTIALS = {
            username: "admin",
            password: "admin123"
        };

        // DOM Elements for login
        const loginModal = document.getElementById('loginModal');
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const mainContainer = document.querySelector('.container');
        const modal = document.getElementById('carModal');
        // Initially hide the main content
        mainContainer.style.display = 'none';

        // Login functionality
        loginBtn.addEventListener('click', () => {
            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
                return;
            }
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // Successful login
                loginModal.classList.remove('active');
                mainContainer.style.display = 'flex';
                document.body.style.overflow = 'auto';
                fetchCars();
            } else {
                showToast('Invalid credentials', 'error');
            }
        });
        

        // Close modal when clicking outside (but prevent closing for login modal)
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !loginModal.classList.contains('active')) {
                closeModal();
            }
        });
        // Current car being edited
        let currentCarId = null;
        
        // DOM Elements
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

        // API Configuration
        const API_URL = 'http://localhost:3000'; // Your backend URL
        const API_ENDPOINTS = {
            GET_CARS: `${API_URL}/cars`,
            CREATE_CAR: `${API_URL}/cars`,
            GET_CAR: (id) => `${API_URL}/cars/${id}`,
            UPDATE_CAR: (id) => `${API_URL}/cars/${id}`,
            DELETE_CAR: (id) => `${API_URL}/cars/${id}`
        };

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            
            // Event listeners
            addCarBtn.addEventListener('click', openAddCarModal);
            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);
            saveCarBtn.addEventListener('click', saveCar);
            
           // Close modal when clicking outside (but prevent closing for login modal)
            modal.addEventListener('click', (e) => {
                if (e.target === modal && !loginModal.classList.contains('active')) {
                    closeModal();
                }
            });
        });

        // Fetch cars from backend
        function fetchCars() {
            showLoading(true);
            
            fetch(API_ENDPOINTS.GET_CARS)
                .then(response => response.json())
                .then(cars => {
                    renderCarsTable(cars);
                    updateStats(cars);
                    showLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching cars:', error);
                    showToast('Failed to fetch cars', 'error');
                    showLoading(false);
                });
        }

        // Render cars table
        function renderCarsTable(cars) {
            carsTableBody.innerHTML = '';
            
            if (cars.length === 0) {
                carsTableBody.innerHTML = `
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
            
            cars.forEach(car => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${car.id}</td>
                    <td><img src="${car.image}" alt="${car.make} ${car.model}" class="car-image" onerror="this.src='https://via.placeholder.com/70x45?text=Car+Image'"></td>
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
                
                carsTableBody.appendChild(row);
            });
        }

        // Update stats
        function updateStats(cars) {
            totalCarsEl.textContent = cars.length;
            
            const newCars = cars.filter(car => car.condition === 'New').length;
            newCarsEl.textContent = newCars;
            
            const uniqueBrands = new Set(cars.map(car => car.make));
            brandsCountEl.textContent = uniqueBrands.size;
        }

        // Open modal for adding a car
        function openAddCarModal() {
            currentCarId = null;
            modalTitle.textContent = 'Add New Car';
            carForm.reset();
            openModal();
        }

        // Open modal for editing a car
        function editCar(id) {
            showLoading(true);
            
            fetch(API_ENDPOINTS.GET_CAR(id))
                .then(response => response.json())
                .then(car => {
                    currentCarId = id;
                    modalTitle.textContent = 'Edit Car';
                    
                    // Populate form
                    document.getElementById('make').value = car.make;
                    document.getElementById('model').value = car.model;
                    document.getElementById('year').value = car.year;
                    document.getElementById('price').value = car.price;
                    document.getElementById('mileage').value = car.mileage;
                    document.getElementById('condition').value = car.condition;
                    document.getElementById('exteriorColor').value = car.exteriorColor;
                    document.getElementById('interiorColor').value = car.interiorColor;
                    document.getElementById('engine').value = car.engine;
                    document.getElementById('horsepower').value = car.horsepower;
                    document.getElementById('doors').value = car.doors;
                    document.getElementById('image').value = car.image;
                    
                    openModal();
                    showLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching car:', error);
                    showToast('Failed to fetch car details', 'error');
                    showLoading(false);
                });
        }

        // View car details
        function viewCar(id) {
            showLoading(true);
            
            fetch(API_ENDPOINTS.GET_CAR(id))
                .then(response => response.json())
                .then(car => {
                    showLoading(false);
                    alert(`Car Details:\n\nMake: ${car.make}\nModel: ${car.model}\nYear: ${car.year}\nPrice: ${car.price}\nMileage: ${car.mileage} km\nCondition: ${car.condition}\nExterior: ${car.exteriorColor}\nInterior: ${car.interiorColor}\nEngine: ${car.engine}\nHorsepower: ${car.horsepower}\nDoors: ${car.doors}`);
                })
                .catch(error => {
                    console.error('Error fetching car:', error);
                    showToast('Failed to fetch car details', 'error');
                    showLoading(false);
                });
        }

        // Delete car
        function deleteCar(id) {
            if (confirm('Are you sure you want to delete this car?')) {
                showLoading(true);
                
                fetch(API_ENDPOINTS.DELETE_CAR(id), {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        fetchCars();
                        showToast('Car deleted successfully!', 'success');
                    } else {
                        throw new Error('Failed to delete car');
                    }
                })
                .catch(error => {
                    console.error('Error deleting car:', error);
                    showToast('Failed to delete car', 'error');
                    showLoading(false);
                });
            }
        }

        // Save car (add or update)
        function saveCar() {
            if (!carForm.checkValidity()) {
                carForm.reportValidity();
                return;
            }
            
            const carData = {
                make: document.getElementById('make').value,
                model: document.getElementById('model').value,
                year: parseInt(document.getElementById('year').value),
                price: document.getElementById('price').value,
                mileage: parseInt(document.getElementById('mileage').value),
                condition: document.getElementById('condition').value,
                exteriorColor: document.getElementById('exteriorColor').value,
                interiorColor: document.getElementById('interiorColor').value,
                engine: document.getElementById('engine').value,
                horsepower: parseInt(document.getElementById('horsepower').value),
                doors: parseInt(document.getElementById('doors').value),
                image: document.getElementById('image').value
            };
            
            showLoading(true);
            
            if (currentCarId) {
                // Update existing car
                fetch(API_ENDPOINTS.UPDATE_CAR(currentCarId), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(carData)
                })
                .then(response => {
                    if (response.ok) {
                        fetchCars();
                        showToast('Car updated successfully!', 'success');
                        closeModal();
                    } else {
                        throw new Error('Failed to update car');
                    }
                })
                .catch(error => {
                    console.error('Error updating car:', error);
                    showToast('Failed to update car', 'error');
                })
                .finally(() => {
                    showLoading(false);
                });
            } else {
                // Add new car
                fetch(API_ENDPOINTS.CREATE_CAR, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(carData)
                })
                .then(response => {
                    if (response.ok) {
                        fetchCars();
                        showToast('Car added successfully!', 'success');
                        closeModal();
                    } else {
                        throw new Error('Failed to add car');
                    }
                })
                .catch(error => {
                    console.error('Error adding car:', error);
                    showToast('Failed to add car', 'error');
                })
                .finally(() => {
                    showLoading(false);
                });
            }
        }

        // Show/hide loading spinner
        function showLoading(isLoading) {
            loadingSpinner.style.display = isLoading ? 'block' : 'none';
        }

        // Open modal
        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Show toast notification
        function showToast(message, type) {
            toast.textContent = message;
            toast.className = `toast toast-${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            mainContainer.style.display = 'none';
            loginModal.classList.add('active');
            loginForm.reset();
        });
    