import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  // Обробка форми логіну
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      setToken(response.data.token);
      setMessage('Вхід успішний!');
    } catch (error) {
      setMessage('Помилка входу');
    }
  };

  // Обробка форми реєстрації
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', { username, password });
      setMessage('Реєстрація успішна!');
    } catch (error) {
      setMessage('Помилка реєстрації');
    }
  };

  return (
    <div className="App">
      <h1>Вебсервіс замовлення їжі</h1>

      {/* Форма для реєстрації */}
      <h2>Реєстрація</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Реєструватися</button>
      </form>

      {/* Форма для логіну */}
      <h2>Логін</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Увійти</button>
      </form>

      {/* Повідомлення про результат */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
