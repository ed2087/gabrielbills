document.addEventListener('DOMContentLoaded', function () {
    const inputs = {
        electricity: document.getElementById('electricity'),
        water: document.getElementById('water'),
        gas: document.getElementById('gas')
    };

    const output = {
        brotherShare: document.getElementById('brother-share'),
        mainHouseShare: document.getElementById('main-house-share'),
        breakdown: {
            electricity: document.getElementById('brother-electricity'),
            water: document.getElementById('brother-water'),
            gas: document.getElementById('brother-gas')
        }
    };

    class UtilityBills {
        constructor() {
            this.bills = [];
        }

        add(name, amount) {
            this.bills.push({ name, amount });
        }

        total() {
            return this.bills.reduce((sum, bill) => sum + bill.amount, 0);
        }

        calculateShares(percentage = 35) {
            const totalBill = this.total();
            const brotherShare = totalBill * (percentage / 100);
            const mainShare = totalBill - brotherShare;

            return {
                totalBill,
                brotherShare,
                mainShare
            };
        }
    }

    function calculateAndDisplay() {
        const bills = new UtilityBills();

        const values = {
            electricity: parseFloat(inputs.electricity.value) || 0,
            water: parseFloat(inputs.water.value) || 0,
            gas: parseFloat(inputs.gas.value) || 0
        };

        Object.entries(values).forEach(([name, amount]) => bills.add(name, amount));

        const { totalBill, brotherShare, mainShare } = bills.calculateShares(35);

        output.brotherShare.innerHTML = `<strong>Tu parte a pagar:</strong> $${brotherShare.toFixed(2)}`;
        output.mainHouseShare.innerHTML = `<strong>Parte de la casa principal:</strong> $${mainShare.toFixed(2)}`;

        Object.entries(values).forEach(([name, amount]) => {
            const share = amount * 0.35;
            output.breakdown[name].textContent = `${capitalize(name)}: $${share.toFixed(2)}`;
        });
    }

    function capitalize(word) {
        const translations = {
            electricity: 'Electricidad',
            water: 'Agua',
            gas: 'Gas'
        };
        return translations[word] || word;
    }

    function init() {
        Object.values(inputs).forEach(input => input.addEventListener('input', calculateAndDisplay));
        calculateAndDisplay();
    }

    init();
});