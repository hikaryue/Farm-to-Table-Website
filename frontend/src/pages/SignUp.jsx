import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateName = (name) => {
        const regex = /^[a-zA-Z]+$/;
        return regex.test(name);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateName(fname)) {
            setError('First name cannot contain numbers or special characters');
            return;
        }

        if (!validateName(lname)) {
            setError('Last name cannot contain numbers or special characters');
            return;
        }

        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain at least one symbol');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                fname,
                lname,
                email,
                password,
            });
            setSuccess('User registered successfully');
            setError('');
            console.log('User registered:', response.data);
            navigate('/'); // Redirect to login page after successful sign-up
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-website-lighter-green via-website-green to-website-green font-amaranth">
            <div className='flex h-[90vh] max-w-screen-xl w-full m-[20px] bg-white'>   
                <div className='flex flex-col flex-grow border-website-green border-[2px] rounded-[20px] m-[35px] justify-center items-center text-gray-600'>
                    <p className='text-website-green text-[35px]'>Welcome</p>
                    <p className='text-[15px] mb-10'>CREATE YOUR ACCOUNT</p>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    {success && <div className="mb-4 text-green-500">{success}</div>}
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="fname">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="fname"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="lname">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lname"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div className='flex justify-center'>
                            <button
                                type="submit"
                                className="w-full bg-website-green hover:bg-green-800 text-white font-medium py-2 rounded-[15px] text-center"
                            >
                                REGISTER
                            </button>
                        </div>
                    </form>
                </div>
                <div className='flex flex-col w-[50%] bg-gradient-to-r from-website-green via-website-green to-website-lighter-green p-[20px] text-white '>
                    <div className='flex justify-end'>
                        <p className='text-left text-sm font-medium'>FARM TO TABLE</p>
                    </div>
                    <div className='flex flex-col justify-center items-center text-center w-[350px] mx-auto text-m tracking-wide'>
                        <p className='text-[30px] mt-[80px] mb-[20px]'>Quality farmer produce to your comfort home made possible</p>
                        <hr className='w-[80%] border-[1px] border-white'></hr>
                        <FontAwesomeIcon icon={faSeedling} className='m-[20px] text-[30px]'/>
                        <p className='m-[5px]'>Dive in and enjoy a hassle-free shopping</p>
                        <p className='m-[5px]'>Already a registered customer? Sign in now!</p>
                        <div className='w-full'>
                            <Link to="/">
                                <button className='pl-20 pr-20 border-white border-[1px] mt-5 bg-website-green hover:bg-green-800 text-white font-medium py-2 rounded-[15px] text-center'>SIGN IN</button>
                            </Link>
                        </div>

                    </div>
                </div>  
            </div>
        </div>
    );
};

export default SignUp;