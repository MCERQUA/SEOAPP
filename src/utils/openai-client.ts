import OpenAI from 'openai';
import { isCorsError, isRateLimitError, isAuthError } from './error-handlers';

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      'OpenAI-Beta': 'assistants=v2',
      'Content-Type': 'application/json',
    }
  });
}

export function validateApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.startsWith('sk-');
}

export async function handleOpenAIRequest<T>(
  requestFn: () => Promise<T>,
  errorContext: string
): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new Error(
        `Browser security prevented the request. Please ensure you're using a valid API key and the request is properly configured. ${errorContext}`
      );
    }

    if (isRateLimitError(error)) {
      throw new Error(
        `Rate limit exceeded. Please wait a moment before trying again. ${errorContext}`
      );
    }

    if (isAuthError(error)) {
      throw new Error(
        `Authentication failed. Please check your API key. ${errorContext}`
      );
    }

    // Handle other errors
    throw new Error(
      error.message || `An unexpected error occurred. ${errorContext}`
    );
  }
}