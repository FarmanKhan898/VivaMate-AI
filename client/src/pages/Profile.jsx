import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("vivaMateUserName") ||
      "Muhammad Farman"
  );

  const [email, setEmail] = useState(
    localStorage.getItem("vivaMateUserEmail") ||
      "student@vivamate.ai"
  );

  const [university, setUniversity] = useState(
    localStorage.getItem("vivaMateUniversity") ||
      "University of Engineering and Technology"
  );

  const [program, setProgram] = useState(
    localStorage.getItem("vivaMateProgram") ||
      "Data Science"
  );

  const [semester, setSemester] = useState(
    localStorage.getItem("vivaMateSemester") || "4th Semester"
  );

  const [saved, setSaved] = useState(false);

  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveProfile = (event) => {
    event.preventDefault();

    localStorage.setItem("vivaMateUserName", name);
    localStorage.setItem("vivaMateUserEmail", email);
    localStorage.setItem("vivaMateUniversity", university);
    localStorage.setItem("vivaMateProgram", program);
    localStorage.setItem("vivaMateSemester", semester);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="inner-page">
      <section className="page-intro-row">
        <div>
          <span className="page-eyebrow">ACCOUNT SETTINGS</span>
          <h2>Your profile</h2>
          <p>
            Manage your personal and academic information.
          </p>
        </div>
      </section>

      <section className="profile-page-grid">
        <div className="profile-overview-card">
          <div className="profile-cover">
            <div className="profile-cover-pattern" />
          </div>

          <div className="profile-overview-content">
            <div className="profile-large-avatar">{initials}</div>

            <h3>{name || "Your Name"}</h3>
            <p>{email}</p>

            <span className="profile-student-badge">
              Student Account
            </span>

            <div className="profile-overview-divider" />

            <div className="profile-stat-row">
              <div>
                <strong>6</strong>
                <span>Courses</span>
              </div>

              <div>
                <strong>18</strong>
                <span>Tasks Done</span>
              </div>

              <div>
                <strong>12</strong>
                <span>Day Streak</span>
              </div>
            </div>

            <button
              className="outline-full-button"
              onClick={() => navigate("/assistant")}
            >
              Ask AI Assistant
            </button>
          </div>
        </div>

        <div className="profile-form-card">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">PERSONAL INFORMATION</span>
              <h3>Edit your profile</h3>
            </div>

            {saved && (
              <span className="save-success">Saved successfully</span>
            )}
          </div>

          <form className="profile-form" onSubmit={saveProfile}>
            <div className="profile-form-grid">
              <label>
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                />
              </label>
            </div>

            <label>
              University
              <input
                type="text"
                value={university}
                onChange={(event) =>
                  setUniversity(event.target.value)
                }
                placeholder="Your university"
              />
            </label>

            <div className="profile-form-grid">
              <label>
                Program
                <input
                  type="text"
                  value={program}
                  onChange={(event) => setProgram(event.target.value)}
                  placeholder="Your program"
                />
              </label>

              <label>
                Semester
                <select
                  value={semester}
                  onChange={(event) =>
                    setSemester(event.target.value)
                  }
                >
                  <option>1st Semester</option>
                  <option>2nd Semester</option>
                  <option>3rd Semester</option>
                  <option>4th Semester</option>
                  <option>5th Semester</option>
                  <option>6th Semester</option>
                  <option>7th Semester</option>
                  <option>8th Semester</option>
                </select>
              </label>
            </div>

            <div className="profile-form-divider" />

            <div className="profile-preference-row">
              <div>
                <strong>Email notifications</strong>
                <p>Receive reminders about upcoming tasks.</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className="profile-preference-row">
              <div>
                <strong>AI study suggestions</strong>
                <p>Get personalized learning recommendations.</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className="profile-form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Profile;