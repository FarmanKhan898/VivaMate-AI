import { useMemo, useRef, useState } from "react";

const STORAGE_KEY = "vivaMateDocuments";

const DEMO_DOCUMENTS = [
  {
    id: "demo-1",
    name: "Database Normalization.pdf",
    subject: "Database Systems",
    type: "PDF",
    size: "2.40 MB",
    status: "Ready",
    uploadedAt: "Today",
  },
  {
    id: "demo-2",
    name: "Operating Systems Notes.pdf",
    subject: "Operating Systems",
    type: "PDF",
    size: "1.80 MB",
    status: "Ready",
    uploadedAt: "Yesterday",
  },
];

const DEFAULT_GENERATED_SET = {
  summary: "",
  keyPoints: [],
  flashcards: [],
  mcqs: [],
  vivaQuestions: [],
};

function Documents() {
  const fileInputRef = useRef(null);
  const studyFileInputRef = useRef(null);

  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : DEMO_DOCUMENTS;
    } catch (error) {
      console.error("Error loading documents:", error);
      return DEMO_DOCUMENTS;
    }
  });

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [studySubject, setStudySubject] = useState("");
  const [studyTopic, setStudyTopic] = useState("");
  const [studyContent, setStudyContent] = useState("");
  const [studyFile, setStudyFile] = useState(null);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [language, setLanguage] = useState("English");
  const [activeTab, setActiveTab] = useState("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [generatedStudy, setGeneratedStudy] = useState(DEFAULT_GENERATED_SET);

  const saveDocuments = (updatedDocuments) => {
    setDocuments(updatedDocuments);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedDocuments)
    );
  };

  const subjectOptions = useMemo(() => {
    const uniqueSubjects = documents
      .map((document) => document.subject)
      .filter(Boolean);

    return ["Database Systems", "Operating Systems", "Software Engineering", ...new Set(uniqueSubjects)];
  }, [documents]);

  const subjects = useMemo(() => {
    const uniqueSubjects = documents
      .map((document) => document.subject)
      .filter(Boolean);

    return ["All", ...new Set(uniqueSubjects)];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return documents.filter((document) => {
      const matchesSearch =
        document.name.toLowerCase().includes(searchTerm) ||
        document.subject.toLowerCase().includes(searchTerm);

      const matchesSubject =
        subjectFilter === "All" ||
        document.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [documents, search, subjectFilter]);

  const readyDocuments = documents.filter(
    (document) => document.status === "Ready"
  ).length;

  const openModal = () => {
    setShowModal(true);
    setSelectedFile(null);
    setTitle("");
    setSubject("");
    setError("");
  };

  const closeModal = () => {
    if (isUploading) return;

    setShowModal(false);
    setSelectedFile(null);
    setTitle("");
    setSubject("");
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const fileName = file.name.toLowerCase();

    const isValidType = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isValidType) {
      setSelectedFile(null);
      setError("Only PDF, DOCX, and TXT files are allowed.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setSelectedFile(null);
      setError("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
    setError("");

    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a document.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    setError("");
    setIsUploading(true);

    setTimeout(() => {
      const extension = selectedFile.name
        .split(".")
        .pop()
        .toUpperCase();

      const newDocument = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
        name: `${title.trim()}.${extension.toLowerCase()}`,
        subject: subject.trim(),
        type: extension,
        size: `${(
          selectedFile.size /
          (1024 * 1024)
        ).toFixed(2)} MB`,
        status: "Ready",
        uploadedAt: "Just now",
      };

      saveDocuments([newDocument, ...documents]);

      setIsUploading(false);
      closeModal();
    }, 700);
  };

  const handleDelete = (id) => {
    const documentToDelete = documents.find(
      (document) => document.id === id
    );

    if (!documentToDelete) return;

    const confirmed = window.confirm(
      `Delete "${documentToDelete.name}"?`
    );

    if (!confirmed) return;

    const updatedDocuments = documents.filter(
      (document) => document.id !== id
    );

    saveDocuments(updatedDocuments);
  };

  const handleOpenDocument = (document) => {
    window.alert(
      `${document.name}\n\n` +
        `Subject: ${document.subject}\n` +
        `Status: ${document.status}\n\n` +
        "Document analysis will be connected in the next phase."
    );
  };

  const handleStudyFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const fileName = file.name.toLowerCase();
    const isValidType = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isValidType) {
      setGenerationError("Only PDF, DOCX, and TXT files are allowed for study generation.");
      setStudyFile(null);
      return;
    }

    setStudyFile(file);
    setGenerationError("");

    if (fileName.endsWith(".txt")) {
      try {
        const text = await file.text();
        if (!studyContent.trim()) {
          setStudyContent(text.slice(0, 2500));
        }
      } catch (error) {
        console.error("Failed to read uploaded text file:", error);
      }
    }
  };

  const buildGeneratedMaterial = (sourceText, topic, subjectName, level, languageChoice) => {
    const cleanedText = sourceText
      .replace(/\s+/g, " ")
      .trim();

    const sentences = cleanedText
      .split(/[.!?]+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 5);

    const keywordPool = cleanedText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .filter((word, index, array) => array.indexOf(word) === index);

    const fallbackTerms = ["core concept", "main idea", "important detail", "real-world example"];
    const keyPoints = (sentences.length ? sentences : [
      `${topic} is a key topic in ${subjectName}.`,
      `Focus on the relationship between theory and practical application.`,
      `Use examples or diagrams to strengthen your understanding.`
    ]).map((sentence, index) => `${index + 1}. ${sentence}`);

    const flashcards = (keywordPool.length ? keywordPool : ["structure", "process", "analysis", "summary"])
      .slice(0, 4)
      .map((term, index) => ({
        front: `${term.charAt(0).toUpperCase() + term.slice(1)} ${index + 1}`,
        back: `Explain this concept in the context of ${topic.toLowerCase() || subjectName.toLowerCase()}.`,
      }));

    const mcqs = [
      {
        question: `Which statement best reflects the central idea of ${topic || subjectName}?`,
        options: [
          `The topic focuses on ${keywordPool[0] || "core principles"} and practical application.`,
          `The topic is unrelated to the subject content.`,
          `Only memorization matters for this area.`,
          `The topic should be ignored in revision.`,
        ],
        answer: `The topic focuses on ${keywordPool[0] || "core principles"} and practical application.`,
      },
      {
        question: `What is the best method to revise ${topic || subjectName} at a ${level.toLowerCase()} level?`,
        options: [
          "Break the topic into small concepts and explain them aloud.",
          "Skip examples and memorize one page only.",
          "Study only the final answer without the process.",
          "Avoid active recall and self-testing.",
        ],
        answer: "Break the topic into small concepts and explain them aloud.",
      },
      {
        question: `Which learning strategy is most useful when preparing for a viva in ${subjectName}?`,
        options: [
          "Use examples, definitions, and compare-key ideas clearly.",
          "Only repeat the assignment title.",
          "Memorize random phrases without understanding.",
          "Ignore practical examples.",
        ],
        answer: "Use examples, definitions, and compare-key ideas clearly.",
      },
    ];

    const vivaQuestions = [
      `Can you explain the main idea behind ${topic || subjectName} in simple terms?`,
      `What are the most important differences between the core concepts in this topic?`,
      `How would you apply the concept of ${topic || subjectName} to a real-world example?`,
      `Which part of this topic would you revise first and why?`,
    ];

    const summary = `In ${languageChoice}, this study material for ${subjectName} focuses on ${topic || "the main topic"}. At a ${level.toLowerCase()} difficulty, the key idea is to understand the core concept, connect it to relevant examples, and be able to explain the process clearly during a viva or quiz.`;

    return {
      summary,
      keyPoints: keyPoints.slice(0, 4),
      flashcards: flashcards.slice(0, 4),
      mcqs,
      vivaQuestions,
      evidence: fallbackTerms.slice(0, 2),
    };
  };

  const handleGenerateStudyMaterial = (event) => {
    event.preventDefault();

    if (!studySubject.trim()) {
      setGenerationError("Please select or enter a subject.");
      return;
    }

    if (!studyTopic.trim()) {
      setGenerationError("Please add a topic or focus area.");
      return;
    }

    const sourceText = studyContent.trim() || (studyFile ? studyFile.name : "");

    if (!sourceText) {
      setGenerationError("Please paste notes or upload a document before generating study material.");
      return;
    }

    setGenerationError("");
    setIsGenerating(true);

    setTimeout(() => {
      const generated = buildGeneratedMaterial(
        sourceText,
        studyTopic,
        studySubject,
        difficulty,
        language
      );

      setGeneratedStudy(generated);
      setActiveTab("summary");
      setIsGenerating(false);
    }, 700);
  };

  const resetStudyWorkspace = () => {
    setStudySubject("");
    setStudyTopic("");
    setStudyContent("");
    setStudyFile(null);
    setDifficulty("Intermediate");
    setLanguage("English");
    setGenerationError("");
    setGeneratedStudy(DEFAULT_GENERATED_SET);
    setActiveTab("summary");

    if (studyFileInputRef.current) {
      studyFileInputRef.current.value = "";
    }
  };

  return (
    <div className="documents-page">
      <section className="documents-page-header">
        <div>
          <span className="documents-eyebrow">
            YOUR STUDY LIBRARY
          </span>

          <h1>My Documents</h1>

          <p>
            Upload your study material and turn it into
            simple summaries, questions, quizzes, and
            viva practice.
          </p>
        </div>

        <button
          className="documents-primary-button"
          onClick={openModal}
        >
          <span>＋</span>
          Upload Document
        </button>
      </section>

      <section className="documents-hero">
        <div className="documents-hero-content">
          <div className="documents-hero-badge">
            ✦ AI STUDY WORKSPACE
          </div>

          <h2>
            Your notes.
            <br />
            Your knowledge.
            <br />
            Your preparation.
          </h2>

          <p>
            Upload lectures, assignments, or project
            documents and prepare them for AI-powered
            learning.
          </p>
        </div>

        <div className="documents-hero-art">
          <div className="documents-orbit documents-orbit-one" />
          <div className="documents-orbit documents-orbit-two" />
          <div className="documents-sparkle">✦</div>
          <div className="documents-star">✧</div>
        </div>
      </section>

      <section className="documents-stats-grid">
        <div className="documents-stat-card">
          <div className="documents-stat-icon purple">
            ▤
          </div>

          <div>
            <span>Total Documents</span>
            <strong>{documents.length}</strong>
          </div>
        </div>

        <div className="documents-stat-card">
          <div className="documents-stat-icon blue">
            ✦
          </div>

          <div>
            <span>Ready for Learning</span>
            <strong>{readyDocuments}</strong>
          </div>
        </div>

        <div className="documents-stat-card">
          <div className="documents-stat-icon green">
            ✓
          </div>

          <div>
            <span>Subjects Covered</span>
            <strong>{Math.max(subjects.length - 1, 0)}</strong>
          </div>
        </div>
      </section>

      <section className="study-workspace-panel">
        <div className="study-workspace-header">
          <div>
            <span className="documents-eyebrow">AI GENERATOR</span>
            <h2>Generate Study Material</h2>
          </div>
        </div>

        <div className="study-workspace-grid">
          <form className="study-form" onSubmit={handleGenerateStudyMaterial}>
            <div className="study-form-row two-col">
              <div className="documents-form-field">
                <label htmlFor="study-subject">Subject</label>
                <select
                  id="study-subject"
                  value={studySubject}
                  onChange={(event) => setStudySubject(event.target.value)}
                >
                  <option value="">Choose a subject</option>
                  {subjectOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="documents-form-field">
                <label htmlFor="study-difficulty">Difficulty</label>
                <select
                  id="study-difficulty"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="documents-form-field">
              <label htmlFor="study-topic">Topic</label>
              <input
                id="study-topic"
                type="text"
                placeholder="e.g. Normalization in SQL"
                value={studyTopic}
                onChange={(event) => setStudyTopic(event.target.value)}
              />
            </div>

            <div className="documents-form-field">
              <label htmlFor="study-notes">Paste study notes</label>
              <textarea
                id="study-notes"
                rows="7"
                placeholder="Paste lecture notes, textbook excerpts, or assignment material here..."
                value={studyContent}
                onChange={(event) => setStudyContent(event.target.value)}
              />
            </div>

            <div className="documents-form-field">
              <label htmlFor="study-language">Language</label>
              <select
                id="study-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div className="study-upload-row">
              <button
                type="button"
                className="documents-secondary-button"
                onClick={() => studyFileInputRef.current?.click()}
              >
                {studyFile ? "Change File" : "Upload PDF / DOCX / TXT"}
              </button>
              <input
                ref={studyFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleStudyFileChange}
                hidden
              />
              {studyFile && <span className="study-file-name">{studyFile.name}</span>}
            </div>

            {generationError && (
              <div className="documents-form-error">
                <span>!</span>
                {generationError}
              </div>
            )}

            <div className="documents-modal-actions">
              <button
                type="button"
                className="documents-cancel-button"
                onClick={resetStudyWorkspace}
              >
                Clear
              </button>

              <button
                type="submit"
                className="documents-primary-button"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Study Material"}
              </button>
            </div>
          </form>

          <div className="study-output-panel">
            <div className="study-tabs" role="tablist" aria-label="Study material tabs">
              {[
                { key: "summary", label: "Summary" },
                { key: "keyPoints", label: "Key Points" },
                { key: "mcqs", label: "MCQs" },
                { key: "vivaQuestions", label: "Viva" },
                { key: "flashcards", label: "Flashcards" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={activeTab === tab.key ? "active" : ""}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isGenerating ? (
              <div className="study-loading-state">
                <div className="study-spinner" />
                <p>Preparing your AI study material...</p>
              </div>
            ) : generatedStudy.summary ? (
              <div className="study-output-body">
                {activeTab === "summary" && (
                  <div>
                    <h3>Study Summary</h3>
                    <p>{generatedStudy.summary}</p>
                  </div>
                )}

                {activeTab === "keyPoints" && (
                  <div>
                    <h3>Key Points</h3>
                    <ul>
                      {generatedStudy.keyPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "mcqs" && (
                  <div>
                    <h3>Practice Questions</h3>
                    <div className="study-quiz-list">
                      {generatedStudy.mcqs.map((item, index) => (
                        <div className="study-quiz-item" key={`${item.question}-${index}`}>
                          <strong>{index + 1}. {item.question}</strong>
                          <ul>
                            {item.options.map((option) => (
                              <li key={option}>{option}</li>
                            ))}
                          </ul>
                          <span className="study-answer">Answer: {item.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "vivaQuestions" && (
                  <div>
                    <h3>Viva Questions</h3>
                    <ul>
                      {generatedStudy.vivaQuestions.map((question, index) => (
                        <li key={question}>{index + 1}. {question}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "flashcards" && (
                  <div>
                    <h3>Flashcards</h3>
                    <div className="study-flashcard-grid">
                      {generatedStudy.flashcards.map((card, index) => (
                        <div className="study-flashcard" key={`${card.front}-${index}`}>
                          <span>Front</span>
                          <strong>{card.front}</strong>
                          <span>Back</span>
                          <p>{card.back}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="study-empty-state">
                <div className="documents-empty-icon">✦</div>
                <h3>No AI output yet</h3>
                <p>
                  Fill the form on the left and generate a study summary, quiz set, viva prompts, and revision cards.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="documents-toolbar">
        <div className="documents-search-box">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search documents..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="documents-subject-filter"
          value={subjectFilter}
          onChange={(event) =>
            setSubjectFilter(event.target.value)
          }
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Subjects" : item}
            </option>
          ))}
        </select>
      </section>

      <section className="documents-list-section">
        <div className="documents-section-heading">
          <div>
            <span className="documents-eyebrow">
              YOUR MATERIAL
            </span>

            <h2>Recent Documents</h2>
          </div>

          <span className="documents-count">
            {filteredDocuments.length}{" "}
            {filteredDocuments.length === 1
              ? "document"
              : "documents"}
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="documents-empty-state">
            <div className="documents-empty-icon">📄</div>

            <h3>No documents found</h3>

            <p>
              Upload your first study document or change
              your search filters.
            </p>

            <button
              className="documents-secondary-button"
              onClick={openModal}
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="documents-grid">
            {filteredDocuments.map((document) => (
              <article
                className="document-card"
                key={document.id}
              >
                <div className="document-card-top">
                  <div
                    className={`document-file-icon ${document.type.toLowerCase()}`}
                  >
                    {document.type}
                  </div>

                  <button
                    className="document-delete-button"
                    onClick={() =>
                      handleDelete(document.id)
                    }
                    aria-label={`Delete ${document.name}`}
                    title="Delete document"
                  >
                    ⋮
                  </button>
                </div>

                <div className="document-card-body">
                  <h3 title={document.name}>
                    {document.name}
                  </h3>

                  <p className="document-subject">
                    {document.subject}
                  </p>

                  <div className="document-meta">
                    <span>{document.size}</span>
                    <span>•</span>
                    <span>{document.uploadedAt}</span>
                  </div>
                </div>

                <div className="document-card-footer">
                  <span className="document-status">
                    <span className="document-status-dot" />
                    {document.status}
                  </span>

                  <button
                    className="document-open-button"
                    onClick={() =>
                      handleOpenDocument(document)
                    }
                  >
                    Open →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div
          className="documents-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="documents-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-document-title"
          >
            <div className="documents-modal-header">
              <div>
                <span className="documents-eyebrow">
                  STUDY MATERIAL
                </span>

                <h2 id="upload-document-title">
                  Upload Document
                </h2>

                <p>
                  Add your notes or lecture material to
                  your learning library.
                </p>
              </div>

              <button
                className="documents-modal-close"
                onClick={closeModal}
                disabled={isUploading}
                aria-label="Close upload modal"
              >
                ×
              </button>
            </div>

            <form
              className="documents-upload-form"
              onSubmit={handleUpload}
            >
              <button
                type="button"
                className={`documents-drop-zone ${
                  selectedFile ? "has-file" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="documents-upload-icon">
                  {selectedFile ? "✓" : "↑"}
                </div>

                {selectedFile ? (
                  <>
                    <strong>{selectedFile.name}</strong>
                    <span>
                      Click to choose a different file
                    </span>
                  </>
                ) : (
                  <>
                    <strong>
                      Choose a document to upload
                    </strong>

                    <span>
                      PDF, DOCX, or TXT • Maximum 10 MB
                    </span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                hidden
              />

              <div className="documents-form-field">
                <label htmlFor="document-title">
                  Document Title
                </label>

                <input
                  id="document-title"
                  type="text"
                  placeholder="e.g. Database Normalization"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />
              </div>

              <div className="documents-form-field">
                <label htmlFor="document-subject">
                  Subject
                </label>

                <input
                  id="document-subject"
                  type="text"
                  placeholder="e.g. Database Systems"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                />
              </div>

              {error && (
                <div className="documents-form-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <div className="documents-modal-actions">
                <button
                  type="button"
                  className="documents-cancel-button"
                  onClick={closeModal}
                  disabled={isUploading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="documents-primary-button"
                  disabled={isUploading}
                >
                  {isUploading
                    ? "Uploading..."
                    : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;