const axios = require('axios');

const BASE = process.env.VITE_API_URL || 'https://final-project-1-1iyh.onrender.com';

(async () => {
  try {
    const email = `test+${Date.now()}@example.com`;
    console.log('Testing register endpoint with email:', email);

    const res = await axios.post(`${BASE}/api/register`, {
      name: 'Test User',
      email,
      password: 'pass1234'
    }, { timeout: 10000 });

    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Request failed with status:', err.response.status);
      console.error('Response body:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
})();
