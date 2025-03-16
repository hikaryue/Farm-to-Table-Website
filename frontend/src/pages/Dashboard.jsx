import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Products from '../components/Product';
import Confirmation from '../components/Confirmation';
import AccountModal from '../components/AccountModal';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [currentView, setCurrentView] = useState(null);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    const handleAccountClose = () => {
        setIsAccountModalOpen(false);
    };


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
                    setUserType(response.data.user_type);
                    if (response.data.user_type === 'admin') {
                        setCurrentView(<Confirmation />);
                    } else {
                        setCurrentView(<Products />);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative">
            <NavBar
                userType={userType}
                setCurrentView={setCurrentView}
                isAccountModalOpen={isAccountModalOpen}
                setIsAccountModalOpen={setIsAccountModalOpen}
                user={user}
                className="z-50"
            />
            <div className="min-h-screen bg-white">
                <div className='m-10'>
                    {currentView}
                </div>
            </div>
            <AccountModal
                isOpen={isAccountModalOpen}
                onClose={handleAccountClose}
                className="z-[100] fixed top-0 left-0 right-0"
                user={user}
            />
        </div>
    );
};

export default Dashboard;