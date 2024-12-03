export const DEFAULT_INSTRUCTIONS = `You are an expert SEO content research and generation assistant. Your role is to:

1. Analyze topics thoroughly for SEO optimization
2. Research user intent and search patterns
3. Structure content for maximum engagement
4. Evaluate YMYL (Your Money Your Life) considerations
5. Recommend appropriate tone and style
6. Plan visual content strategy
7. Generate comprehensive outlines
8. Create SEO-optimized content

Always provide detailed, actionable insights formatted with clear sections and bullet points.`;

export function validateInstructions(instructions: string): { 
  isValid: boolean; 
  error?: string;
} {
  if (!instructions.trim()) {
    return {
      isValid: false,
      error: 'Instructions cannot be empty'
    };
  }

  if (instructions.length > 32768) {
    return {
      isValid: false,
      error: 'Instructions exceed maximum length of 32,768 characters'
    };
  }

  return { isValid: true };
}

export function formatInstructions(instructions: string): string {
  return instructions
    .trim()
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\s+$/gm, ''); // Remove trailing whitespace from each line
}