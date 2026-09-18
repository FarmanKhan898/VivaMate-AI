import { useMemo } from "react";

function History() {
  const history = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("vivaMateHistory") || "[]");
    } catch {
      return [];
    }
  }, []);

  const totalScore = history.length
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
    : 0;

  return (
    <div className="inner-page">
      <section className="page-intro-row">
        <div>
          <span className="page-eyebrow">LEARNING HISTORY</span>
          <h2>Progress and performance</h2>
          <p>Track your mock viva scores, study momentum, and activity over time.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon purple">◷</div>
            <span className="stat-change positive">Live</span>
          </div>
          <span className="stat-label">Sessions</span>
          <strong className="stat-value">{history.length}</strong>
          <p>Recorded practice sets</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon blue">✦</div>
            <span className="stat-change positive">Average</span>
          </div>
          <span className="stat-label">Score</span>
          <strong className="stat-value">{totalScore}%</strong>
          <p>Across all performances</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon green">✓</div>
            <span className="stat-change positive">Strong</span>
          </div>
          <span className="stat-label">Best Result</span>
          <strong className="stat-value">
            {history.length ? Math.max(...history.map((item) => item.score)) : 0}%
          </strong>
          <p>Top mock viva score</p>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-eyebrow">ACTIVITY LOG</span>
            <h3>Recent history</h3>
          </div>
        </div>

        <div className="tasks-table-panel">
          <div className="tasks-table">
            <div className="tasks-table-row tasks-table-head">
              <span>Subject</span>
              <span>Type</span>
              <span>Date</span>
              <span>Score</span>
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <div>◷</div>
                <h3>No study history yet</h3>
                <p>Complete a mock viva to populate your learning history.</p>
              </div>
            ) : (
              history.map((entry) => (
                <div className="tasks-table-row" key={entry.id || `${entry.date}-${entry.subject}`}>
                  <strong>{entry.subject || "General Topic"}</strong>
                  <span>{entry.activityType || "Mock Viva"}</span>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <strong>{entry.score}%</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default History;
