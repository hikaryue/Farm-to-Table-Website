import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Analytics from './Analytics';
import Confirmation from './Confirmation';
import Inventory from './Inventory';
import Products from './Product';
import UserOrders from './UserOrders';
import Checkout from '../pages/Checkout';

const NavBar = ({ userType, setCurrentView, isAccountModalOpen, setIsAccountModalOpen }) => {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentViewState] = useState('HOME');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/users/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                window.location.href = '/';
                return;
            }
    
            // Call logout endpoint
            await axios.post('http://localhost:5000/api/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            // Clear local storage and cookies
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
            // Redirect to login
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout on error
            localStorage.clear();
            window.location.href = '/';
        }
    };

    const handleAccountClick = (e) => {
        e.preventDefault();
        setIsAccountModalOpen(true);
    };

    const handleViewChange = (view, component) => {
        setCurrentViewState(view);
        setCurrentView(component);
    };

    return (
        <nav className="border-b border-gray-200 shadow-sm font-amaranth">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side navigation */}
                    <div className="flex">
                        <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                            {userType === 'customer' && (
                                <>
                                    <button
                                        onClick={() => handleViewChange('HOME', <Products />)}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentView === 'HOME' ? 'text-green-700 border-green-500' : 'text-gray-500 hover:text-green-700 hover:border-green-500'}`}
                                    >
                                        HOME
                                    </button>
                                    <button
                                        onClick={() => handleViewChange('ORDERS', <UserOrders token={localStorage.getItem('token')} email={user?.email} />)}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentView === 'ORDERS' ? 'text-green-700 border-green-500' : 'text-gray-500 hover:text-green-700 hover:border-green-500'}`}
                                    >
                                        ORDERS
                                    </button>
                                </>
                            )}
                            {userType === 'admin' && (
                                <button
                                    onClick={() => handleViewChange('HOME', <Confirmation />)}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentView === 'HOME' ? 'text-green-700 border-green-500' : 'text-gray-500 hover:text-green-700 hover:border-green-500'}`}
                                >
                                    HOME
                                </button>
                            )}
                            {userType === 'admin' && (
                                <>
                                    <button
                                        onClick={() => handleViewChange('ANALYTICS', <Analytics />)}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentView === 'ANALYTICS' ? 'text-green-700 border-green-500' : 'text-gray-500 hover:text-green-700 hover:border-green-500'}`}
                                    >
                                        ANALYTICS
                                    </button>
                                    <button
                                        onClick={() => handleViewChange('INVENTORY', <Inventory />)}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentView === 'INVENTORY' ? 'text-green-700 border-green-500' : 'text-gray-500 hover:text-green-700 hover:border-green-500'}`}
                                    >
                                        INVENTORY
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                        <button
                            onClick={handleAccountClick}
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isAccountModalOpen ? 'text-green-700 border-green-500' : 'text-gray-500 hover:text-green-700 hover:border-green-500'}`}
                        >
                            ACCOUNT
                        </button>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 hover:text-green-700 hover:border-green-500"
                        >
                            LOGOUT
                        </button>
                        <p className="inline-flex items-center px-1 pt-1 text-sm font-medium text-website-green">
                            Hi, {user?.fname || 'Guest'}!
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;