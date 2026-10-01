import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("vivaMateUserName") || "Student";

  const tasks = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("vivaMateTasks") || "[]");
    } catch {
      return [];
    }
  }, []);

  const history = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("vivaMateHistory") || "[]");
    } catch {
      return [];
    }
  }, []);

  const subjects = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("vivaMateSubjects") || "[]");
    } catch {
      return [];
    }
  }, []);

  const generatedSets = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("vivaMateGeneratedSets") || "[]");
    } catch {
      return [];
    }
  }, []);

  const weeklyActivity = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = date.toLocaleDateString();
      return {
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        count: history.filter((entry) => {
          const entryDate = new Date(entry.date);
          return !Number.isNaN(entryDate.getTime()) && entryDate.toLocaleDateString() === dateKey;
        }).length,
      };
    });
  }, [history]);
  const activityMaximum = Math.max(...weeklyActivity.map((day) => day.count), 1);
  const weeklyAttempts = weeklyActivity.reduce((total, day) => total + day.count, 0);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const averageScore = history.length
    ? Math.round(history.reduce((total, item) => total + item.score, 0) / history.length)
    : 0;
  const progress = Math.min(
    100,
    Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)
  );

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome-card">
        <div>
          <span className="welcome-label">YOUR LEARNING SPACE</span>
          <h2>
            Keep moving forward,
            <br />
            {userName.split(" ")[0]}.
          </h2>
          <p>
            Small consistent steps lead to meaningful progress.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/assistant")}
          >
            Ask VivaMate AI <span>✦</span>
          </button>
        </div>

        <div className="welcome-illustration">
          <div className="illustration-orbit orbit-one" />
          <div className="illustration-orbit orbit-two" />
          <div className="illustration-core">✦</div>
          <span className="illustration-star star-one">✦</span>
          <span className="illustration-star star-two">✧</span>
          <span className="illustration-star star-three">+</span>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon purple">◷</div>
            <span className="stat-change positive">+12.5%</span>
          </div>
          <span className="stat-label">Practice Sessions</span>
          <strong className="stat-value">{history.length}</strong>
          <p>Recorded quiz attempts</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon blue">✓</div>
            <span className="stat-change neutral">To date</span>
          </div>
          <span className="stat-label">Completed Tasks</span>
          <strong className="stat-value">{completedTasks}</strong>
          <p>Across all courses</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon orange">▤</div>
            <span className="stat-change neutral">Active</span>
          </div>
          <span className="stat-label">Active Subjects</span>
          <strong className="stat-value">{subjects.length}</strong>
          <p>Currently enrolled</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon green">✦</div>
            <span className="stat-change positive">{averageScore >= 75 ? 'Excellent' : 'Strong'}</span>
          </div>
          <span className="stat-label">Average Score</span>
          <strong className="stat-value">{averageScore}%</strong>
          <p>Mock viva progress</p>
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel progress-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">PERFORMANCE</span>
              <h3>Weekly Activity</h3>
            </div>

            <select defaultValue="This Week">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="chart-summary">
            <div>
              <strong>{progress}%</strong>
              <span>Overall progress</span>
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-dot purple-dot" />
                Quiz attempts
              </span>
            </div>
          </div>

          <div className="activity-chart">
            <div className="chart-y-axis">
              <span>{activityMaximum}</span>
              <span>{Math.ceil(activityMaximum * 0.75)}</span>
              <span>{Math.ceil(activityMaximum * 0.5)}</span>
              <span>{Math.ceil(activityMaximum * 0.25)}</span>
              <span>0</span>
            </div>

            <div className="chart-area">
              <div className="chart-grid-line line-one" />
              <div className="chart-grid-line line-two" />
              <div className="chart-grid-line line-three" />
              <div className="chart-grid-line line-four" />
              <div className="chart-grid-line line-five" />

              {weeklyAttempts === 0 ? (
                <div className="chart-empty-state">No quiz activity yet. Complete a practice quiz to see your weekly progress.</div>
              ) : (
                <div className="chart-bars">
                  {weeklyActivity.map((day) => (
                    <div className="bar-column" key={day.label} title={`${day.count} attempts`}>
                      <div className={`bar-value ${day.count === 0 ? "empty" : ""}`} style={{ height: `${(day.count / activityMaximum) * 82}%` }} />
                      <span>{day.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-panel goal-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">YOUR GOAL</span>
              <h3>Study Progress</h3>
            </div>
            <span className="panel-menu">•••</span>
          </div>

          <div className="circular-progress" style={{ "--progress-angle": `${progress * 3.6}deg` }}>
            <div className="circular-progress-inner">
              <strong>{progress}%</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="goal-details">
            <div>
              <span className="goal-detail-dot purple-dot" />
              <span>Generated sets</span>
              <strong>{generatedSets.length}</strong>
            </div>
            <div>
              <span className="goal-detail-dot blue-dot" />
              <span>History sessions</span>
              <strong>{history.length}</strong>
            </div>
          </div>

          <button
            className="outline-full-button"
            onClick={() => navigate("/courses")}
          >
            View Course Progress
          </button>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel tasks-preview-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">STAY ORGANIZED</span>
              <h3>Upcoming Tasks</h3>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/tasks")}
            >
              View all →
            </button>
          </div>

          <div className="dashboard-task-list">
            {tasks.filter((task) => !task.completed).slice(0, 3).map((task) => (
              <div className="dashboard-task-item" key={task.id}>
                <div
                  className={`task-status-icon ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  {task.completed ? "✓" : "◷"}
                </div>

                <div className="dashboard-task-content">
                  <strong>{task.title}</strong>
                  <span>
                    {task.course} • Due {task.due}
                  </span>
                </div>

                <span
                  className={`priority-badge ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
            {tasks.filter((task) => !task.completed).length === 0 && (
              <p className="dashboard-empty-note">No pending tasks yet. Add a task to plan your next study session.</p>
            )}
          </div>
        </div>

        <div className="dashboard-panel courses-preview-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">CONTINUE LEARNING</span>
              <h3>Recent Subjects</h3>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/courses")}
            >
              View all →
            </button>
          </div>

          <div className="recent-course-list">
            {subjects.slice(0, 3).map((subject, index) => (
              <div className="recent-course-item" key={subject.id || index}>
                <div className={`course-color-icon ${index % 3 === 0 ? 'purple-bg' : index % 3 === 1 ? 'blue-bg' : 'orange-bg'}`}>
                  {subject.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="recent-course-info">
                  <strong>{subject.name}</strong>
                  <span>{subject.description}</span>
                </div>
              </div>
            ))}
            {subjects.length === 0 && (
              <p className="dashboard-empty-note">No courses yet. Add a course to start tracking your learning.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
