import Merchant_Inventory from "./Merchant_Inventory";
import AddProductModal from "./AddProductModal";
import { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
    const [inventoryProduct, setInventoryProduct] = useState([]);
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/product/getAllProducts');
            if (response.data && response.data.data) {
                setInventoryProduct(response.data.data);
            } else {
                console.error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteInventory = (id) => {
        setInventoryProduct((prevInventoryProduct) => prevInventoryProduct.filter(inventory => inventory.product_id !== id));
    };

    const handleProductAdded = (newProduct) => {
        setInventoryProduct([...inventoryProduct, newProduct]);
        setAddProductModalOpen(false);
    };

    return (
        <>
        <div className='text-website-green min-h-screen m-[30px] border-[3px] border-website-green font-amaranth'>
            <div className="m-[15px]">
                <p className='text-[35px] text-website-green'><b>Product Inventory</b></p>
                <div className="mt-[30px] mb-[30px] space-x-5 flex font-amaranth flex-wrap">
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Price</button>
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Quantity</button>
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Crops</button>
                    <button className="bg-gray-300 p-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] hover:bg-green-700 hover:text-white">Poultry</button>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="p-[2px] pl-[15px] rounded-[15px] border-[2px] border-gray-500 h-[40px] w-full sm:w-[300px]"
                    />
                    <button
                        onClick={() => setAddProductModalOpen(true)}
                        className="border border-transparent text-sm font-medium p-[2px] pl-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                        Add Product
                    </button>
                    <button
                        onClick={fetchProducts}
                        className="border border-transparent text-sm font-medium p-[2px] pl-[2px] rounded-[20px] w-full sm:w-[140px] h-[40px] shadow-sm text-white bg-blue-500 hover:bg-blue-600"
                    >
                        Refresh
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap m-[5px]">
                <Merchant_Inventory products={inventoryProduct} deleteProductInventory={handleDeleteInventory}/>
            </div>
        </div>
        <AddProductModal
            isOpen={isAddProductModalOpen}
            onClose={() => setAddProductModalOpen(false)}
            onProductAdded={handleProductAdded}
        />
        </>
    );
};

export default Inventory;