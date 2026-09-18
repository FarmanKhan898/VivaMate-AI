export const defaultSubjects = [
  {
    id: 1,
    name: "Database Normalization",
    description: "Core database design, relationships, and normalization principles.",
    level: "Intermediate",
  },
  {
    id: 2,
    name: "Operating Systems",
    description: "Process scheduling, memory management, and concurrency.",
    level: "Intermediate",
  },
  {
    id: 3,
    name: "Data Structures",
    description: "Arrays, trees, graphs, stacks, queues, and algorithmic thinking.",
    level: "Advanced",
  },
  {
    id: 4,
    name: "Machine Learning",
    description: "Model training, evaluation, feature engineering, and prediction.",
    level: "Advanced",
  },
  {
    id: 5,
    name: "Software Engineering",
    description: "Requirement analysis, design strategy, testing, and risk control.",
    level: "Beginner",
  },
];

export function getStoredSubjects() {
  try {
    const saved = localStorage.getItem("vivaMateSubjects");
    return saved ? JSON.parse(saved) : defaultSubjects;
  } catch {
    return defaultSubjects;
  }
}

export function generatePracticeSet({
  subject,
  topic,
  difficulty = "Medium",
  language = "English",
}) {
  const subjectName = (subject || "General Topics").trim() || "General Topics";
  const topicName = (topic || "core concepts").trim() || "core concepts";

  const questionTemplates = [
    {
      question: `Explain ${topicName} in a clear and practical way for a viva presentation.`,
      answer:
        `${topicName} is an important concept in ${subjectName}. It focuses on understanding the core idea, why it matters, and how it applies in real situations. A strong answer should include the definition, purpose, examples, and the impact of the concept on performance or decision-making.`,
      followUp: `Why is ${topicName} considered important in ${subjectName}?`,
      mcq: [
        `It defines the main purpose and real-world usage of a concept`,
        `It removes all practical examples from the topic`,
        `It ignores the importance of the subject area`,
        `It replaces technical understanding with memorization`,
      ],
      correctMcq: `It defines the main purpose and real-world usage of a concept`,
    },
    {
      question: `What are the main advantages and limitations of ${topicName}?`,
      answer:
        `The main advantages include better clarity, faster understanding, improved problem solving, and easier evaluation. The limitations can include complexity, dependency on context, and the need to balance theory with practical application. A good answer discusses both benefits and challenges.`,
      followUp: `How would you explain the trade-off between simplicity and depth in ${topicName}?`,
      mcq: [
        `It improves clarity but may require careful trade-offs`,
        `It eliminates all complexity from the topic`,
        `It guarantees perfect performance in every situation`,
        `It removes the need for examples and reasoning`,
      ],
      correctMcq: `It improves clarity but may require careful trade-offs`,
    },
    {
      question: `Describe a real-world example where ${topicName} is used effectively in ${subjectName}.`,
      answer:
        `A practical example would show how ${topicName} supports a real application, such as improving design choices, guiding decisions, or solving technical challenges. The explanation should mention the scenario, the role of the concept, and why the result is effective.`,
      followUp: `How would you adapt your explanation for a beginner audience?`,
      mcq: [
        `By explaining the concept with a relatable scenario`,
        `By removing all examples and details`,
        `By focusing only on formulas without context`,
        `By skipping the reasoning process`,
      ],
      correctMcq: `By explaining the concept with a relatable scenario`,
    },
    {
      question: `What would you say if a professor asked you to compare ${topicName} with a related concept?`,
      answer:
        `I would explain the similarities, differences, and when each concept is more useful. I would emphasize the purpose, strengths, limitations, and context of use so the comparison is clear and technically sound.`,
      followUp: `Which difference is most important when comparing these concepts?`,
      mcq: [
        `The purpose, context, and trade-offs across both approaches`,
        `The exact word count used in the answer`,
        `The amount of unrelated background information`,
        `Whether the response is delivered without examples`,
      ],
      correctMcq: `The purpose, context, and trade-offs across both approaches`,
    },
    {
      question: `How would you summarize ${topicName} in 2–3 sentences for a viva answer?`,
      answer:
        `${topicName} is a core concept in ${subjectName} that helps connect theory with practical understanding. It is important because it helps students explain the idea confidently, provide examples, and show how the concept is applied in real situations.`,
      followUp: `What is one key point you would highlight to impress an examiner?`,
      mcq: [
        `A concise definition with real-world relevance`,
        `Only the abstract theory without evidence`,
        `A long unrelated paragraph`,
        `Only one short keyword and no explanation`,
      ],
      correctMcq: `A concise definition with real-world relevance`,
    },
  ];

  return {
    id: Date.now(),
    subject: subjectName,
    topic: topicName,
    difficulty,
    language,
    createdAt: new Date().toISOString(),
    questions: questionTemplates.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      question: item.question,
      answer: item.answer,
      followUp: item.followUp,
      difficulty,
      type: "viva",
      mcq: item.mcq,
      correctMcq: item.correctMcq,
    })),
  };
}

export function evaluateAnswer(question, userAnswer) {
  const expected = (question.answer || "").toLowerCase();
  const actual = (userAnswer || "").toLowerCase();
  const expectedWords = [...new Set(expected.match(/[a-z]+/g) || [])];
  const actualWords = new Set((actual.match(/[a-z]+/g) || []).filter(Boolean));

  const overlap = expectedWords.filter((word) => actualWords.has(word)).length;
  const score = Math.min(
    100,
    Math.max(
      45,
      Math.round((overlap / Math.max(expectedWords.length, 1)) * 100)
    )
  );

  if (score >= 80) {
    return {
      score,
      feedback: "Strong answer. You explained the concept clearly and covered the main idea confidently.",
    };
  }

  if (score >= 60) {
    return {
      score,
      feedback: "Good effort. Add more structure and include a brief real-world example to improve clarity.",
    };
  }

  return {
    score,
    feedback: "Your answer needs more depth. Focus on the definition, purpose, and practical application of the concept.",
  };
}
