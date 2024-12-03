import OpenAI from 'openai';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';
import { createOpenAIClient } from './openai-client';

const ASSISTANT_INSTRUCTIONS = `You are an expert SEO content research and generation assistant. Your role is to:

1. Analyze topics thoroughly for SEO optimization
2. Research user intent and search patterns
3. Structure content for maximum engagement
4. Evaluate YMYL (Your Money Your Life) considerations
5. Recommend appropriate tone and style
6. Plan visual content strategy
7. Generate comprehensive outlines
8. Create SEO-optimized content

Always provide detailed, actionable insights formatted with clear sections and bullet points.`;

export async function verifyApiKey(apiKey: string): Promise<Assistant[]> {
  if (!apiKey?.startsWith('sk-')) {
    throw new Error('Invalid API key format. Key should start with "sk-"');
  }

  try {
    const openai = createOpenAIClient(apiKey);

    // First, ensure our assistant exists or create it
    const assistant = await getOrCreateAssistant(openai);
    
    // Then get the list of assistants
    const response = await openai.beta.assistants.list({
      order: 'desc',
      limit: 20
    });

    if (!response.data) {
      throw new Error('No assistants data received from OpenAI');
    }

    return response.data;
  } catch (error: any) {
    console.error('OpenAI API verification failed:', error);
    if (error?.status === 401) {
      throw new Error('Invalid API key. Please check your credentials.');
    }
    const message = error?.response?.data?.error?.message || error?.message || 'Failed to connect to OpenAI';
    throw new Error(message);
  }
}

async function getOrCreateAssistant(openai: OpenAI): Promise<Assistant> {
  try {
    // Try to find our specific assistant
    const assistants = await openai.beta.assistants.list({
      order: 'desc',
      limit: 100
    });

    const existingAssistant = assistants.data.find(
      a => a.name === 'SEO Content Assistant'
    );

    if (existingAssistant) {
      // Update the existing assistant to ensure latest configuration
      return await openai.beta.assistants.update(existingAssistant.id, {
        instructions: ASSISTANT_INSTRUCTIONS,
        tools: [
          { type: 'code_interpreter' },
          { type: 'file_search' }
        ],
        model: 'gpt-4o'
      });
    }

    // Create a new assistant if none exists
    return await openai.beta.assistants.create({
      name: 'SEO Content Assistant',
      description: 'Expert assistant for SEO content research and generation',
      instructions: ASSISTANT_INSTRUCTIONS,
      tools: [
        { type: 'code_interpreter' },
        { type: 'file_search' }
      ],
      model: 'gpt-4o',
      metadata: {
        type: 'seo_content',
        version: '1.0'
      }
    });
  } catch (error) {
    console.error('Failed to get or create assistant:', error);
    throw error;
  }
}