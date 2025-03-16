import React from "react";

const toProperCase = (text) => {
    return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const OrderDetails = ({ orders }) => {
    return (
        <div className="m-[10px] text-white">
            <div className="bg-website-lighter-green p-[10px]">
                <p className="text-[20px]">{orders.transaction_id}</p>
                <p className="text-[20px]">Status: {toProperCase(orders.order_status)}</p>
                <p className="text-[20px]">Total: ₱{orders.total_amount.toFixed(2)}</p>
                <div className="mt-4">
                    <p className="text-[20px]">Items:</p>
                    {orders.items?.map((item, index) => (
                        <div key={index} className="flex m-[20px] text-[20px] space-x-5">
                            <div className="bg-website-green p-[10px]">
                                <p>{item.quantity}x</p>
                            </div>
                            <div className="p-[10px]">
                                <p>{item.name}</p>
                                <p>₱{item.price_at_purchase.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;