/**
 * Authentication service running entirely on the client side with localStorage.
 * Hashes passwords with Web Crypto SHA-256 before saving.
 */

import { getItem, setItem, removeItem, STORAGE_KEYS, initializeStorageIfEmpty } from './storage';
import { hashPassword } from '../utils/crypto';

// Initialize storage on first access
initializeStorageIfEmpty();

export const authService = {
  /**
   * Retrieves all registered users.
   */
  async listUsers() {
    return getItem(STORAGE_KEYS.USERS, []);
  },

  /**
   * Finds a user by ID.
   */
  async getUserById(id) {
    const users = await this.listUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * Finds a user by username or phone.
   */
  async findByUsername(username) {
    const users = await this.listUsers();
    const clean = username.trim().toLowerCase();
    return users.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    ) || null;
  },

  /**
   * Signs up a new user with SHA-256 hashed password.
   */
  async signup({ institutionName, contactName, phone, userType, username, password }) {
    initializeStorageIfEmpty();
    const users = await this.listUsers();

    const normalizedUsername = username.trim().toLowerCase();
    const existing = users.find((u) => u.username.toLowerCase() === normalizedUsername);
    if (existing) {
      throw new Error(`Username "${username}" is already taken. Please choose another.`);
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      institutionName: institutionName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      userType, // 'donor' | 'receiver'
      username: username.trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    setItem(STORAGE_KEYS.SESSION, newUser.id);

    // Return sanitized user object
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  /**
   * Validates credentials and initializes session.
   */
  async login(identifier, password) {
    initializeStorageIfEmpty();
    const users = await this.listUsers();
    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = users.find(
      (u) =>
        u.username.toLowerCase() === cleanIdentifier ||
        u.phone.replace(/\D/g, '') === cleanIdentifier.replace(/\D/g, '')
    );

    if (!user) {
      throw new Error('No account found with this username or phone.');
    }

    const inputHash = await hashPassword(password);
    if (user.passwordHash !== inputHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    setItem(STORAGE_KEYS.SESSION, user.id);

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Gets the currently authenticated user from session.
   */
  async getCurrentUser() {
    initializeStorageIfEmpty();
    const sessionId = getItem(STORAGE_KEYS.SESSION);
    if (!sessionId) return null;

    const user = await this.getUserById(sessionId);
    if (!user) {
      removeItem(STORAGE_KEYS.SESSION);
      return null;
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Logs out the current session.
   */
  async logout() {
    removeItem(STORAGE_KEYS.SESSION);
    return true;
  },
};

