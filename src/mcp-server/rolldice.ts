export async function rollDice() {
    const result = Math.floor(Math.random() * 6) + 1;
  
    return {
      content: [
        {
          type: "text",
          text: `🎲 You rolled a ${result}`,
        },
      ],
    };
  }
  