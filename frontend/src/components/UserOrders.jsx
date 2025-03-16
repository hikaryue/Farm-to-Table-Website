import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrders = ({ token, email }) => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/getAllOrders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: email
                    }
                });
                console.log('Full API Response:', response); // Log the full response
                console.log('API Response Data:', response.data); // Log the response data
                if (response.data && Array.isArray(response.data.data)) {
                    setOrders(response.data.data);
                } else {
                    console.error('Invalid response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [token, email]);
    
    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className='m-10'>
            <div className="flex text-center text-[18px]">
                <div className="w-full">
                    <hr className="border-[1px] border-website-green"></hr>
                    <p><b>ORDER ID</b></p>
                    <hr className="border-[1px] border-website-green"></hr>
                    <div className="text-black text-[17px] m-[5px]">
                        {orders.map((order, index) => (
                            <div key={order.transaction_id || index}>
                                <p>{order.transaction_id}</p>
                                <hr className="border-[1px] border-gray-300 w-[50%] mx-auto"></hr>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <hr className="border-[1px] border-website-green"></hr>
                    <p><b>STATUS</b></p>
                    <hr className="border-[1px] border-website-green"></hr>
                    <div className="text-black text-[17px] m-[5px]">
                        {orders.map((order, index) => (
                            <div key={order.transaction_id || index}>
                                <p>{order.order_status}</p>
                                <hr className="border-[1px] border-gray-300 w-[50%] mx-auto"></hr>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <hr className="border-[1px] border-website-green"></hr>
                    <p><b>TOTAL</b></p>
                    <hr className="border-[1px] border-website-green"></hr>
                    <div className="text-black text-[17px] m-[5px]">
                        {orders.map((order, index) => (
                            <div key={order.transaction_id || index}>
                                <p>₱{(order.total_amount || 0).toFixed(2)}</p>
                                <hr className="border-[1px] border-gray-300 w-[50%] mx-auto"></hr>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <hr className="border-[1px] border-website-green"></hr>
                    <p><b>ORDER DATE</b></p>
                    <hr className="border-[1px] border-website-green"></hr>
                    <div className="text-black text-[17px] m-[5px]">
                        {orders.map((order, index) => (
                            <div key={order.transaction_id || index}>
                                <p>{new Date(order.createdAt).toLocaleString()}</p>
                                <hr className="border-[1px] border-gray-300 w-[50%] mx-auto"></hr>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <hr className="border-[1px] border-website-green"></hr>
                    <p><b>ITEMS</b></p>
                    <hr className="border-[1px] border-website-green"></hr>
                    <div className="text-black text-[17px] m-[5px]">
                        {orders.map((order, index) => (
                            <div key={order.transaction_id || index}>
                                <button onClick={() => toggleExpand(order.transaction_id)} className="text-blue-500 hover:underline">
                                    {expandedOrder === order.transaction_id ? 'Hide Items' : 'Show Items'}
                                </button>
                                {expandedOrder === order.transaction_id && (
                                    <div className="flex justify-between">
                                        <div className="w-1/2">
                                            <p className="font-semibold">Item Name</p>
                                            <ul>
                                                {order.items.map((item, idx) => (
                                                    <li key={idx}>{item.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="w-1/2">
                                            <p className="font-semibold">Quantity</p>
                                            <ul>
                                                {order.items.map((item, idx) => (
                                                    <li key={idx}>{item.quantity}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                <hr className="border-[1px] border-gray-300 w-[50%] mx-auto"></hr>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrders;