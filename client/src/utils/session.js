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
  return localStorage.getItem(SESSION_KEYS.isLoggedIn) === "true"
    && Boolean(localStorage.getItem("vivaMateToken"));
}

export function clearUserSession() {
  [
    SESSION_KEYS.isLoggedIn,
    SESSION_KEYS.userName,
    SESSION_KEYS.userEmail,
    SESSION_KEYS.university,
    SESSION_KEYS.program,
    SESSION_KEYS.semester,
    "vivaMateToken",
  ].forEach((key) => {
    localStorage.removeItem(key);
  });
}
