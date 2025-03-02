// client/src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

// Create a new class to instantiate for a user
class AuthService {
  // Get user data from token
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  // Check if user is logged in
  loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return true
    return token && !this.isTokenExpired(token) ? true : false;
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } 
      return false;
    } catch (err) {
      return false;
    }
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Set token to localStorage and reload page
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Clear token from localStorage and reload page
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();