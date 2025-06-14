
class CarComparison {
    constructor() {
        this.carDatabase = {};
        this.currentCarId = null;
        this.init();
    }

    init() {

        
        this.setupEventListeners();
        
        
        this.setCurrentCar();
    }


    setCurrentCar() {
       
        const urlParams = new URLSearchParams(window.location.search);
        this.currentCarId = urlParams.get('id') || this.getCurrentCarFromPage() || 'bmw-x5-2024';
        
        
        const currentCarOption = document.getElementById('currentCarOption');
        if (currentCarOption && this.carDatabase[this.currentCarId]) {
            currentCarOption.textContent = this.carDatabase[this.currentCarId].name;
        }
        
        
        this.populateCompareDropdown();
    }

    getCurrentCarFromPage() {
       
        const title = document.getElementById('car-title');
        if (title) {
            const titleText = title.textContent.trim();
          
            for (const [id, car] of Object.entries(this.carDatabase)) {
                if (car.name === titleText) {
                    return id;
                }
            }
        }
        return null;
    }
}