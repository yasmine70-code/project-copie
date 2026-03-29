# Stratégie de Tests Complète

## 🧪 Types de Tests

### 1. **Tests Unitaires**
```javascript
// __tests__/utils/auth.test.js
import { AuthService } from '../utils/auth';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = { email: 'admin@rssi.com', password: 'admin123' };
      
      const result = await AuthService.mockLogin(credentials.email, credentials.password);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const credentials = { email: 'wrong@email.com', password: 'wrongpass' };
      
      const result = await AuthService.mockLogin(credentials.email, credentials.password);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email ou mot de passe incorrect');
    });
  });

  describe('token validation', () => {
    it('should validate valid token', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const isValid = AuthService.isTokenValid(validToken);
      
      expect(isValid).toBe(true);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      const isValid = AuthService.isTokenValid(invalidToken);
      
      expect(isValid).toBe(false);
    });
  });
});
```

### 2. **Tests d'Intégration**
```javascript
// __tests__/integration/auth.test.js
import request from 'supertest';
import app from '../backend/server';

describe('Authentication Integration', () => {
  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@rssi.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@email.com',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### 3. **Tests E2E**
```javascript
// e2e/login.spec.js
import { by, device, element, expect } from 'detox';

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('admin@rssi.com');
    await element(by.id('password-input')).typeText('admin123');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.id('user-name'))).toHaveText('Administrateur');
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@email.com');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('error-message'))).toBeVisible();
  });
});
```

## 📊 Couverture de Code

### Configuration Jest
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};
```

### Scripts de Test
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "detox test",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## 🔍 Tests de Performance

### Performance Testing
```javascript
// __tests__/performance/animations.test.js
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

describe('Animation Performance', () => {
  it('should render animations within 16ms frame', async () => {
    const startTime = performance.now();
    
    const { getByTestId } = render(<HomeScreen />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 60fps (16ms per frame)
    expect(renderTime).toBeLessThan(16);
  });

  it('should not cause memory leaks', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Render and unmount multiple times
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<HomeScreen />);
      unmount();
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
  });
});
```

## 🤖 Tests d'API

### API Testing
```javascript
// __tests__/api/members.test.js
import request from 'supertest';
import app from '../backend/server';

describe('Members API', () => {
  let authToken;

  beforeAll(async () => {
    // Get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@rssi.com', password: 'admin123' });
    
    authToken = response.body.token;
  });

  describe('GET /api/members', () => {
    it('should return all members for authenticated user', async () => {
      const response = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('members');
      expect(Array.isArray(response.body.members)).toBe(true);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/members');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/members', () => {
    it('should create new member', async () => {
      const memberData = {
        name: 'Test User',
        email: 'test@example.com',
        device: 'Test Device'
      };

      const response = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${authToken}`)
        .send(memberData);

      expect(response.status).toBe(201);
      expect(response.body.member).toHaveProperty('id');
      expect(response.body.member.name).toBe(memberData.name);
    });
  });
});
```

## 📋 Tests d'Accessibilité

### Accessibility Testing
```javascript
// __tests__/accessibility/login.test.js
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

describe('Login Accessibility', () => {
  it('should have accessible labels', () => {
    const { getByLabelText } = render(<LoginScreen />);
    
    expect(getByLabelText('Email professionnel')).toBeTruthy();
    expect(getByLabelText('Mot de passe')).toBeTruthy();
    expect(getByLabelText('Se connecter')).toBeTruthy();
  });

  it('should announce errors to screen readers', async () => {
    const { getByLabelText, getByRole } = render(<LoginScreen />);
    
    fireEvent.changeText(getByLabelText('Email professionnel'), 'wrong@email.com');
    fireEvent.changeText(getByLabelText('Mot de passe'), 'wrongpass');
    fireEvent.press(getByLabelText('Se connecter'));
    
    const errorMessage = getByRole('alert');
    expect(errorMessage).toBeTruthy();
  });
});
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  e2e:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Setup Expo
      uses: expo/expo-github-action@v8
      with:
        expo-version: latest
        token: ${{ secrets.EXPO_TOKEN }}
    
    - name: Run E2E tests
      run: npm run test:e2e
```
