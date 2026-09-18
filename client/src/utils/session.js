export const SESSION_KEYS = {
  isLoggedIn: "isLoggedIn",
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
  return localStorage.getItem(SESSION_KEYS.isLoggedIn) === "true";
}

export function clearUserSession() {
  Object.values(SESSION_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
