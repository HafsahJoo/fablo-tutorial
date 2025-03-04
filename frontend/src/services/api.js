/**
 * API service for interacting with the backend
 */
import axios from 'axios';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Key-Value API functions
 */
export const kvApi = {
  /**
   * Get a value from the blockchain by key
   * @param {string} key - The key to retrieve
   * @returns {Promise} - The API response
   */
  getValue: async (key) => {
    try {
      const response = await apiClient.get(`/kv/${key}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { error: 'Key not found' };
      }
      throw error;
    }
  },

  /**
   * Store a key-value pair in the blockchain
   * @param {string} key - The key to store
   * @param {string} value - The value to store
   * @returns {Promise} - The API response
   */
  putValue: async (key, value) => {
    try {
      const response = await apiClient.post('/kv', { key, value });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Store a private message in the blockchain
   * @param {string} collection - The collection name
   * @param {string} message - The message to store
   * @returns {Promise} - The API response
   */
  putPrivateMessage: async (collection, message) => {
    try {
      const response = await apiClient.post('/kv/private', { collection, message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a private message from the blockchain
   * @param {string} collection - The collection name
   * @returns {Promise} - The API response
   */
  getPrivateMessage: async (collection) => {
    try {
      const response = await apiClient.get(`/kv/private/${collection}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify a private message in the blockchain
   * @param {string} collection - The collection name
   * @param {string} message - The message to verify
   * @returns {Promise} - The API response
   */
  verifyPrivateMessage: async (collection, message) => {
    try {
      const response = await apiClient.post('/kv/private/verify', { collection, message });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return { verified: false, message: 'Verification failed' };
      }
      throw error;
    }
  },
};

// Health check API
export const healthApi = {
  check: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
  kv: kvApi,
  health: healthApi,
};