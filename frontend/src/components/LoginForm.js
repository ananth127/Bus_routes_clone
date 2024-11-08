import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busId, setBusId] = useState(''); // Only for drivers
  const [role, setRole] = useState('student'); // Default role
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://bus-routes-ywvb.vercel.app/api/auth/login', {
        username,
        password,
        role,
        busId: role === 'driver' ? busId : undefined, // Include busId only for drivers
      });

      alert(response.data.message);

      // Notify App component of the role and busId
      onLogin(role, response.data.busID || busId); // Use busID from response for students

      // Navigate based on role
      if (role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Login failed');
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>{message}</div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="driver">Driver</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {role === 'driver' && (
        <input
          type="text"
          placeholder="Bus ID"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
        />
      )}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
