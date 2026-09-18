import { useEffect, useMemo, useState } from "react";

import { generatePracticeSet, getStoredSubjects } from "../utils/vivaData";

const colorMap = ["purple", "blue", "orange", "green", "pink", "indigo"];

function Courses() {
  const [subjects, setSubjects] = useState(() => getStoredSubjects());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [generator, setGenerator] = useState({
    subject: "Database Normalization",
    topic: "Database Normalization",
    difficulty: "Medium",
    language: "English",
  });
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    description: "",
    level: "Beginner",
  });

  useEffect(() => {
    localStorage.setItem("vivaMateSubjects", JSON.stringify(subjects));
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        (subject.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || subject.level === filter;

      return matchesSearch && matchesFilter;
    });
  }, [subjects, search, filter]);

  const handleSubjectChange = (event) => {
    const { name, value } = event.target;
    setSubjectForm((previous) => ({ ...previous, [name]: value }));
  };

  const resetSubjectForm = () => {
    setSubjectForm({ name: "", description: "", level: "Beginner" });
    setEditingId(null);
    setShowForm(false);
  };

  const saveSubject = (event) => {
    event.preventDefault();

    if (!subjectForm.name.trim()) {
      window.alert("Please enter a subject name.");
      return;
    }

    if (editingId) {
      setSubjects((previous) =>
        previous.map((subject) =>
          subject.id === editingId
            ? {
                ...subject,
                name: subjectForm.name.trim(),
                description: subjectForm.description.trim() || "No description yet.",
                level: subjectForm.level,
              }
            : subject
        )
      );
    } else {
      setSubjects((previous) => [
        {
          id: Date.now(),
          name: subjectForm.name.trim(),
          description: subjectForm.description.trim() || "No description yet.",
          level: subjectForm.level,
        },
        ...previous,
      ]);
    }

    resetSubjectForm();
  };

  const deleteSubject = (id) => {
    const shouldDelete = window.confirm("Delete this subject and its study content?");

    if (!shouldDelete) return;

    setSubjects((previous) => previous.filter((subject) => subject.id !== id));
  };

  const openEditForm = (subject) => {
    setEditingId(subject.id);
    setSubjectForm({
      name: subject.name,
      description: subject.description,
      level: subject.level,
    });
    setShowForm(true);
  };

  const generateAIContent = () => {
    if (!generator.subject.trim() || !generator.topic.trim()) {
      window.alert("Please enter both a subject and topic to generate AI content.");
      return;
    }

    const generated = generatePracticeSet(generator);
    const savedSets = JSON.parse(localStorage.getItem("vivaMateGeneratedSets") || "[]");

    localStorage.setItem(
      "vivaMateGeneratedSets",
      JSON.stringify([generated, ...savedSets].slice(0, 8))
    );
    localStorage.setItem("vivaMateLatestSet", JSON.stringify(generated));

    window.alert("AI-generated viva content has been created successfully.");
  };

  return (
    <div className="inner-page">
      <section className="page-intro-row">
        <div>
          <span className="page-eyebrow">YOUR LEARNING LIBRARY</span>
          <h2>Manage your subjects</h2>
          <p>Create topics, prepare viva prompts, and generate study material.</p>
        </div>

        <button className="primary-button" onClick={() => setShowForm(true)}>
          <span>+</span>
          Add Subject
        </button>
      </section>

      <section className="viva-generator-panel">
        <div className="generator-heading">
          <div>
            <span className="page-eyebrow">AI GENERATOR</span>
            <h3>Create viva practice content</h3>
          </div>
        </div>

        <div className="generator-grid">
          <label>
            Subject
            <input
              type="text"
              value={generator.subject}
              onChange={(event) =>
                setGenerator((previous) => ({ ...previous, subject: event.target.value }))
              }
              placeholder="Database Normalization"
            />
          </label>

          <label>
            Topic
            <input
              type="text"
              value={generator.topic}
              onChange={(event) =>
                setGenerator((previous) => ({ ...previous, topic: event.target.value }))
              }
              placeholder="Normalization forms"
            />
          </label>

          <label>
            Difficulty
            <select
              value={generator.difficulty}
              onChange={(event) =>
                setGenerator((previous) => ({ ...previous, difficulty: event.target.value }))
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <label>
            Language
            <select
              value={generator.language}
              onChange={(event) =>
                setGenerator((previous) => ({ ...previous, language: event.target.value }))
              }
            >
              <option>English</option>
              <option>Simple English</option>
              <option>Urdu</option>
              <option>Roman Urdu</option>
            </select>
          </label>
        </div>

        <div className="generator-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setGenerator({
                subject: "",
                topic: "",
                difficulty: "Medium",
                language: "English",
              })
            }
          >
            Reset
          </button>

          <button type="button" className="primary-button" onClick={generateAIContent}>
            Generate AI Questions
          </button>
        </div>
      </section>

      <section className="course-toolbar">
        <div className="page-search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {["All", "Beginner", "Intermediate", "Advanced"].map((item) => (
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

      <section className="courses-grid">
        {filteredSubjects.map((subject, index) => (
          <article className="course-card" key={subject.id}>
            <div className={`course-card-cover ${colorMap[index % colorMap.length]}`}>
              <div className="course-card-cover-top">
                <span className="course-code">{subject.level.slice(0, 2).toUpperCase()}</span>
                <button
                  className="course-more-button"
                  onClick={() => openEditForm(subject)}
                  title="Edit subject"
                >
                  ✎
                </button>
              </div>

              <div className="large-course-icon">{subject.name.slice(0, 2).toUpperCase()}</div>
              <div className="course-cover-pattern" />
            </div>

            <div className="course-card-body">
              <span className="course-status">{subject.level}</span>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>

              <div className="course-progress-header">
                <span>Ready for viva prep</span>
                <strong>AI</strong>
              </div>

              <div className="course-progress-bar">
                <span style={{ width: "78%" }} />
              </div>

              <div className="subject-actions">
                <button
                  className="course-continue-button"
                  onClick={() => {
                    const nextGenerator = {
                      subject: subject.name,
                      topic: subject.name,
                      difficulty: "Medium",
                      language: "English",
                    };
                    setGenerator(nextGenerator);
                    const generated = generatePracticeSet(nextGenerator);
                    const savedSets = JSON.parse(localStorage.getItem("vivaMateGeneratedSets") || "[]");
                    localStorage.setItem(
                      "vivaMateGeneratedSets",
                      JSON.stringify([generated, ...savedSets].slice(0, 8))
                    );
                    localStorage.setItem("vivaMateLatestSet", JSON.stringify(generated));
                    window.alert("Practice set prepared for this subject.");
                  }}
                >
                  Generate Questions
                  <span>→</span>
                </button>

                <button
                  type="button"
                  className="delete-task-button"
                  onClick={() => deleteSubject(subject.id)}
                  title="Delete subject"
                >
                  ×
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filteredSubjects.length === 0 && (
        <div className="empty-state">
          <div>⌕</div>
          <h3>No subjects found</h3>
          <p>Create a new subject and generate viva content.</p>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop" onClick={resetSubjectForm}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="page-eyebrow">SUBJECT SETUP</span>
                <h3>{editingId ? "Edit Subject" : "Create Subject"}</h3>
              </div>

              <button className="modal-close" onClick={resetSubjectForm}>×</button>
            </div>

            <form className="modal-form" onSubmit={saveSubject}>
              <label>
                Subject name
                <input
                  type="text"
                  name="name"
                  value={subjectForm.name}
                  onChange={handleSubjectChange}
                  placeholder="e.g. Database Systems"
                />
              </label>

              <label>
                Description
                <input
                  type="text"
                  name="description"
                  value={subjectForm.description}
                  onChange={handleSubjectChange}
                  placeholder="Short overview of the topic"
                />
              </label>

              <label>
                Level
                <select name="level" value={subjectForm.level} onChange={handleSubjectChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={resetSubjectForm}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? "Save Changes" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;