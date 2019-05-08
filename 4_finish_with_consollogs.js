class TravelPaymentStrategyGenerator {
    constructor() {
        this.randomizer = new Randomizer();
        
        this._errorMessage = 'Sorry, the data is invalid.';
        
        this.existingCoins = [1,2,3,4,5,6,7,8,9,10];
        this.numberOfDrivers = 10;
        this.bestStrategyFound = false;
        
        this.drivers = this.randomizer.createArrOfDrivers(this.numberOfDrivers);
    }
    
    generateTravelPaymentStrategy(tenTaxesOnRoad) {
        this.tenTaxesOnRoad = tenTaxesOnRoad;
        
        if (!this._isInputDataValid(tenTaxesOnRoad)) {
            console.log(this._errorMessage);
            
            return {success: false};
        }
        
        while(!this.bestStrategyFound) {
            let nextGeneration = this._removeWorseDriversInGeneration();
            
            this.drivers = this._reproduction(nextGeneration);
            console.log('This generation');
            console.log(this.drivers);
            
            if(this._checkingArrayOnAllSameElements(this.drivers)){
                this._changeAHalfDriversOnRandom();
                console.log('Drivers after mutation');
                console.log(this.drivers);
            }
            
            let probForNewGeneration = this._skipAllDriversOverFitnessFunction();
            console.log('Probabilityes for New Generation');
            console.log(probForNewGeneration);
            
            this.bestStrategyFound = this._lookingForBestDecision(probForNewGeneration);
            console.log('Does we found a best strategy? ' + this.bestStrategyFound);
        }
    
        return this.bestStrategyFound;
    }
    
    _isInputDataValid(tenTaxesOnRoad) {
        if (typeof tenTaxesOnRoad !== 'object') {
            return false;
        }
        
        let isPriceMoreThanTen = tenTaxesOnRoad.find(tax => tax > 10);
        let isCoinsNotNumber = tenTaxesOnRoad.find(tax => typeof tax !== 'number');
        let isTaxesLengthInvalid = tenTaxesOnRoad.length > 10 || tenTaxesOnRoad.length < 10;
        let isSumOfTaxesInvalid = this.randomizer.isSumOfRoadCoinsInvalid(tenTaxesOnRoad);
        let isDataValid = true;
        
        if (isPriceMoreThanTen || isTaxesLengthInvalid || isCoinsNotNumber || isSumOfTaxesInvalid) {
            isDataValid = false;
        }
        
        return isDataValid;
    }
    
    _generateNewDriverWithNulls(parent1, parent2) {
        const newDriverWithNulls = [];
        
        this.tenTaxesOnRoad.forEach((tax, i) => {
            let paymentDifferenceParent1 = tax - parent1[i];
            let paymentDifferenceParent2 = tax - parent2[i];
            let newCoin;
            
            if ((paymentDifferenceParent1 <= paymentDifferenceParent2) && (paymentDifferenceParent1 >= 0)) {
                newCoin = parent1[i];
            } else if(paymentDifferenceParent2 >= 0){
                newCoin = parent2[i];
            } else if (Math.abs(paymentDifferenceParent1) <= Math.abs(paymentDifferenceParent2)) {
                newCoin = parent1[i];
            } else{
                newCoin = parent2[i];
            }
            
            let addedCoin = newDriverWithNulls.find(coin => coin === newCoin);
            
            newDriverWithNulls.push(addedCoin ? 0 : newCoin);
        });
        
        return newDriverWithNulls;
    }
    
    _findNotUsedCoins(newDriverWithNulls) {
        const notUsedCoins = [];
        
        this.existingCoins.forEach((coin) => {
            let foundCoin = newDriverWithNulls.find(function (item) {
                return coin === item;
            });
            
            if (!foundCoin) {
                notUsedCoins.push(coin);
            }
        });
        
        return notUsedCoins;
    }
    
    _getNewDriverFromParents(parent1, parent2) {
        //create  child wich has nulls insted coins
        const newDriverFromParents = this._generateNewDriverWithNulls(parent1,parent2);
        const arrOfNotUsedCoins = this._findNotUsedCoins(newDriverFromParents);
        
        newDriverFromParents.forEach((item, i) => {
            if(item === 0){
                newDriverFromParents[i] = arrOfNotUsedCoins[0];
                arrOfNotUsedCoins.shift();
            }
        });
        
        return newDriverFromParents;
    }
    
    _findBestDutyForDriver(driver) {
        let bestTax = 0;
        let indexArr;
        let indexRoad;
        let driverArr = driver.slice();
        let roadArr = this.tenTaxesOnRoad.slice();
        
        for (let i = 0; i < 10; i++){
            if(Math.max.apply(null, driverArr) - Math.max.apply(null, roadArr) < 0){
                bestTax += (Math.abs(Math.max.apply(null, driverArr) - Math.max.apply(null, roadArr)));
            }
            
            indexArr = driverArr.indexOf(Math.max.apply(null, driverArr));
            indexRoad = roadArr.indexOf(Math.max.apply(null, roadArr));
            
            driverArr.splice(indexArr,1);
            roadArr.splice(indexRoad,1);
        }
        
        return bestTax;
    }
    
    _fitness(driver) {
        let adaptation = this._findBestDutyForDriver(driver, this.tenTaxesOnRoad) / this._dutyPaiedDriverOnRoad(driver) ;
        
        return adaptation;
    }
    
    _dutyPaiedDriverOnRoad(driver) {
        let differenceDuty = 0;
        
        this.tenTaxesOnRoad.forEach((tax, i) => {
            if (tax > driver[i]) {
                differenceDuty += tax - driver[i];
            }else{
                differenceDuty += 0;
            }
        });
        
        return differenceDuty;
    }
    
    _skipAllDriversOverFitnessFunction() {
        let arrayOfSurvivorProbability = [];
        
        this.drivers.forEach((driver) => {
            arrayOfSurvivorProbability.push(this._fitness(driver));
        });
        
        return arrayOfSurvivorProbability;
    }
    
    _removeWorseDriversInGeneration() {
        const probabllytesOfSurviviorOfDrivers = this._skipAllDriversOverFitnessFunction();
        let numberDriversToRemove = 2;
        
        while (numberDriversToRemove){
            let min = Math.min.apply(null, probabllytesOfSurviviorOfDrivers);
            let indexOfMin = probabllytesOfSurviviorOfDrivers.indexOf(min);
            
            probabllytesOfSurviviorOfDrivers.splice(indexOfMin,1);
            this.drivers.splice(indexOfMin,1);
            
            numberDriversToRemove--;
        }
        
        return this.drivers;
    }
    
    _choseParents() {
        const parentPairs = [];
        let leftNumberOfDrivers = this.numberOfDrivers;
        
        while (leftNumberOfDrivers) {
            let pair = {
                a: Math.floor(Math.random() * (this.numberOfDrivers - this.numberOfDrivers / 5) + 0),
                b: Math.floor(Math.random() * (this.numberOfDrivers - this.numberOfDrivers / 5) + 0)
            };
            
            let repeatableEl = parentPairs.find(item => {
                return (item.a === pair.a && item.b === pair.b) ||
                        (item.a === pair.b && item.b === pair.a);
            });
            
            if ((pair.a !== pair.b) && !repeatableEl){
                parentPairs.push(pair);
                leftNumberOfDrivers--;
            }
        }
        
        return parentPairs;
    }
    
    _reproduction(nextGeneration) {
        const parentPairs = this._choseParents();
        const newGenerationOfChildren = [];
        
        parentPairs.forEach(parentPair => {
            let pair = [parentPair.a, parentPair.b];
            
            newGenerationOfChildren.push(this._getNewDriverFromParents(nextGeneration[pair[0]], nextGeneration[pair[1]]));
        });
        
        return newGenerationOfChildren;
    }
    
    _lookingForBestDecision(probForNewGeneration) {
        let result = false;
        
        probForNewGeneration.forEach((item,i)=>{
            if (item === 1){
                result = this.drivers[i];
            }
        });
        
        return result;
    }
    
    _checkingArrayOnAllSameElements () {
        let quantityOfRepeatableDrivers = 0;
        let hasArrayAllSameElements = false;
        
        this.drivers.forEach(driver => {
            if (this.drivers[0].join('') === driver.join('')) {
                quantityOfRepeatableDrivers++;
            }
        });
        
        if (quantityOfRepeatableDrivers === this.numberOfDrivers) {
            hasArrayAllSameElements =  true;
        }
        
        return hasArrayAllSameElements;
    }
    
    _changeAHalfDriversOnRandom() {
        for (let i = 0; i < this.numberOfDrivers / 2; i++ ) {
            this.drivers[i] = this.randomizer.getRandomDriver();
        }
        
        return this;
    }
}

