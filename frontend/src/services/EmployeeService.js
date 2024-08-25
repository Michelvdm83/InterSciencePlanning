import ApiService, { TOKEN_STORAGE_LOCATION } from "./ApiService.js";

export const EMPLOYEE_FUNCTION_STORAGE_LOCATION = "EMPLOYEE_FUNCTION";

export default class EmployeeService {
  static login(email, password) {
    return this.#requestToken("auth/login", email, password);
  }

  static #requestToken(url, email, password) {
    return ApiService.post(url, {
      email: email,
      password: password,
    })
      .then((response) => {
        const data = response.data;

        this.#setToken(data.token);
        this.#setEmployeeFunction(data.employee.function);

        return Promise.resolve({
          success: true,
          user: data.employee,
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  static #setToken(token) {
    localStorage.setItem(TOKEN_STORAGE_LOCATION, token);
  }

  static #setEmployeeFunction(employeeFunction) {
    const empFunction =
      employeeFunction === "SSP_TEAM_LEADER" ||
      employeeFunction === "FT_TEAM_LEADER"
        ? "TEAM_LEADER"
        : employeeFunction;
    localStorage.setItem(EMPLOYEE_FUNCTION_STORAGE_LOCATION, empFunction);
  }

  static logout() {
    localStorage.removeItem(TOKEN_STORAGE_LOCATION);
    localStorage.removeItem(EMPLOYEE_FUNCTION_STORAGE_LOCATION);
    window.location.reload();
  }

  static isLoggedIn() {
    return localStorage.getItem(TOKEN_STORAGE_LOCATION) !== null;
  }

  static getEmployeeFunction() {
    return localStorage.getItem(EMPLOYEE_FUNCTION_STORAGE_LOCATION);
  }

  static setUpAutoLogout() {
    const token = localStorage.getItem(TOKEN_STORAGE_LOCATION);

    if (token && token.split(".").length === 3) {
      const encodedPayload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(encodedPayload));

      if (decodedPayload && typeof decodedPayload.exp === "number") {
        const expirationTime = decodedPayload.exp * 1000;

        const currentTime = new Date().getTime();
        const timeRemaining = expirationTime - currentTime;

        if (timeRemaining <= 0) {
          this.logout();
        } else {
          setTimeout(() => this.logout(), timeRemaining);
        }
        return;
      }
    }
    this.logout();
  }
}
