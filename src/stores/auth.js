import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.role === "ADMIN",
  },

  actions: {
    async login(email, password) {
      // Accept any credentials and create a mock user
      const mockUser = {
        userId: Date.now().toString(),
        role: email.toLowerCase().includes("admin") ? "ADMIN" : "CREW",
        firstName: email.split("@")[0],
      };

      const mockToken = "mock-token-" + Date.now();

      // Save user and token data
      this.user = mockUser;
      this.token = mockToken;

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", mockToken);

      return { success: true, message: "Login successful" };
    },

    logout() {
      // Clear user data
      this.user = null;
      this.token = null;

      // Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
