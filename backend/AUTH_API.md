# Authentication API Documentation

## 🎉 Authentication System Complete!

All authentication endpoints are now live and tested.

---

## 📍 Base URL

```
http://localhost:4000/api/auth
```

---

## 🔐 Endpoints

### 1. Register Client

**POST** `/api/auth/register/client`

Register a new client account.

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "your-password",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "415-555-0101"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "client@example.com",
      "user_type": "client"
    },
    "token": "jwt-token-here"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email, password, firstName, and lastName are required"
}
```

**Error (409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Register Provider

**POST** `/api/auth/register/provider`

Register a new provider account.

**Request Body:**
```json
{
  "email": "provider@example.com",
  "password": "your-password",
  "businessName": "Healing Hands",
  "contactName": "Jane Smith",
  "phoneNumber": "415-555-0201",
  "businessType": "massage_therapy"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Provider registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "provider@example.com",
      "user_type": "provider"
    },
    "token": "jwt-token-here"
  }
}
```

---

### 3. Register Space Owner

**POST** `/api/auth/register/space-owner`

Register a new space owner account.

**Request Body:**
```json
{
  "email": "space@example.com",
  "password": "your-password",
  "businessName": "Wellness Spaces",
  "contactName": "Alex Johnson",
  "phoneNumber": "415-555-0301"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Space owner registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "space@example.com",
      "user_type": "space_owner"
    },
    "token": "jwt-token-here"
  }
}
```

---

### 4. Login (Universal)

**POST** `/api/auth/login`

Login for all user types (client, provider, space_owner).

**Request Body:**
```json
{
  "email": "client@test.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "client@test.com",
      "user_type": "client"
    },
    "token": "jwt-token-here"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Account is deactivated"
}
```

---

## 🔑 Using the Token

After successful login, include the JWT token in subsequent requests:

**Header:**
```
Authorization: Bearer <token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:4000/api/protected-endpoint
```

---

## 🧪 Test Credentials

All passwords are: **`password123`**

| Email | Type | Description |
|-------|------|-------------|
| client@test.com | client | Client account |
| provider1@test.com | provider | Massage therapist |
| provider2@test.com | provider | Acupuncturist |
| space@test.com | space_owner | Space owner |

---

## 📝 Password Requirements

- Minimum 8 characters
- Contains at least one uppercase letter
- Contains at least one lowercase letter
- Contains at least one number

*These requirements are enforced on the frontend, but should be validated on backend in production.*

---

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt (10 salt rounds)
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiry**: 7 days by default (configurable via `JWT_EXPIRES_IN`)
4. **Email Uniqueness**: Email addresses must be unique across all user types
5. **Account Status**: Inactive accounts are blocked from login

---

## 🛠️ Middleware

### Authentication Middleware

Protect routes by adding middleware:

```javascript
const { authenticate } = require('./middleware/auth');

// Protected route
app.get('/api/protected', authenticate, (req, res) => {
  // req.user is now available
  res.json({ user: req.user });
});
```

### Authorization Middleware

Restrict routes to specific user types:

```javascript
const { authenticate, authorize } = require('./middleware/auth');

// Only providers can access this route
app.get('/api/providers/dashboard', 
  authenticate, 
  authorize('provider'), 
  (req, res) => {
    res.json({ message: 'Provider dashboard' });
  }
);

// Multiple roles
app.get('/api/admin', 
  authenticate, 
  authorize(['provider', 'space_owner']), 
  (req, res) => {
    res.json({ message: 'Admin area' });
  }
);
```

---

## 📊 Example Usage

### Test Login with cURL

```bash
# Login as client
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@test.com",
    "password": "password123"
  }'
```

### Test Login with JavaScript

```javascript
const axios = require('axios');

// Login
const response = await axios.post('http://localhost:4000/api/auth/login', {
  email: 'client@test.com',
  password: 'password123'
});

const { token, user } = response.data.data;

// Use token in subsequent requests
const profileResponse = await axios.get('http://localhost:4000/api/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## 🚀 Next Steps

Now that authentication is working, you can:

1. ✅ **Test the API** with the provided credentials
2. **Build profile endpoints** for each user type
3. **Implement protected routes** using the authentication middleware
4. **Add role-based access control** for different user types
5. **Build booking system** with authentication
6. **Add profile management** features

---

## 📂 Files Created

- `src/utils/jwt.js` - JWT token utilities
- `src/middleware/auth.js` - Authentication and authorization middleware
- `src/controllers/auth.js` - Auth controller with register/login logic
- `src/routes/auth.js` - Auth routes
- `test-auth.js` - Testing script

---

## ✨ Status

**Completed**: ✅ All authentication endpoints  
**Tested**: ✅ All credentials working  
**Ready**: ✅ For frontend integration

