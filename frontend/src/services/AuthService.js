const API_URL = "http://localhost/System_integ/backend/auth/";

const AuthService = {
  async login(email, password) {
    try {
      const res = await fetch(`${API_URL}login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch {
      return { success: false, message: "Connection failed" };
    }
  },

  async signup(data) {
    try {
      const res = await fetch(`${API_URL}signup.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, message: "Signup failed" };
    }
  },
};

export default AuthService;
