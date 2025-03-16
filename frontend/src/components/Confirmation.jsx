import Orders from './Orders';
import OrderDetails from './OrderDetails';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Confirmation = () => {
    const [isClicked, setClicked] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders/getAllOrders');
            console.log('API Response:', response.data); // Log the response data
    
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
    
            const allOrders = response.data.data; // Adjusted to match the expected structure
            setOrders(allOrders);
            console.log(allOrders)
            // Filter orders based on current status
            const filtered = allOrders.filter(order => order.order_status === currentStatus);
            setFilteredOrders(filtered);
            console.log('Filtered Orders:', filtered);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.response?.data?.message || err.message);
            setOrders([]);
            setFilteredOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Clear any existing error/success messages
        setError(null);
        setSuccess('');
    }, []);

    const handleStatusFilter = async (status) => {
        setCurrentStatus(status);
        setLoading(true);
        try {
            const filtered = orders.filter(order => order.order_status === status);
            setFilteredOrders(filtered);
        } catch (err) {
            setError('Error filtering orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCardView = (order) => {
        setClicked(order);
        setError(null);
    };

    const handleConfirmedOrder = async (statusOrder) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please login as admin');

            const response = await axios.put(
                `http://localhost:5000/api/orders/${statusOrder.transaction_id}`,
                { order_status: 'completed' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setSuccess('Order status updated successfully');
                await fetchOrders(); // Refresh all orders
                handleStatusFilter(currentStatus); // Maintain current filter
                setClicked(null); // Clear selected order
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating order');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen m-[30px] font-amaranth relative z-0'>
            <div className='border-[3px] border-website-green w-[3500px]'>
                <p className='text-[35px] m-[15px] text-website-green'><b>Confirm Orders</b></p>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4">
                        {success}
                    </div>
                )}
                <div className='flex m-[20px] space-x-5'>
                    <button
                        onClick={() => handleStatusFilter('completed')}
                        className={`p-[2px] rounded-[20px] w-[140px] h-[40px] 
              ${currentStatus === 'completed' ? 'bg-green-700 text-white' : 'bg-gray-300'}`}>
                        Completed
                    </button>
                    <button
                        onClick={() => handleStatusFilter('pending')}
                        className={`p-[2px] rounded-[20px] w-[140px] h-[40px] 
              ${currentStatus === 'pending' ? 'bg-green-700 text-white' : 'bg-gray-300'}`}>
                        Pending
                    </button>
                    <button
                        onClick={() => handleStatusFilter('cancelled')}
                        className={`p-[2px] rounded-[20px] w-[140px] h-[40px] 
              ${currentStatus === 'cancelled' ? 'bg-green-700 text-white' : 'bg-gray-300'}`}>
                        Cancelled
                    </button>
                </div>
                <hr className='border-[1px] border-website-green'></hr>
                <div className='flex text-website-green'>
                    <Orders
                        sampleOrders={filteredOrders}
                        onClickedOrder={isClicked}
                        onSelectedOrder={handleCardView}
                        onConfirmedOrder={handleConfirmedOrder}
                    />
                </div>
            </div>
            <div className='bg-website-green min-h-screen w-full'>
                <p className='text-[35px] text-white m-[15px]'>Order Details</p>
                {isClicked ? (<OrderDetails orders={isClicked} />) :
                    <div className="text-white text-center mt-10">Select an order to view details</div>
                }
            </div>
        </div>
    );
};

export default Confirmation;