const server = "http://localhost:3000"

// Graph drawing setup 
const ctx = document.getElementById('sales-chart');

// configure the settings of the chart
const bothRunTypesConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Sales',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }, {
            label: '7-day Moving Average',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Data'
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                display: true,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                display: true,
                title: {
                    display: true,
                    text: 'Sales'
                }
            }
        }
    }
};

const salesChart = new Chart(ctx, bothRunTypesConfig);

// Fetch the sales data and the 7-day moving average from the server
// Fetch the sales data from the server
fetch(`${server}/sales`)
    .then(response => response.json())
    .then(data => {
        bothRunTypesConfig.data.labels = data.map(item => item.date);
        bothRunTypesConfig.data.datasets[0].data = data.map(item => item.sales);
        salesChart.update();
    });

// Fetch the 7-day moving average from the server
fetch(`${server}/average`)
    .then(response => response.json())
    .then(data => {
        bothRunTypesConfig.data.datasets[1].data = [null, null, null, null, null, null, ...data]; // Add 6 null values at the beginning
        salesChart.update();
    });

// Update the 7-day moving average every 5 seconds
setInterval(() => {
    fetch(`${server}/average`)
        .then(response => response.json())
        .then(data => {
            bothRunTypesConfig.data.datasets[1].data = [null, null, null, null, null, null, ...data]; // Add 6 null values at the beginning
            salesChart.update();
        });
}, 5000);

// Form submission handling
document.getElementById('sales-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const sales = document.getElementById('sales').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${server}/sales`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ date: date, sales: sales }));

    xhr.onload = function() {
        if (xhr.status == 200) {
            // Update the chart
            bothRunTypesConfig.data.labels.push(date);
            bothRunTypesConfig.data.datasets[0].data.push(sales);
            salesChart.update();
        } else {
            console.error('Error:', xhr.responseText);
        }
    };
});