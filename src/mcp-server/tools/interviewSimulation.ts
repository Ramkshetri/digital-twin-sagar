export async function runInterviewSimulation({ role }: { role: string }) {
  const questions = [
    "Explain how you would secure a Server Action in Next.js.",
    "How would you detect SQL injection attempts in your Digital Twin?",
    "What is defense-in-depth and how is it applied in your architecture?",
    "How does an MCP tool call work in your system?",
    "Describe your Digital Twin threat monitoring strategy."
  ];

  return {
    content: [
      {
        type: "text",
        text:
          `🧠 Interview Simulation for ${role} Role:\n\n` +
          questions.map((q, i) => `${i + 1}. ${q}`).join("\n")
      }
    ]
  };
}