class Randomizer {
    constructor() {
        this.minSumOfCoins = 55;
    }
    
    getRandomRoadWithTenTaxes() {
        let randomRoadWithTenTaxes = this.getRandomTaxes();
        
        while (this.isSumOfRoadCoinsInvalid(randomRoadWithTenTaxes)) {
            randomRoadWithTenTaxes = this.getRandomTaxes()
        }
        
        return randomRoadWithTenTaxes;
    }
    
    isSumOfRoadCoinsInvalid(roadWithTaxes) {
        return this.getSumOfTaxes(roadWithTaxes) < this.minSumOfCoins;
    }
    
    getRandomDriver() {
        const min = 1;
        const max = 10;
        let totalNumbers = max - min + 1;
        let arrayTotalNumbers = [];
        let arrayRandomNumbers 	= [];
        let tempRandomNumber;
        
        while (totalNumbers--) {
            arrayTotalNumbers.push(totalNumbers + min);
        }
        
        while (arrayTotalNumbers.length) {
            tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
            arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
            arrayTotalNumbers.splice(tempRandomNumber, 1);
        }
        
        return arrayRandomNumbers;
    }
    
    createArrOfDrivers(numberOfDrivers) {
        let randomDrivers = [];
        for (let i = 0; i<numberOfDrivers; i++){
            randomDrivers[i] = this.getRandomDriver();
        }
        
        return randomDrivers;
    }
    
