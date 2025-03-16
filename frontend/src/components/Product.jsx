import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartModal from './CartModal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/product/getAllProducts');
                console.log('API response:', response.data); // Log the response
                if (response.data && response.data.data) {
                    setProducts(response.data.data); // Ensure correct path to products array
                } else {
                    setError('Invalid response structure');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = async (product_id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const response = await axios.post(
                'http://localhost:5000/api/cart/add',
                { 
                    product_id: product_id,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            if (response.data.success) {
                console.log('Added to cart successfully');
            }
        } catch (error) {
            console.error('Error adding to cart:', error.response?.data || error.message);
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <div className='m-10'>
            <div className='flex space-x-5 justify-between w-full'>
                <div className='bg-website-green rounded-[23px] h-[350px] flex-grow'></div>
                <div className='bg-website-brown rounded-[23px] h-[350px] flex-grow'></div>
            </div>
            {/* Filter Section */}
            <div className='flex justify-between w-full'>
                <div className="mt-[30px] mb-[30px] space-x-5 flex font-amaranth flex-wrap">
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Price</button>
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Crops</button>
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Poultry</button>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="p-[2px] pl-[15px] rounded-[15px] border-[2px] border-gray-500 h-[40px] w-full sm:w-[300px]"
                    />
                </div>
            </div>
            <div className='products-container flex flex-wrap justify-center'>
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.product_id} className='border-[3px] border-website-green rounded-[20px] p-4 h-[330px] w-[290px] text-center font-amaranth m-2'>
                            <div className='bg-website-green h-[190px] flex-grow'>
                                {product.image && (
                                    <img src={`data:${product.image.contentType};base64,${arrayBufferToBase64(product.image.data.data)}`} alt={product.name} className="h-full w-full object-cover" />
                                )}
                            </div>
                            <p className='m-[5px] text-black text-[17px] font-semibold '>{product.name}</p>
                            <hr className='border-t-[3px] border-website-green w-[200px] mx-auto'></hr>
                            <p className='m-[5px] text-black text-[15px] font-normal'>₱{(product.price || 0).toFixed(2)}</p>
                            <button
                                className='bg-website-green text-white w-full p-[5px] rounded-[5px]'
                                onClick={() => addToCart(product.product_id)}
                            >
                                ADD TO CART
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
            <button className="fixed bottom-10 right-10 bg-website-green text-white p-4 rounded-full" onClick={() => setIsCartOpen(true)}>
                View Cart
            </button>
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};

export default Products;