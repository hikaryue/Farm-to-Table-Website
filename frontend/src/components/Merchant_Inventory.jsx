import React, { useState } from 'react';
import axios from 'axios';

const Merchant_Inventory = ({ products, deleteProductInventory }) => {
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        product_qty: 0,
        price: 0
    });
    const [alertMessage, setAlertMessage] = useState('');

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleDelete = async (product_id) => {
        try {
            await axios.delete(`http://localhost:5000/api/product/deleteProduct/${product_id}`);
            deleteProductInventory(product_id);
            setAlertMessage('Product has been deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            product_qty: product.product_qty,
            price: product.price
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/product/editProduct/${editingProduct.product_id}`, formData);
            setEditingProduct(null);
            setAlertMessage('Product has been updated successfully.');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const incrementQuantity = () => {
        setFormData({ ...formData, product_qty: formData.product_qty + 1 });
    };

    const decrementQuantity = () => {
        setFormData({ ...formData, product_qty: formData.product_qty > 0 ? formData.product_qty - 1 : 0 });
    };

    return (
        <>
            {alertMessage && (
                <div className="fixed bottom-4 left-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50" role="alert">
                    <span className="block sm:inline">{alertMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setAlertMessage('')}>
                        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
                        </svg>
                    </span>
                </div>
            )}
            {products.map((product, index) => (
                <div key={product.product_id || index} className="flex h-[330px] w-[30%] ml-[15px] mr-[15px] mb-[15px]">
                    <div className="border-[3px] border-website-green p-4 w-[70%] text-center">
                        <div className='bg-website-green h-[190px] flex-grow'>
                            {product.image && (
                                <img src={`data:${product.image.contentType};base64,${arrayBufferToBase64(product.image.data.data)}`} alt={product.name} className="h-full w-full object-cover" />
                            )}
                        </div>
                        <p className='m-[5px] text-black text-[17px] font-semibold '>{product.name}</p>
                        <hr className='border-t-[3px] border-website-green w-[200px] mx-auto'></hr>
                        <div className="flex justify-between m-[5px] text-black text-[15px] font-normal">
                            <p>₱{(product.price || 0).toFixed(2)}</p>
                            <p>Quantity: {product.product_qty}</p>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => handleDelete(product.product_id)} className='bg-website-green text-white w-[48%] p-[5px] rounded-[5px]'>DELETE PRODUCT</button>
                            <button onClick={() => handleEdit(product)} className='bg-website-green text-white w-[48%] p-[5px] rounded-[5px]'>EDIT PRODUCT</button>
                        </div>
                    </div>
                    <div className="w-[50%] bg-website-green text-white text-[25px] overflow-hidden">
                        <div>
                            <p className="pt-[15px] pl-[15px]">Description</p>
                        </div>
                        <div className="flex h-[200px] text-center p-[10px] overflow-hidden">
                            <p className="text-[13px]">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            {editingProduct && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg" style={{ width: '500px', height: '500px' }}>
                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Quantity</label>
                                <div className="flex items-center">
                                    <button type="button" onClick={decrementQuantity} className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l">-</button>
                                    <input
                                        type="number"
                                        name="product_qty"
                                        value={formData.product_qty}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-none text-center"
                                    />
                                    <button type="button" onClick={incrementQuantity} className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r">+</button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Merchant_Inventory;