    getRandomTaxes() {
        let taxes = [];
        
        for (let i = 0; i < 10; i++) {
            taxes.push(Math.floor(Math.random() * (10) + 1));
        }
        
        return taxes;
    }
    
    getSumOfTaxes(taxes) {
        let sumOfTaxes = 0;
        
        taxes.forEach(function (item) {
            sumOfTaxes += item;
        });
        
        return sumOfTaxes;
    }
}

const randomizer = new Randomizer();
const tenTaxesOnRoad = randomizer.getRandomRoadWithTenTaxes();
const travelPaymentStrategyGenerator = new TravelPaymentStrategyGenerator(tenTaxesOnRoad);

console.log(travelPaymentStrategyGenerator.generateTravelPaymentStrategy(tenTaxesOnRoad));
class TravelPaymentStrategyGenerator {
    constructor() {
        this.randomizer = new Randomizer();
        
        this._errorMessage = 'Sorry, the data is invalid.';
        
        this.existingCoins = [1,2,3,4,5,6,7,8,9,10];
        this.numberOfDrivers = 10;
        this.bestStrategyFound = false;
        
        this.drivers = this.randomizer.createArrOfDrivers(this.numberOfDrivers);
    }
    
    generateTravelPaymentStrategy(tenTaxesOnRoad) {
        this.tenTaxesOnRoad = tenTaxesOnRoad;
        
        if (!this._isInputDataValid(tenTaxesOnRoad)) {
            console.log(this._errorMessage);
            
            return {success: false};
        }
        
        while(!this.bestStrategyFound) {
            let nextGeneration = this._removeWorseDriversInGeneration();
            
            this.drivers = this._reproduction(nextGeneration);
            console.log('This generation');
            console.log(this.drivers);
            
            if(this._checkingArrayOnAllSameElements(this.drivers)){
                this._changeAHalfDriversOnRandom();
                console.log('Drivers after mutation');
                console.log(this.drivers);
            }
            
            let probForNewGeneration = this._skipAllDriversOverFitnessFunction();
            console.log('Probabilityes for New Generation');
            console.log(probForNewGeneration);
            
            this.bestStrategyFound = this._lookingForBestDecision(probForNewGeneration);
            console.log('Does we found a best strategy? ' + this.bestStrategyFound);
        }
    
        return this.bestStrategyFound;
    }
    
