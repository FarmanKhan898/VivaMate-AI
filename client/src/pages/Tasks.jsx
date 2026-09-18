import { useEffect, useMemo, useState } from "react";

const initialTasks = [
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

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("vivaMateTasks");

    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    course: "",
    due: "",
    priority: "Medium",
  });

  useEffect(() => {
    localStorage.setItem(
      "vivaMateTasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.course.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, filter, search]);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const toggleTask = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) return;

    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const handleNewTaskChange = (event) => {
    const { name, value } = event.target;

    setNewTask((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addTask = (event) => {
    event.preventDefault();

    if (!newTask.title.trim() || !newTask.course.trim()) {
      window.alert("Please enter the task title and course.");
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title.trim(),
      course: newTask.course.trim(),
      due: newTask.due || "No deadline",
      priority: newTask.priority,
      completed: false,
    };

    setTasks((previous) => [task, ...previous]);

    setNewTask({
      title: "",
      course: "",
      due: "",
      priority: "Medium",
    });

    setShowModal(false);
  };

  return (
    <div className="inner-page">
      <section className="page-intro-row">
        <div>
          <span className="page-eyebrow">PRODUCTIVITY CENTER</span>
          <h2>Stay on top of your tasks</h2>
          <p>
            Organize assignments, deadlines, and academic goals.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <span>+</span>
          Add New Task
        </button>
      </section>

      <section className="task-summary-grid">
        <div className="task-summary-card">
          <div className="summary-icon purple">▤</div>
          <div>
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>
        </div>

        <div className="task-summary-card">
          <div className="summary-icon orange">◷</div>
          <div>
            <span>Pending Tasks</span>
            <strong>{tasks.length - completedCount}</strong>
          </div>
        </div>

        <div className="task-summary-card">
          <div className="summary-icon green">✓</div>
          <div>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

        <div className="task-summary-card">
          <div className="summary-icon blue">✦</div>
          <div>
            <span>Completion Rate</span>
            <strong>
              {tasks.length
                ? Math.round((completedCount / tasks.length) * 100)
                : 0}
              %
            </strong>
          </div>
        </div>
      </section>

      <section className="task-toolbar">
        <div className="page-search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {["All", "Pending", "Completed"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="tasks-table-panel">
        <div className="tasks-table-header">
          <div>
            <span className="panel-eyebrow">TASK LIST</span>
            <h3>Your assignments and reminders</h3>
          </div>
          <span className="task-count">
            {filteredTasks.length} tasks
          </span>
        </div>

        <div className="tasks-table">
          <div className="tasks-table-row tasks-table-head">
            <span>Task</span>
            <span>Course</span>
            <span>Deadline</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {filteredTasks.map((task) => (
            <div
              className={`tasks-table-row ${
                task.completed ? "task-is-completed" : ""
              }`}
              key={task.id}
            >
              <div className="task-title-cell">
                <button
                  className={`task-checkbox ${
                    task.completed ? "checked" : ""
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? "✓" : ""}
                </button>

                <strong>{task.title}</strong>
              </div>

              <span className="table-course-name">
                {task.course}
              </span>

              <span className="task-due-date">{task.due}</span>

              <span
                className={`priority-badge ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              <span
                className={`task-status-text ${
                  task.completed ? "done" : "pending"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>

              <button
                className="delete-task-button"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="table-empty-state">
              <span>✓</span>
              <strong>No tasks found</strong>
              <p>Add a new task or change your filter.</p>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="page-eyebrow">TASK CREATOR</span>
                <h3>Add a new task</h3>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={addTask}>
              <label>
                Task title
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Complete DSA assignment"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                />
              </label>

              <label>
                Course
                <input
                  type="text"
                  name="course"
                  placeholder="e.g. Data Structures"
                  value={newTask.course}
                  onChange={handleNewTaskChange}
                />
              </label>

              <div className="modal-form-grid">
                <label>
                  Deadline
                  <input
                    type="text"
                    name="due"
                    placeholder="e.g. Tomorrow"
                    value={newTask.due}
                    onChange={handleNewTaskChange}
                  />
                </label>

                <label>
                  Priority
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleNewTaskChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;