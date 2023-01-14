const mongoose = require('mongoose');
const Product = require('./Model/product');
// we can pass the data and validate to another path 
// or a server by just requiring it each time you change
main().catch(err => {
    console.log('Connection Error')
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log('Connection Established');
}

const dataSeeds = [
    {
        Name: 'Egg Pie',
        Price: 100,
        Stock: 'Instock'
    },
    {
        Name: 'Koko Pie',
        Price: 150,
        Stock: 'OutofStock'
    },
    {
        Name: 'Oxdi',
        Price: 120,
        Stock: 'Instock'
    },
]
//my nested data here


Product.insertMany(dataSeeds)
    // execute the data array here to save in mongod or database.
    .then(p => {
        console.log(p);
    })
    .catch(e => {
        console.log(e);
    })
// catch an error or success connection here.


