import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("vivaMateUserName") || "Student";

  const tasks = useMemo(() => {
    const savedTasks = localStorage.getItem("vivaMateTasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [
      {
        id: 1,
        title: "Data Structures Assignment",
        course: "Data Structures",
        due: "Tomorrow",
        priority: "High",
        completed: false,
      },
      {
        id: 2,
        title: "Operating Systems Quiz",
        course: "Operating Systems",
        due: "Friday",
        priority: "Medium",
        completed: false,
      },
      {
        id: 3,
        title: "Database Report",
        course: "Database Systems",
        due: "Next week",
        priority: "Low",
        completed: true,
      },
    ];
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
          <span className="stat-label">Study Hours</span>
          <strong className="stat-value">{(generatedSets.length * 3.5 + 18).toFixed(1)}h</strong>
          <p>This week</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon blue">✓</div>
            <span className="stat-change positive">+8.2%</span>
          </div>
          <span className="stat-label">Completed Tasks</span>
          <strong className="stat-value">{completedTasks + Math.max(5, history.length)}</strong>
          <p>Across all courses</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon orange">▤</div>
            <span className="stat-change neutral">Active</span>
          </div>
          <span className="stat-label">Active Subjects</span>
          <strong className="stat-value">{subjects.length || 5}</strong>
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
                Study hours
              </span>
              <span>
                <i className="legend-dot gray-dot" />
                Target
              </span>
            </div>
          </div>

          <div className="activity-chart">
            <div className="chart-y-axis">
              <span>8h</span>
              <span>6h</span>
              <span>4h</span>
              <span>2h</span>
              <span>0h</span>
            </div>

            <div className="chart-area">
              <div className="chart-grid-line line-one" />
              <div className="chart-grid-line line-two" />
              <div className="chart-grid-line line-three" />
              <div className="chart-grid-line line-four" />
              <div className="chart-grid-line line-five" />

              <div className="chart-bars">
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "42%" }} />
                  <span>Mon</span>
                </div>
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "68%" }} />
                  <span>Tue</span>
                </div>
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "54%" }} />
                  <span>Wed</span>
                </div>
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "82%" }} />
                  <span>Thu</span>
                </div>
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "64%" }} />
                  <span>Fri</span>
                </div>
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "35%" }} />
                  <span>Sat</span>
                </div>
                <div className="bar-column">
                  <div className="bar-value" style={{ height: "25%" }} />
                  <span>Sun</span>
                </div>
              </div>
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

          <div className="circular-progress">
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
            {tasks.slice(0, 3).map((task) => (
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
            {(subjects.length ? subjects : [
              { id: 1, name: 'Database Normalization', description: 'AI practice set ready' },
              { id: 2, name: 'Operating Systems', description: 'Current revision plan' },
              { id: 3, name: 'Data Structures', description: 'Mock viva scheduled' },
            ]).slice(0, 3).map((subject, index) => (
              <div className="recent-course-item" key={subject.id || index}>
                <div className={`course-color-icon ${index % 3 === 0 ? 'purple-bg' : index % 3 === 1 ? 'blue-bg' : 'orange-bg'}`}>
                  {subject.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="recent-course-info">
                  <strong>{subject.name}</strong>
                  <span>{subject.description}</span>
                  <div className="small-progress">
                    <span style={{ width: `${55 + index * 15}%` }} />
                  </div>
                </div>
                <strong className="course-percent">{55 + index * 15}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;