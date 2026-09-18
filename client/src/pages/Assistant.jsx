import { useEffect, useRef, useState } from "react";

const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "Hello! I’m VivaMate AI. How can I help you with your studies today?",
    time: "Now",
  },
];

function Assistant() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(
      "vivaMateChatMessages"
    );

    return savedMessages
      ? JSON.parse(savedMessages)
      : initialMessages;
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      "vivaMateChatMessages",
      JSON.stringify(messages)
    );

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const generateResponse = (question) => {
    const value = question.toLowerCase();

    if (value.includes("machine learning")) {
      return "Machine Learning is a branch of AI that allows systems to learn patterns from data and make predictions or decisions without being explicitly programmed for every situation.";
    }

    if (
      value.includes("study") ||
      value.includes("schedule")
    ) {
      return "Try a focused study cycle: spend 25 minutes studying, take a 5-minute break, and repeat four times. Start with your most difficult subject when your energy is highest.";
    }

    if (
      value.includes("react") ||
      value.includes("javascript")
    ) {
      return "React is a JavaScript library for building user interfaces using reusable components. A React application commonly uses components, props, state, and event handling.";
    }

    if (
      value.includes("data structure") ||
      value.includes("dsa")
    ) {
      return "A data structure is a way of organizing and storing data. Common examples include arrays, linked lists, stacks, queues, trees, graphs, and hash tables.";
    }

    if (value.includes("exam") || value.includes("quiz")) {
      return "For exam preparation, divide your syllabus into small topics, revise actively, solve practice questions, and review your mistakes instead of only rereading notes.";
    }

    if (value.includes("hello") || value.includes("hi")) {
      return "Hello! I’m ready to help you understand concepts, create study plans, summarize topics, or practice questions.";
    }

    return "That’s a useful question. Start by breaking the topic into smaller parts, identify the main concept, and practice it with an example. You can ask me about programming, data science, exams, assignments, or study planning.";
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const cleanInput = input.trim();

    if (!cleanInput || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanInput,
      time: "Now",
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: generateResponse(cleanInput),
        time: "Now",
      };

      setMessages((previous) => [...previous, aiMessage]);
      setIsTyping(false);
    }, 900);
  };

  const clearChat = () => {
    const shouldClear = window.confirm(
      "Clear the complete conversation?"
    );

    if (!shouldClear) return;

    setMessages(initialMessages);
    localStorage.removeItem("vivaMateChatMessages");
  };

  const suggestedQuestions = [
    "Explain machine learning",
    "Create a study plan",
    "What is React?",
    "Explain data structures",
  ];

  return (
    <div className="assistant-page">
      <section className="assistant-intro">
        <div>
          <span className="page-eyebrow">INTELLIGENT LEARNING</span>
          <h2>Meet your AI study companion</h2>
          <p>
            Ask questions, understand concepts, and get guidance
            whenever you need it.
          </p>
        </div>

        <div className="assistant-status">
          <span />
          AI Assistant Online
        </div>
      </section>

      <section className="assistant-layout">
        <aside className="assistant-sidebar">
          <div className="assistant-profile-card">
            <div className="assistant-large-icon">✦</div>
            <h3>VivaMate AI</h3>
            <p>Your personal academic assistant.</p>
          </div>

          <div className="assistant-side-section">
            <span>QUICK PROMPTS</span>

            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
              >
                <span>✦</span>
                {question}
              </button>
            ))}
          </div>

          <button className="clear-chat-button" onClick={clearChat}>
            <span>⌫</span>
            Clear conversation
          </button>
        </aside>

        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">✦</div>
              <div>
                <strong>VivaMate AI Assistant</strong>
                <span>
                  <i /> Ready to help
                </span>
              </div>
            </div>

            <span className="chat-header-label">
              Learning Mode
            </span>
          </div>

          <div className="chat-messages">
            <div className="chat-date-divider">
              <span>Today</span>
            </div>

            {messages.map((message) => (
              <div
                className={`chat-message-row ${
                  message.sender === "user" ? "user-message-row" : ""
                }`}
                key={message.id}
              >
                {message.sender === "ai" && (
                  <div className="chat-message-avatar">✦</div>
                )}

                <div
                  className={`chat-message ${
                    message.sender === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                >
                  <p>{message.text}</p>
                  <span>{message.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row">
                <div className="chat-message-avatar">✦</div>
                <div className="chat-message ai-message typing-message">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <div className="chat-input-wrapper">
              <input
                type="text"
                placeholder="Ask anything about your studies..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />

              <button
                type="submit"
                className="chat-send-button"
                disabled={!input.trim() || isTyping}
              >
                ↑
              </button>
            </div>

            <p>
              VivaMate AI can make mistakes. Verify important
              academic information.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Assistant;