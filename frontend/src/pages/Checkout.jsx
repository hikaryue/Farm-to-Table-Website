import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Checkout = ({ onBack }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setCartItems(response.data.cart.items);
                setTotal(parseFloat(response.data.cart.total).toFixed(2));
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
    
        if (!address || !city || !postalCode || !country) {
            setError('All address fields are required');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/orders',
                {
                    shippingAddress: {
                        address: address.trim(),
                        city: city.trim(),
                        postalCode: postalCode.trim(),
                        country: country.trim()
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data.success) {
                setCartItems([]);
                localStorage.removeItem('cartItems');
                setTotal(0);
                setSuccess('Order placed successfully');
                setError('');
                
                // Clear form
                setAddress('');
                setCity('');
                setPostalCode('');
                setCountry('');
    
                setTimeout(() => onBack?.(), 2000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error creating order';
            setError(errorMsg);
            setSuccess('');
        }
    };

    return (
        <div className="h-full flex flex-col justify-center bg-white p-4 text-xs">
            <h2 className="text-xl font-bold text-4xl">Checkout</h2>
            <div className="flex justify-between items-center mb-16">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700"
                >
                    &larr; Back to Cart
                </button>
            </div>
            {error && <div className="mb-2 text-red-500">{error}</div>}
            {success && <div className="mb-2 text-green-500">{success}</div>}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div><strong>Product Name</strong></div>
                    <div><strong>Quantity</strong></div>
                    <div><strong>Price</strong></div>
                </div>
                {cartItems.map(item => (
                    <div key={item.product._id} className="grid grid-cols-3 gap-2 text-center mt-1">
                        <div>{item.product.name}</div>
                        <div>{item.quantity}</div>
                        <div>${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
                <div className="mt-2 text-right text-lg">
                    <strong>Total: ${total}</strong>
                </div>
            </div>
            <form onSubmit={handlePlaceOrder} className="flex flex-col space-y-2">
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="postalCode">Postal Code</label>
                    <input
                        type="text"
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                    >
                        Place Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;