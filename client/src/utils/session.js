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

export function isUserLoggedIn() {
  return localStorage.getItem(SESSION_KEYS.isLoggedIn) === "true" &&
    Boolean(localStorage.getItem(SESSION_KEYS.token));
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
