
class CarComparison {
    constructor() {
        this.carDatabase = {};
        this.currentCarId = null;
        this.init();
    }

    init() {
        
        this.loadCarData();
        
        
        this.setupEventListeners();
        
        
        this.setCurrentCar();
    }

    loadCarData() {
        
        this.carDatabase = {
            'bmw-x5-2024': {
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
                image: '/partials/img/bmw-x5.jpg'
            },
            'mercedes-gle-2024': {
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
            'audi-q7-2024': {
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
           
        };
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