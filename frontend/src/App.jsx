import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginDash from './pages/LoginDash';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard'; // Assuming you have a Dashboard component
import Inventory from './components/Inventory';
import Confirmation from './components/Confirmation';
import Analytics from './components/Analytics';
import UserAccounts from './pages/UserAccounts';
import Checkout from './pages/Checkout';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<LoginDash />} /> 
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<Inventory />} />
          <Route path="/confirm" element={<Confirmation />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<UserAccounts />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;