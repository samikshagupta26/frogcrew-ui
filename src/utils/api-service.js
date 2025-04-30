import { mockData, createMockResponse, createMockError } from "../mock/data";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validate invitation token
 * @param {string} token - The invitation token
 * @returns {Promise<Object>} - Response from the API
 */
export async function validateInvitation(token) {
  await delay(500);
  // For mock purposes, accept any token
  return { data: createMockResponse({ email: "test@example.com" }) };
}

/**
 * Register user with token
 * @param {string} token - The invitation token
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} - Response from the API
 */
export async function registerUser(token, userData) {
  await delay(500);
  // For mock purposes, always succeed
  return { data: createMockResponse({ message: "Registration successful" }) };
}
