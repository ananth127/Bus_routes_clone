import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import DriverView from './components/DriverView';
import StudentView from './components/StudentView';

const App = () => {
  const [role, setRole] = useState(null);
  const [busID, setBusId] = useState(null);

  const handleLogin = (userRole, userBusId) => {
    setRole(userRole);
    setBusId(userBusId);
  };

  return (
    <Router>
      <div>
        <h1>Bus Tracking System</h1>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm />} />
          {console.log("BusId =- ",busID)}
          {role === 'driver' && <Route path="/driver-dashboard" element={<DriverView busId={busID} /> } />}
          {role === 'student' && <Route path="/student-dashboard" element={<StudentView busId={busID} />} />}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