    _isInputDataValid(tenTaxesOnRoad) {
        if (typeof tenTaxesOnRoad !== 'object') {
            return false;
        }
        
        let isPriceMoreThanTen = tenTaxesOnRoad.find(tax => tax > 10);
        let isCoinsNotNumber = tenTaxesOnRoad.find(tax => typeof tax !== 'number');
        let isTaxesLengthInvalid = tenTaxesOnRoad.length > 10 || tenTaxesOnRoad.length < 10;
        let isSumOfTaxesInvalid = this.randomizer.isSumOfRoadCoinsInvalid(tenTaxesOnRoad);
        let isDataValid = true;
        
        if (isPriceMoreThanTen || isTaxesLengthInvalid || isCoinsNotNumber || isSumOfTaxesInvalid) {
            isDataValid = false;
        }
        
        return isDataValid;
    }
    
    _generateNewDriverWithNulls(parent1, parent2) {
        const newDriverWithNulls = [];
        
        this.tenTaxesOnRoad.forEach((tax, i) => {
            let paymentDifferenceParent1 = tax - parent1[i];
            let paymentDifferenceParent2 = tax - parent2[i];
            let newCoin;
            
            if ((paymentDifferenceParent1 <= paymentDifferenceParent2) && (paymentDifferenceParent1 >= 0)) {
                newCoin = parent1[i];
            } else if(paymentDifferenceParent2 >= 0){
                newCoin = parent2[i];
            } else if (Math.abs(paymentDifferenceParent1) <= Math.abs(paymentDifferenceParent2)) {
                newCoin = parent1[i];
            } else{
                newCoin = parent2[i];
            }
            
            let addedCoin = newDriverWithNulls.find(coin => coin === newCoin);
            
            newDriverWithNulls.push(addedCoin ? 0 : newCoin);
        });
        
        return newDriverWithNulls;
    }
    
    _findNotUsedCoins(newDriverWithNulls) {
        const notUsedCoins = [];
        
        this.existingCoins.forEach((coin) => {
            let foundCoin = newDriverWithNulls.find(function (item) {
                return coin === item;
            });
            
            if (!foundCoin) {
                notUsedCoins.push(coin);
            }
        });
        
        return notUsedCoins;
    }
    
    _getNewDriverFromParents(parent1, parent2) {
        //create  child wich has nulls insted coins
        const newDriverFromParents = this._generateNewDriverWithNulls(parent1,parent2);
        const arrOfNotUsedCoins = this._findNotUsedCoins(newDriverFromParents);
        
        newDriverFromParents.forEach((item, i) => {
            if(item === 0){
                newDriverFromParents[i] = arrOfNotUsedCoins[0];
                arrOfNotUsedCoins.shift();
            }
        });
        
        return newDriverFromParents;
    }
    
    _findBestDutyForDriver(driver) {
        let bestTax = 0;
        let indexArr;
        let indexRoad;
        let driverArr = driver.slice();
        let roadArr = this.tenTaxesOnRoad.slice();
        
        for (let i = 0; i < 10; i++){
            if(Math.max.apply(null, driverArr) - Math.max.apply(null, roadArr) < 0){
                bestTax += (Math.abs(Math.max.apply(null, driverArr) - Math.max.apply(null, roadArr)));
            }
            
            indexArr = driverArr.indexOf(Math.max.apply(null, driverArr));
            indexRoad = roadArr.indexOf(Math.max.apply(null, roadArr));
            
            driverArr.splice(indexArr,1);
            roadArr.splice(indexRoad,1);
        }
        
        return bestTax;
    }
    
    _fitness(driver) {
        let adaptation = this._findBestDutyForDriver(driver, this.tenTaxesOnRoad) / this._dutyPaiedDriverOnRoad(driver) ;
        
        return adaptation;
    }
    
    _dutyPaiedDriverOnRoad(driver) {
        let differenceDuty = 0;
        
        this.tenTaxesOnRoad.forEach((tax, i) => {
            if (tax > driver[i]) {
                differenceDuty += tax - driver[i];
            }else{
                differenceDuty += 0;
            }
        });
        
        return differenceDuty;
    }
    
    _skipAllDriversOverFitnessFunction() {
        let arrayOfSurvivorProbability = [];
        
        this.drivers.forEach((driver) => {
            arrayOfSurvivorProbability.push(this._fitness(driver));
        });
        
        return arrayOfSurvivorProbability;
    }
    
