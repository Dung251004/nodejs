const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/productDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    productCode: String,
    productName: String,
    productDate: Date,
    productOrigin: String,
    productPrice: Number,
    productQuantity: Number
});

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route để chèn sản phẩm mới vào ProductCollection
app.post('/products', (req, res) => {
    const newProduct = new Product({
        productCode: req.body.productCode,
        productName: req.body.productName,
        productDate: req.body.productDate,
        productOrigin: req.body.productOrigin,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity
    });

    newProduct.save((err) => {
        if (err) {
            res.status(500).send('Lỗi khi lưu sản phẩm vào cơ sở dữ liệu');
        } else {
            res.status(201).send('Sản phẩm đã được chèn thành công');
        }
    });
});

// Route để xóa một sản phẩm từ ProductCollection
app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;

    Product.findByIdAndDelete(productId, (err) => {
        if (err) {
            res.status(500).send('Lỗi khi xóa sản phẩm từ cơ sở dữ liệu');
        } else {
            res.status(200).send('Sản phẩm đã được xóa thành công');
        }
    });
});

app.listen(port, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
