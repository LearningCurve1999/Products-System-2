const { application } = require('express');
const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // Stock: {
    //     type: Number && String,
    //     required: true
    // },
    // Price: {
    //     type: Number,
    //     required: true
    // },
    city: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId, ref: 'Product',
        }
    ]
})

farmSchema.post('findOneAndDelete', async (farm) => {
    if (farm.products.length) {
        const res = await Product.deleteMany({_id: {$in: farm.products}})
    }
})
//All the products are created as part of products collection and included as an array under each associated farm. So when we delete the farm, only the products array inside farm will be deleted but not the product in products collection. So to do that we need to delete them separately. We can place the code in delete route but just to make sure to delete the products when a farm is deleted it is safe to create a middleware as there can be more ways to delete farms in a complete application.


const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm; 

