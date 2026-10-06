export const SESSION_KEYS = {
  isLoggedIn: "isLoggedIn",
  token: "vivaMateToken",
  userName: "vivaMateUserName",
  userEmail: "vivaMateUserEmail",
  university: "vivaMateUniversity",
  program: "vivaMateProgram",
  semester: "vivaMateSemester",
  theme: "vivaMateTheme",
  tasks: "vivaMateTasks",
  courses: "vivaMateCourses",
  chat: "vivaMateChatMessages",
};

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function isUserLoggedIn() {
  const token = localStorage.getItem(SESSION_KEYS.token);
  if (!token || localStorage.getItem(SESSION_KEYS.isLoggedIn) !== "true") return false;
  if (isTokenExpired(token)) {
    clearUserSession();
    return false;
  }
  return true;
}

export function readStoredJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function clearUserSession() {
  Object.values(SESSION_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
