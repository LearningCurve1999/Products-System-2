const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Product = require('./Model/product')
const Farm = require('./Model/farm')
const methodOverride = require('method-override')
const AppError = require('./AppError');






//Middleware section
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// app.set('Model',path.join(__dirname, 'Model'));
// app.set('Data',path.join(__dirname, 'Data'));


main().catch(err => {
    console.log('Connection Error')
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log('Connection Established');
}
//FARM ROUTES

app.get('/farms', async (req, res, next) => {
    try {
        const farms = await Farm.find({})
        res.render('farms/index', { farms })
    } catch (e) {
        next(e);
    }

})

app.get('/farms/new', (req, res, next) => {
    try { // if anything goes wrong or some value are missing that needs 
        //to have in there, we return an error from custom error callback we create. 
        //there so much possible scenario can happen in this node if the value is invalid or missing.
        res.render('farms/new')
    } catch (e) {
        next(e);
    }
    // throw new AppError('Invalid')
})

app.get('/farms/:id', async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id).populate('products')
        res.render('farms/show', { farm })
    } catch (e) {
        next(e)
    }
})



app.post('/farms', async (req, res, next) => {
    try {
        const newFarm = new Farm(req.body);
        await newFarm.save();
        res.redirect(`/farms/${newFarm._id}`)
    } catch (e) {
        next(e);
    }
})

app.get('/farms/:id/products/new', async (req, res, next) => {
    try { // if anything goes wrong or some value are missing that needs 
        //to have in there, we return an error from custom error callback we create. 
        //there so much possible scenario can happen in this node if the value is invalid or missing.
        const { id } = req.params;
        const farm = await Farm.findById(id);
        res.render('products/new', { farm })
    } catch (e) {
        next(e);
    }
    // throw new AppError('Invalid')
})

app.post('/farms/:id/products', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await Farm.findById(id);
        const { Name, Price, Stock } = req.body;
        // this tells express that only these 3 items, should get in request body
        const product = new Product({ Name, Price, Stock });
        farm.products.push(product)
        product.farm = farm;
        await farm.save();
        await product.save();
        res.redirect(`/farms/${farm.id}`);
    } catch (e) {
        next(e);
    }
})
//The products property from the Farm model is an array, 
//so we use an array method, push(), to add elements to it; 
//On the other hand, the farm property from the Product model 
//is an object, a reference to a farm, so using assignment is enough
// to define that new value, an array method wouldn't work in that case.

app.get('/farms/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await Farm.findById(id);
        const product = await Product.findById(id);
        if (!farm) {
            return next(new AppError('Farm Not Found', 404));
        } //If not a product pass an error message, use return print 
        // so that it will not pass along the to res.render
        res.render('farms/show', { farm, product})
    } catch (e) {
        next(e);
    }
})


app.get('/farms/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await Farm.findById(id);
        if (!farm) {
            return next(new AppError('Farm Not Found', 404));
        }//If not a product pass an error message, use return print 
        // so that it will not pass along the to res.render
        res.render('farms/edit', { farm })
    } catch (e) {
        next(e);
    }
})

app.put('/farms/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const farm = await Farm.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/farms/${farm.id}`);
    } catch (e) {
        next(e);
    }
})


app.delete('/farms/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Farm.findByIdAndDelete(id);
        res.redirect('/farms')
    } catch (e) {
        next(e);
    }
})

// app.all('/farms/:id', async (farm) => {
//     if (farm.products.length) {
//         const res = await Product.deleteMany({_id: {$in: farm.products}})
//         res.redirect('/farms')
//     }
// }) 



// *****************************************/////


//PRODUCT ROUTES
app.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find({})
        res.render('products/index', { products })
    } catch (e) {
        next(e);
    }

})

app.get('/products/new', (req, res, next) => {
    try { // if anything goes wrong or some value are missing that needs 
        //to have in there, we return an error from custom error callback we create. 
        //there so much possible scenario can happen in this node if the value is invalid or missing.
        res.render('products/new')
    } catch (e) {
        next(e);
    }
    // throw new AppError('Invalid')
})

app.post('/products', async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/products/${newProduct._id}`)
    } catch (e) {
        next(e);
    }

})

app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        const farm = await Farm.findById(id);
        if (!product) {
            return next(new AppError('Product Not Found', 404));
        } //If not a product pass an error message, use return print 
        // so that it will not pass along the to res.render
        res.render('products/show', { product , farm })
    } catch (e) {
        next(e);
    }
})

app.get('/products/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return next(new AppError('Product Not Found', 404));
        }//If not a product pass an error message, use return print 
        // so that it will not pass along the to res.render
        res.render('products/edit', { product })
    } catch (e) {
        next(e);
    }
})

app.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product.id}`);
    } catch (e) {
        next(e);
    }
})

app.delete('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        res.redirect('/products')
    } catch (e) {
        next(e);
    }
})




app.use((req, res) => {
    res.status(404).send('NOT FOUND BITCHES')
})  // this middleware will handle an unknown routes or path 
//and throw an error

app.use((err, req, res, next) => {
    const { status = 500, message = 'Somethings Wrong' } = err;
    res.status(status).send(message)
})// neither of any routes or path already handled the error, 
//passed the next() error to this middleware.

app.listen(6969, () => {
    console.log('Listening on port 69 position');
})




