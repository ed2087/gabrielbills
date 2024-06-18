document.addEventListener('DOMContentLoaded', function() {
    const electricityInput = document.getElementById('electricity');
    const waterInput = document.getElementById('water');
    const internetInput = document.getElementById('internet');
    const gasInput = document.getElementById('gas');
    const trashInput = document.getElementById('trash');

    const brotherShareElement = document.getElementById('brother-share');
    const mainHouseShareElement = document.getElementById('main-house-share');

    const brotherElectricityElement = document.getElementById('brother-electricity');
    const brotherWaterElement = document.getElementById('brother-water');
    const brotherInternetElement = document.getElementById('brother-internet');
    const brotherGasElement = document.getElementById('brother-gas');
    const brotherTrashElement = document.getElementById('brother-trash');

    function calculateAndDisplayShares() {
        const electricityBill = parseFloat(electricityInput.value) || 0;
        const waterBill = parseFloat(waterInput.value) || 0;
        const internetBill = parseFloat(internetInput.value) || 0;
        const gasBill = parseFloat(gasInput.value) || 0;
        const trashBill = parseFloat(trashInput.value) || 0;

        class UtilityBills {
            constructor() {
                this.bills = [];
            }

            addBill(name, amount) {
                this.bills.push({ name, amount });
            }

            calculateTotal() {
                return this.bills.reduce((total, bill) => total + bill.amount, 0);
            }

            calculateFairShare(mainHouseUsage, brotherUsage, bufferPercentage = 10) {
                const totalBill = this.calculateTotal();
                const bufferAmount = totalBill * (bufferPercentage / 100);
                const totalUsage = mainHouseUsage + brotherUsage;
                const brotherProportion = brotherUsage / totalUsage;
                const mainHouseProportion = mainHouseUsage / totalUsage;

                const brotherShare = (totalBill + bufferAmount) * brotherProportion;
                const mainHouseShare = (totalBill + bufferAmount) * mainHouseProportion;

                return { brotherShare, mainHouseShare, brotherProportion };
            }
        }

        const utilityBills = new UtilityBills();

        utilityBills.addBill('Electricity', electricityBill);
        utilityBills.addBill('Water', waterBill);
        utilityBills.addBill('Internet', internetBill);
        utilityBills.addBill('Gas', gasBill);
        utilityBills.addBill('Trash', trashBill);

        const mainHouseUsage = 1.0;  // Assumed proportion for the main house
        const brotherUsage = 0.35;    // Assumed proportion for the brother

        const { brotherShare, mainHouseShare, brotherProportion } = utilityBills.calculateFairShare(mainHouseUsage, brotherUsage);

        brotherShareElement.textContent = `Brother's share: $${brotherShare.toFixed(2)}`;
        mainHouseShareElement.textContent = `Main house share: $${mainHouseShare.toFixed(2)}`;

        // Calculate individual bill shares
        const brotherElectricityShare = electricityBill * brotherProportion;
        const brotherWaterShare = waterBill * brotherProportion;
        const brotherInternetShare = internetBill * brotherProportion;
        const brotherGasShare = gasBill * brotherProportion;
        const brotherTrashShare = trashBill * brotherProportion;

        // Update individual bill shares
        brotherElectricityElement.textContent = `Electricity: $${brotherElectricityShare.toFixed(2)}`;
        brotherWaterElement.textContent = `Water: $${brotherWaterShare.toFixed(2)}`;
        brotherInternetElement.textContent = `Internet: $${brotherInternetShare.toFixed(2)}`;
        brotherGasElement.textContent = `Gas: $${brotherGasShare.toFixed(2)}`;
        brotherTrashElement.textContent = `Trash: $${brotherTrashShare.toFixed(2)}`;
    }

    electricityInput.addEventListener('input', calculateAndDisplayShares);
    waterInput.addEventListener('input', calculateAndDisplayShares);
    internetInput.addEventListener('input', calculateAndDisplayShares);
    gasInput.addEventListener('input', calculateAndDisplayShares);
    trashInput.addEventListener('input', calculateAndDisplayShares);
});
