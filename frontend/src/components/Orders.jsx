import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHourglass, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const Orders = ({ sampleOrders, onClickedOrder, onSelectedOrder, onConfirmedOrder }) => {
  return (
    <div className="flex flex-wrap p-[10px]">
      {sampleOrders.map((order) => (
        <div
          key={order.transaction_id} className={`flex border-[3px] border-website-green h-[140px] w-[325px] p-[5px] mb-[20px] mr-[10px] ${onClickedOrder?.transaction_id === order.transaction_id ? "bg-website-lighter-green text-white" : "bg-white"}`}>
          <div className="flex flex-col items-center justify-center w-[150px]">
            {order.order_status === "completed" ? (
              <div className="flex flex-col text-website-green font-semibold">
                <div className="relative flex justify-center items-center">
                  <div className="absolute w-[90px] h-[90px] bg-white rounded-full"></div>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[80px] z-10" />
                </div>
                <p className={`mt-[5px] ${onClickedOrder?.transaction_id === order.transaction_id ? "text-white" : "text-website-green"}`}>CONFIRMED</p>
              </div>
            ) : order.order_status === "pending" ? (
              <div className="flex flex-col items-center text-website-yellow font-semibold">
                <div className="relative w-[85px] h-[85px] flex justify-center items-center rounded-full bg-white">
                  <div className="absolute w-[75px] h-[75px] bg-website-yellow rounded-full"></div>
                  <FontAwesomeIcon icon={faHourglass} className="text-white text-[45px] z-10" />
                </div>
                <p className={`mt-[5px] ${onClickedOrder?.transaction_id === order.transaction_id ? "text-white" : "text-website-yellow"}`}>PENDING</p>
              </div>
            ) : (
              <div className="flex flex-col text-website-red font-semibold">
                <div className="relative flex justify-center items-center">
                  <div className="absolute w-[90px] h-[90px] bg-white rounded-full"></div>
                  <FontAwesomeIcon icon={faTimesCircle} className="text-[80px] z-10" />
                </div>
                <p className={`mt-[5px] ${onClickedOrder?.transaction_id === order.transaction_id ? "text-white" : "text-website-red"}`}>CANCELLED</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-[12px] font-semibold mb-2">ORDER ID: {order.transaction_id}</p>
            <p className="text-[18px]">{order.email}</p>
            <p className="ml-[20px] font-semibold">TOTAL: ₱{order.total_amount.toFixed(2)}</p> {/* Truncate to 2 decimal places */}
            <div className="flex flex-wrap justify-center space-x-3">
              <button onClick={() => onSelectedOrder(order)} className="bg-gray-300 p-[2px] rounded-[20px] w-[70px] h-[30px] mt-[5px] hover:bg-green-700 hover:text-white">
                View
              </button>
              {order.order_status.toLowerCase() === "pending" && (
                <button onClick={() => onConfirmedOrder(order)} className="bg-gray-300 p-[2px] rounded-[20px] w-[70px] h-[30px] mt-[5px] hover:bg-green-700 hover:text-white">
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;