import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Checkout from '../pages/Checkout';

const CartModal = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState('CART'); // State to handle view change

    useEffect(() => {
        if (isOpen) {
            fetchCartItems();
        }
    }, [isOpen]);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state

            const token = localStorage.getItem('token');
            if (!token) {
                return; // Silently return if no token
            }

            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Handle both successful responses and empty carts
            if (response.data.success) {
                setCartItems(response.data.cart?.items || []);
                setTotal(parseFloat(response.data.cart?.total || 0).toFixed(2));
            }
        } catch (error) {
            // Only set error for network or server errors
            if (error.response?.status !== 404) {
                setError('Unable to connect to server');
            }
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/cart/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update state directly
            const updatedItems = cartItems.filter(item => item.product._id !== productId);
            setCartItems(updatedItems);
            setTotal(updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            if (newQuantity < 1) {
                await removeFromCart(productId);
                return;
            }

            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/cart/update/${productId}`,
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update state directly
            const updatedItems = cartItems.map(item =>
                item.product._id === productId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedItems);
            setTotal(updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    if (loading) return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="absolute right-0 w-80 bg-white h-full p-4">
                <p>Loading cart...</p>
            </div>
        </div>
    );

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="absolute right-0 w-80 bg-white h-full shadow-lg p-4 font-amaranth">
                {view === 'CART' && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Cart</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Close
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 mb-4">{error}</div>
                        )}

                        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {cartItems.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.product._id} className="border-b border-gray-200 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{item.product.name}</h3>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm text-gray-600">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600">Price: ${item.product.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.product._id)}
                                                    className="text-red-500 text-sm hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total:</span>
                                    <span className="font-bold">${total}</span>
                                </div>
                                <button
                                    onClick={() => setView('CHECKOUT')}
                                    className="w-full bg-green-500 hover:bg-green-700 text-white font-medium py-2 rounded-md mt-4"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </>
                )}
                {view === 'CHECKOUT' && (
                    <Checkout onBack={() => setView('CART')} />
                )}
            </div>
        </div>
    );
};

export default CartModal;