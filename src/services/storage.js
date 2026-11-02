/**
 * LocalStorage Service with robust error handling and self-healing.
 * UI components must NEVER touch localStorage directly.
 */

import { getInitialSeedData } from '../data/seed';

export const STORAGE_KEYS = {
  USERS: 'anjappam_users',
  DONATIONS: 'anjappam_donations',
  REQUESTS: 'anjappam_requests',
  SESSION: 'anjappam_session',
};

/**
 * Initializes localStorage with seed data if keys are absent or corrupted.
 */
export function initializeStorageIfEmpty() {
  try {
    const seed = getInitialSeedData();

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seed.users));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(seed.donations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(seed.requests));
    }
  } catch (error) {
    console.error('Storage initialization failed, resetting storage:', error);
    resetToSeedData();
  }
}

/**
 * Resets all keys to fresh seed data.
 */
export function resetToSeedData() {
  try {
    const seed = getInitialSeedData();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seed.users));
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(seed.donations));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(seed.requests));
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return seed;
  } catch (error) {
    console.error('Failed to reset storage:', error);
    return null;
  }
}

/**
 * Generic getItem with JSON parse and fallback.
 */
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Corrupted localStorage entry for key "${key}". Resetting to fallback.`, err);
    return fallback;
  }
}

/**
 * Generic setItem with JSON stringify.
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write to localStorage for key "${key}":`, err);
    return false;
  }
}

/**
 * Generic removeItem.
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Failed to remove key "${key}":`, err);
    return false;
  }
}

