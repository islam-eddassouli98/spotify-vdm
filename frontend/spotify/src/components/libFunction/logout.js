export function logout() {
    const token = window.localStorage.removeItem("token");
    window.location.href = "/";

  }