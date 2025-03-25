document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = '2fc7a87c1854c435117496be42ed0808';
    const LOCATION = 'Charlotte'; // Change if needed

    const inputs = {
        electricity: document.getElementById('electricity'),
        water: document.getElementById('water'),
        internet: document.getElementById('internet'),
        gas: document.getElementById('gas'),
        trash: document.getElementById('trash')
    };

    const output = {
        brotherShare: document.getElementById('brother-share'),
        mainHouseShare: document.getElementById('main-house-share'),
        breakdown: {
            electricity: document.getElementById('brother-electricity'),
            water: document.getElementById('brother-water'),
            internet: document.getElementById('brother-internet'),
            gas: document.getElementById('brother-gas'),
            trash: document.getElementById('brother-trash')
        },
        summary: document.getElementById('summary-section')
    };

    let averageTemp = 72; // fallback in case API fails

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

        calculateShares(mainUsage, brotherUsage, bufferPercent = 12) {
            const totalBill = this.total();
            const buffer = totalBill * (bufferPercent / 100);
            const adjustedTotal = totalBill + buffer;

            const totalUsage = mainUsage + brotherUsage;
            const brotherProportion = brotherUsage / totalUsage;

            return {
                adjustedTotal,
                brotherProportion,
                brotherShare: adjustedTotal * brotherProportion
            };
        }
    }

    function updateSummary(brotherUsage) {
        let note = "No major adjustment.";
        if (averageTemp > 75) note = "Hot month. AC usage likely higher.";
        else if (averageTemp < 60) note = "Cold month. Heating may increase costs.";

        output.summary.innerHTML = `
            <h3>Usage Summary & Environment</h3>
            <div class="results">
                <div class="result-item"><p><strong>Total Residents:</strong> 7 (2 adults + 4 kids + 1 brother)</p></div>
                <div class="result-item"><p><strong>Brother’s Usage Weight:</strong> ${(brotherUsage * 100).toFixed(1)}%</p></div>
                <div class="result-item"><p><strong>Average Temperature:</strong> ${averageTemp}°F</p></div>
                <div class="result-item"><p><strong>Temp Impact:</strong> ${note}</p></div>
            </div>
        `;
    }

    function calculateAndDisplay() {
        const bills = new UtilityBills();

        const values = {
            electricity: parseFloat(inputs.electricity.value) || 0,
            water: parseFloat(inputs.water.value) || 0,
            internet: parseFloat(inputs.internet.value) || 0,
            gas: parseFloat(inputs.gas.value) || 0,
            trash: parseFloat(inputs.trash.value) || 0
        };

        Object.entries(values).forEach(([name, amount]) => bills.add(name, amount));

        const mainUsage = 1.0;
        const brotherUsage = 0.38;
        const buffer = averageTemp > 75 ? 15 : 12;

        const { adjustedTotal, brotherProportion, brotherShare } = bills.calculateShares(mainUsage, brotherUsage, buffer);
        const originalTotal = bills.total();
        const mainShare = originalTotal - brotherShare;

        output.brotherShare.textContent = `Brother's share: $${brotherShare.toFixed(2)}`;
        output.mainHouseShare.textContent = `Main house share: $${mainShare.toFixed(2)}`;

        Object.entries(values).forEach(([name, amount]) => {
            const share = (amount / originalTotal) * (adjustedTotal * brotherProportion);
            output.breakdown[name].textContent = `${capitalize(name)}: $${share.toFixed(2)}`;
        });

        updateSummary(brotherUsage);
    }

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function fetchWeatherAndInit() {
        const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${LOCATION}&units=f`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.current && data.current.temperature) {
                    averageTemp = data.current.temperature;
                    console.log(`🌡️ Real-time temp: ${averageTemp}°F`);
                } else {
                    console.warn("⚠️ Weather data missing, using default temp.");
                }
                init();
            })
            .catch(err => {
                console.error("❌ Weather fetch failed:", err);
                init(); // still run app even if weather fails
            });
    }

    function init() {
        Object.values(inputs).forEach(input => input.addEventListener('input', calculateAndDisplay));
        calculateAndDisplay();
    }

    fetchWeatherAndInit();
});
