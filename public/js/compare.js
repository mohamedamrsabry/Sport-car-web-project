// Car comparison functionality
class CarComparison {
    constructor() {
        this.carDatabase = {};
        this.currentCarId = null;
        this.init();
    }

    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize current car
        this.setCurrentCar();
    }

    setCurrentCar() {
        // Get current car ID from URL, page data, or default
        const urlParams = new URLSearchParams(window.location.search);
        this.currentCarId = urlParams.get('id') || this.getCurrentCarFromPage() || 'bmw-x5-2024';
        
        // Update current car in modal
        const currentCarOption = document.getElementById('currentCarOption');
        if (currentCarOption && this.carDatabase[this.currentCarId]) {
            currentCarOption.textContent = this.carDatabase[this.currentCarId].name;
        }
        
        // Populate compare dropdown
        this.populateCompareDropdown();
    }

    getCurrentCarFromPage() {
        // Try to get car info from page title or other elements
        const title = document.getElementById('car-title');
        if (title) {
            const titleText = title.textContent.trim();
            // Match with database
            for (const [id, car] of Object.entries(this.carDatabase)) {
                if (car.name === titleText) {
                    return id;
                }
            }
        }
        return null;
    }
}