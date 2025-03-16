import React, { useState } from 'react';
import axios from 'axios';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        product_type: 'crops',
        product_qty: 0,
        price: 0,
        image: null
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 50 * 1024) {
            setError('Image size should be less than 50 KB');
            return;
        }
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            if (img.width !== 330 || img.height !== 290) {
                setError('Image dimensions should be 330 x 290');
                return;
            }
            setNewProduct({ ...newProduct, image: file });
            setError(null);
        };
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('product_type', newProduct.product_type);
            formData.append('product_qty', newProduct.product_qty);
            formData.append('price', newProduct.price);
            formData.append('image', newProduct.image);

            const response = await axios.post('http://localhost:5000/api/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                setSuccess('Product added successfully');
                onProductAdded(response.data.product);
                setNewProduct({
                    name: '',
                    description: '',
                    product_type: 'crops',
                    product_qty: 0,
                    price: 0,
                    image: null
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding product');
        }
    };

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="absolute right-0 w-80 bg-white h-full shadow-lg p-4 font-amaranth">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Product</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Close
                    </button>
                </div>
                <form onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        required
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                    />
                    <textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Product Description"
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                    />
                    <select
                        name="product_type"
                        value={newProduct.product_type}
                        onChange={handleInputChange}
                        required
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                    >
                        <option value="crops">Crops</option>
                        <option value="poultry">Poultry</option>
                    </select>
                    <label className="block mb-2">
                        Product Quantity
                        <input
                            type="number"
                            name="product_qty"
                            value={newProduct.product_qty}
                            onChange={handleInputChange}
                            placeholder="Product Quantity"
                            required
                            className="w-full mb-2 p-2 border border-gray-300 rounded"
                        />
                    </label>
                    <label className="block mb-2">
                        Product Price
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            placeholder="Product Price"
                            required
                            className="w-full mb-2 p-2 border border-gray-300 rounded"
                        />
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-medium py-2 rounded-md">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;