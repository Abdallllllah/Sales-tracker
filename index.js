const express = require('express');
const fs = require('fs');
const hbs = require('handlebars');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.set('views', 'views');
app.set('view engine', 'hbs');




app.use(express.json());


app.use(express.static('public'));

let salesData = require('./salesData.json');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/sales', (req, res) => {
    res.json(salesData);
});

app.post('/sales', (req, res) => {
    const newSale = req.body;
    salesData.push(newSale);
    fs.writeFileSync('./salesData.json', JSON.stringify(salesData));
    res.json(newSale);
});

app.put('/sales/:id', (req, res) => {
    const id = req.params.id;
    const updatedSale = req.body;
    salesData[id] = updatedSale;
    fs.writeFileSync('./salesData.json', JSON.stringify(salesData));
    res.json(updatedSale);
});

app.delete('/sales/:id', (req, res) => {
    const id = req.params.id;
    salesData.splice(id, 1);
    fs.writeFileSync('./salesData.json', JSON.stringify(salesData));
    res.json(salesData);
});

app.get('/average', (req, res) => {
    // Calculate the 7-day moving average
    const averages = [];
    for (let i = 6; i < salesData.length; i++) {
        let sum = 0;
        for (let j = i - 6; j <= i; j++) {
            sum += Number(salesData[j].sales); // Convert sales to number before adding
        }
        averages.push(sum / 7);
    }
    res.json(averages);
});

app.listen(3000, () => console.log('Server running on port 3000'));