// frontend/src/components/SignupForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busId, setBusId] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [message, setMessage] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // For drivers, get the current location
      if (role === 'driver') {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
              resolve();
            },
            (error) => {
              console.error("Geolocation error:", error);
              reject(error);
            }
          );
        });
      }

      const response = await axios.post('https://bus-routes-ywvb.vercel.app/api/auth/signup', {
        username,
        password,
        role,
        busId,
        latitude: role === 'driver' ? latitude : undefined,
        longitude: role === 'driver' ? longitude : undefined,
      });

      alert(response.data.message); // Show success message
      setMessage(response.data.message); // Set success message in state
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering user');
      alert(error.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <p>{message}</p>

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
      <input
        type="number"
        placeholder="Bus ID"
        value={busId}
        onChange={(e) => setBusId(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="driver">Driver</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
