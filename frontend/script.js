function selectFood(foodName) {
  document.getElementById('food').value = foodName;
}

document.getElementById('orderForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Будь ласка, увійдіть у систему.");
    return;
  }

  const order = {
    name: document.getElementById('name').value,
    address: document.getElementById('address').value,
    food: document.getElementById('food').value
  };

  try {
    const response = await fetch('http://localhost:3000/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // Додаємо токен у заголовок
      },
      body: JSON.stringify(order)
    });

    const result = await response.json();
    
    if (response.ok) {
      document.getElementById('status').textContent = result.message;  // Повідомлення про успіх
      document.getElementById('orderForm').reset();  // Очищаємо форму після успішного відправлення
    } else {
      document.getElementById('status').textContent = "Сталася помилка: " + result.message;  // Помилка
    }

  } catch (error) {
    document.getElementById('status').textContent = "Помилка сервера: " + error.message;
  }
});
