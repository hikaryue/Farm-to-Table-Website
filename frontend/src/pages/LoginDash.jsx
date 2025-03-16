import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth'; // Import the loginUser function
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const LoginDash = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain at least one symbol');
            return;
        }

        try {
            const user = await loginUser({ email, password }); // Pass as an object
            setSuccess('User logged in successfully');
            setError('');
            localStorage.setItem('token', user.token); // Store token
            localStorage.setItem('userType', user.user_type); // Store user type
            navigate('/dashboard'); // Redirect to the dashboard
        } catch (err) {
            setError('Failed to log in. Please check your credentials and try again.');
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-website-lighter-green via-website-green to-website-green font-amaranth">
            <div className='flex h-[90vh] max-w-screen-xl w-full m-[20px] bg-white'>
                <div className='flex flex-col w-[50%] bg-gradient-to-r from-website-green via-website-green to-website-lighter-green p-[20px] text-white '>
                    <div className='flex'>
                        <p className='text-left text-sm font-medium'>FARM TO TABLE</p>
                    </div>
                    <div className='flex flex-col justify-center items-center text-center w-[350px] mx-auto text-m tracking-wide'>
                        <p className='text-[30px] mt-[80px] mb-[20px]'>Quality farmer produce to your comfort home made possible</p>
                        <hr className='w-[80%] border-[1px] border-white'></hr>
                        <FontAwesomeIcon icon={faSeedling} className='m-[20px] text-[30px]'/>
                        <p className='m-[5px]'>Log in and enjoy hassle-free shopping!</p>
                        <p className='text-sm m-[5px]'>or</p>
                        <p className='m-[5px]'>Join the community. Register now!</p>
                        <div className='w-full'>
                            <Link to="/register">
                                <button className='pl-20 pr-20 border-white border-[1px] mt-5 bg-website-green hover:bg-green-800 text-white font-medium py-2 rounded-[15px] text-center'>REGISTER</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-grow border-website-green border-[2px] rounded-[20px] m-[35px] justify-center items-center text-gray-600'>
                    <p className='text-website-green text-[35px]'>Welcome</p>
                    <p className='text-[15px] mb-10'>SIGN IN TO YOUR ACCOUNT</p>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    {success && <div className="mb-4 text-green-500">{success}</div>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-green-500 focus:border-green-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-website-green hover:bg-green-800 text-white font-medium py-2 rounded-[15px] text-center"
                        >
                            SIGN IN
                        </button>
                    </form>
                </div>  
            </div>
        </div>
    );
};

export default LoginDash;