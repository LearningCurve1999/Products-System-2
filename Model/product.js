const mongoose = require('mongoose');
const { Schema } = mongoose

const productSchema = new Schema ({
    Name: {
        type: String,
        required: true
    },
    Stock: { 
        type: Number && String,
        required: true
    },
    Price: { 
        type: Number, required:true
    }, 
    farm:
    { type:Schema.Types.ObjectId, ref: 'Farm'}
    
})


const Product = mongoose.model('Product', productSchema);
// exports the model

module.exports = Product; 
// export this model to data.js so that 
// we can use this anywhere, any file that you set the execution path. (./Model/product)