import OpenAI from 'openai';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';

export async function verifyApiKey(apiKey: string): Promise<Assistant[]> {
  if (!apiKey?.startsWith('sk-')) {
    throw new Error('Invalid API key format. Key should start with "sk-"');
  }

  try {
    const openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });

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