    _removeWorseDriversInGeneration() {
        const probabllytesOfSurviviorOfDrivers = this._skipAllDriversOverFitnessFunction();
        let numberDriversToRemove = 2;
        
        while (numberDriversToRemove){
            let min = Math.min.apply(null, probabllytesOfSurviviorOfDrivers);
            let indexOfMin = probabllytesOfSurviviorOfDrivers.indexOf(min);
            
            probabllytesOfSurviviorOfDrivers.splice(indexOfMin,1);
            this.drivers.splice(indexOfMin,1);
            
            numberDriversToRemove--;
        }
        
        return this.drivers;
    }
    
    _choseParents() {
        const parentPairs = [];
        let leftNumberOfDrivers = this.numberOfDrivers;
        
        while (leftNumberOfDrivers) {
            let pair = {
                a: Math.floor(Math.random() * (this.numberOfDrivers - this.numberOfDrivers / 5) + 0),
                b: Math.floor(Math.random() * (this.numberOfDrivers - this.numberOfDrivers / 5) + 0)
            };
            
            let repeatableEl = parentPairs.find(item => {
                return (item.a === pair.a && item.b === pair.b) ||
                        (item.a === pair.b && item.b === pair.a);
            });
            
            if ((pair.a !== pair.b) && !repeatableEl){
                parentPairs.push(pair);
                leftNumberOfDrivers--;
            }
        }
        
        return parentPairs;
    }
    
    _reproduction(nextGeneration) {
        const parentPairs = this._choseParents();
        const newGenerationOfChildren = [];
        
        parentPairs.forEach(parentPair => {
            let pair = [parentPair.a, parentPair.b];
            
            newGenerationOfChildren.push(this._getNewDriverFromParents(nextGeneration[pair[0]], nextGeneration[pair[1]]));
        });
        
        return newGenerationOfChildren;
    }
    
    _lookingForBestDecision(probForNewGeneration) {
        let result = false;
        
        probForNewGeneration.forEach((item,i)=>{
            if (item === 1){
                result = this.drivers[i];
            }
        });
        
        return result;
    }
    
    _checkingArrayOnAllSameElements () {
        let quantityOfRepeatableDrivers = 0;
        let hasArrayAllSameElements = false;
        
        this.drivers.forEach(driver => {
            if (this.drivers[0].join('') === driver.join('')) {
                quantityOfRepeatableDrivers++;
            }
        });
        
        if (quantityOfRepeatableDrivers === this.numberOfDrivers) {
            hasArrayAllSameElements =  true;
        }
        
        return hasArrayAllSameElements;
    }
    
    _changeAHalfDriversOnRandom() {
        for (let i = 0; i < this.numberOfDrivers / 2; i++ ) {
            this.drivers[i] = this.randomizer.getRandomDriver();
        }
        
        return this;
    }
}

class Randomizer {
    constructor() {
        this.minSumOfCoins = 55;
    }
    
    getRandomRoadWithTenTaxes() {
        let randomRoadWithTenTaxes = this.getRandomTaxes();
        
        while (this.isSumOfRoadCoinsInvalid(randomRoadWithTenTaxes)) {
            randomRoadWithTenTaxes = this.getRandomTaxes()
        }
        
        return randomRoadWithTenTaxes;
    }
    
    isSumOfRoadCoinsInvalid(roadWithTaxes) {
        return this.getSumOfTaxes(roadWithTaxes) < this.minSumOfCoins;
    }
    
    getRandomDriver() {
        const min = 1;
        const max = 10;
        let totalNumbers = max - min + 1;
        let arrayTotalNumbers = [];
        let arrayRandomNumbers 	= [];
        let tempRandomNumber;
        
        while (totalNumbers--) {
            arrayTotalNumbers.push(totalNumbers + min);
        }
        
        while (arrayTotalNumbers.length) {
            tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
            arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
            arrayTotalNumbers.splice(tempRandomNumber, 1);
        }
        
        return arrayRandomNumbers;
    }
    
    createArrOfDrivers(numberOfDrivers) {
        let randomDrivers = [];
        for (let i = 0; i<numberOfDrivers; i++){
            randomDrivers[i] = this.getRandomDriver();
        }
        
        return randomDrivers;
    }
    
    getRandomTaxes() {
        let taxes = [];
        
        for (let i = 0; i < 10; i++) {
            taxes.push(Math.floor(Math.random() * (10) + 1));
        }
        
        return taxes;
    }
    
    getSumOfTaxes(taxes) {
        let sumOfTaxes = 0;
        
        taxes.forEach(function (item) {
         