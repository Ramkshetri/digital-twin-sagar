// src/mcp-server/tools/interviewSimulation.ts

export const runInterviewSimulation = (role: string, level: string) => {
  const specializedBanks = {
    cybersecurity: [
      "How would you handle a detected SQL injection attempt in a production environment?",
      "Explain the difference between Symmetric and Asymmetric encryption to a non-technical stakeholder.",
      "Describe your process for conducting a vulnerability assessment."
    ],
    frontend: [
      "How does the Virtual DOM improve performance in React?",
      "Describe a time you had to optimize a slow-loading web page.",
      "Explain CSS specificity and how you manage it in large projects."
    ]
  };

  const genericQuestions = [
    "Tell me about a difficult technical challenge you solved.",
    "Where do you see yourself in five years?"
  ];

  // Logic: Refinement by selecting role-specific data
  const questions = specializedBanks[role.toLowerCase()] || genericQuestions;

  return {
    status: "success",
    refined: true,
    data: {
      role,
      level,
      questions: questions.slice(0, 3), // Return top 3 refined questions
      timestamp: new Date().toISOString()
    }
  };
};