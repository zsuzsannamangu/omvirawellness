# Frontend Auth Integration Guide

## How to Connect Frontend to Backend Authentication

### Current Frontend Routes (Keep These!)
- `/login` - Client login page
- `/providers/login` - Provider login page  
- `/spaces/login` - Space owner login page

### New Backend API Endpoints
- `POST http://localhost:4000/api/auth/login` - Universal login

### Integration Strategy

Create a centralized authentication service that all three frontend pages use:

**Step 1: Create Auth Service**

Create `frontend/src/services/auth.js`:

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    
    // Store token
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function registerClient(data) {
  const response = await axios.post(`${API_URL}/register/client`, data);
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  return response.data.data;
}

export async function registerProvider(data) {
  const response = await axios.post(`${API_URL}/register/provider`, data);
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  return response.data.data;
}

export async function registerSpaceOwner(data) {
  const response = await axios.post(`${API_URL}/register/space-owner`, data);
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  return response.data.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
```

**Step 2: Update Client Login Page**

`frontend/src/app/login/page.tsx`:

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { user } = await login(email, password);
      
      // Redirect based on user type
      if (user.user_type === 'client') {
        router.push('/dashboard');
      } else if (user.user_type === 'provider') {
        router.push('/providers/dashboard');
      } else if (user.user_type === 'space_owner') {
        router.push('/spaces/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    // ... your existing login form
  );
}
```

**Step 3: Update Provider Login Page**

`frontend/src/app/providers/login/page.tsx`:

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function ProviderLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { user } = await login(email, password);
      
      // Verify it's a provider
      if (user.user_type !== 'provider') {
        setError('This account is not a provider account');
        return;
      }
      
      router.push('/providers/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    // ... your existing provider login form
  );
}
```

**Step 4: Update Space Owner Login Page**

`frontend/src/app/spaces/login/page.tsx`:

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function SpaceLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { user } = await login(email, password);
      
      // Verify it's a space owner
      if (user.user_type !== 'space_owner') {
        setError('This account is not a space owner account');
        return;
      }
      
      router.push('/spaces/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    // ... your existing space login form
  );
}
```

## Summary

**What stays the same:**
- ✅ All your frontend login pages remain separate
- ✅ Each route handles its own UI and validation
- ✅ Users land on the correct login page based on intent

**What connects them:**
- 🔗 All three pages call the SAME backend API: `POST /api/auth/login`
- 🔗 Backend returns `user_type` in response
- 🔗 Frontend redirects based on `user_type`

**Benefits:**
- Single source of truth (one backend endpoint)
- Consistent authentication logic
- Each frontend page can add type-specific validation
- Clean separation of concerns

## Quick Test

```bash
# Test client login from client@test.com / password123
# Should redirect to /dashboard

# Test provider login from provider1@test.com / password123  
# Should redirect to /providers/dashboard

# Test space login from space@test.com / password123
# Should redirect to /spaces/dashboard
```

