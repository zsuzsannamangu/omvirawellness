// test-auth.js - Test authentication endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/auth';

async function testLogin() {
  console.log('🧪 Testing Authentication Endpoints\n');
  
  try {
    // Test login with client credentials
    console.log('1️⃣ Testing login with client credentials...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'client@test.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('   User:', loginResponse.data.data.user);
    console.log('   Token:', loginResponse.data.data.token.substring(0, 50) + '...\n');
    
    // Test login with provider credentials
    console.log('2️⃣ Testing login with provider credentials...');
    const providerLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'provider1@test.com',
      password: 'password123'
    });
    
    console.log('✅ Provider login successful!');
    console.log('   User:', providerLogin.data.data.user);
    console.log('   Token:', providerLogin.data.data.token.substring(0, 50) + '...\n');
    
    // Test login with space owner credentials
    console.log('3️⃣ Testing login with space owner credentials...');
    const spaceLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'space@test.com',
      password: 'password123'
    });
    
    console.log('✅ Space owner login successful!');
    console.log('   User:', spaceLogin.data.data.user);
    console.log('   Token:', spaceLogin.data.data.token.substring(0, 50) + '...\n');
    
    // Test invalid credentials
    console.log('4️⃣ Testing invalid credentials...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: 'fake@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid credentials properly rejected\n');
      }
    }
    
    console.log('🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testLogin();

