import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SoldProducts from './SoldProducts';

const Analytics = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [periodDate, setPeriodDate] = useState('');
    const [productSales, setProductSales] = useState([]);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/getAllOrders');
                const orders = response.data.data;

                let income = 0;
                let sales = 0;
                const productSalesMap = {};

                const confirmedOrders = orders.filter(order => order.order_status === 'completed');

                confirmedOrders.forEach(order => {
                    order.items.forEach(item => {
                        const productId = item.product._id;
                        const productName = item.product.name;
                        const quantity = item.quantity;
                        const price = item.price_at_purchase;

                        income += price * quantity;
                        sales += quantity;

                        if (!productSalesMap[productId]) {
                            productSalesMap[productId] = {
                                productId,
                                productName,
                                quantity: 0,
                                totalIncome: 0
                            };
                        }

                        productSalesMap[productId].quantity += quantity;
                        productSalesMap[productId].totalIncome += price * quantity;
                    });
                });

                setTotalIncome(income);
                setTotalSales(sales);
                setProductSales(Object.values(productSalesMap));
                setPeriodDate('XX/XX/XX - XX/XX/XX'); // Set the actual period date as needed
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchAllOrders();
    }, []);

    return (
        <>
            <div className='text-website-green min-h-screen m-[30px] border-[3px] border-website-green font-amaranth'>
                <div>
                    <p className='text-[35px] m-[15px] text-website-green'><b>Sales Report</b></p>
                    <div className='flex m-[20px] space-x-5'>
                        <button className="bg-gray-300 p-[2px] rounded-[20px] w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Weekly</button>
                        <button className="bg-gray-300 p-[2px] rounded-[20px] w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Monthly</button>
                        <button className="bg-gray-300 p-[2px] rounded-[20px] w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Annually</button>
                    </div>
                </div>
                <div className='flex justify-evenly text-4xl p-[50px]'>
                    <div className='text-center'>
                        <p>₱{totalIncome.toFixed(2)}</p>
                        <p className='text-xl'>TOTAL INCOME</p>
                    </div>
                    <div className='text-center'>
                        <p>{totalSales}</p>
                        <p className='text-xl'>TOTAL SALES</p>
                    </div>
                    <div className='text-center'>
                        <p>{periodDate}</p>
                        <p className='text-xl'>PERIOD DATE</p>
                    </div>
                </div>
                <div>
                    <SoldProducts productSales={productSales} />
                </div>
            </div>
        </>
    );
};

export default Analytics;