import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

Modal.setAppElement('#root');

const AccountModal = ({ isOpen, onClose, user }) => {
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        fname: "",
        lname: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || "",
                fname: user.fname || "",
                lname: user.lname || ""
            });
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditProfile(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/users/update',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setIsEditProfile(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleClose = () => {
        onClose();
        setIsEditProfile(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Account Modal"
            overlayClassName="fixed inset-0 bg-website-green bg-opacity-30 flex items-center justify-center z-[100]"
            className="w-1/2 h-1/2 border-[2px] bg-white border-website-green rounded-[20px] p-3 relative"
            style={{
                overlay: { zIndex: 100 }
            }}
        >
            <div className='text-website-green font-amaranth'>
                <div className='flex items-center p-3'>
                    <FontAwesomeIcon icon={faUser} className='text-3xl' />
                    <p className='font-semibold text-3xl ml-3'>ACCOUNT</p>
                </div>
                <hr className='border-website-green border-1' />

                <div className='flex'>
                    <div className='flex flex-col mr-5 p-5 w-1/4'>
                        <p className='p-2 mb-3'>Email</p>
                        <p className='p-2 mb-3'>First Name</p>
                        <p className='p-2 mb-3'>Last Name</p>
                    </div>
                    <div className='flex flex-col p-5 mr-5 w-3/4'>
                        {isEditProfile ? (
                            <div className='flex flex-col w-full'>
                                <input
                                    name="email"
                                    onChange={handleChange}
                                    className='w-full border-website-green border-[1px] p-2 mb-3 rounded'
                                    type="text"
                                    value={formData.email || ''}
                                />
                                <input
                                    name="fname"
                                    onChange={handleChange}
                                    className='w-full border-website-green border-[1px] p-2 mb-3 rounded'
                                    type="text"
                                    value={formData.fname || ''}
                                />
                                <input
                                    name="lname"
                                    onChange={handleChange}
                                    className='w-full border-website-green border-[1px] p-2 mb-3 rounded'
                                    type="text"
                                    value={formData.lname || ''}
                                />
                            </div>
                        ) : (
                            <div className='w-full'>
                                <p className='w-full border-website-green border-[1px] p-2 mb-3 rounded'>{formData.email || ''}</p>
                                <p className='w-full border-website-green border-[1px] p-2 mb-3 rounded'>{formData.fname || ''}</p>
                                <p className='w-full border-website-green border-[1px] p-2 mb-3 rounded'>{formData.lname || ''}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    {isEditProfile ? (
                        <button onClick={handleSave} className='bg-website-green text-white border-white rounded-[20px] w-1/4 pt-1 pb-1 m-5 hover:bg-green-700'>
                            Save
                        </button>
                    ) : (
                        <button onClick={handleEdit} className='bg-website-green text-white border-white rounded-[20px] w-1/4 pt-1 pb-1 m-5 hover:bg-green-700'>
                            Edit Account
                        </button>
                    )}
                    <button onClick={handleClose}    className='bg-website-green text-white border-white rounded-[20px] w-1/4 pt-1 pb-1 hover:bg-green-700'>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AccountModal;