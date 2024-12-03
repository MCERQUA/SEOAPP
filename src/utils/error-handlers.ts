export function isCorsError(error: any): boolean {
  return (
    error.message?.includes('CORS') ||
    error.message?.includes('Cross-Origin') ||
    error.name === 'TypeError' && error.message?.includes('Failed to fetch')
  );
}

export function isRateLimitError(error: any): boolean {
  return error.status === 429 || error.message?.includes('rate limit');
}

export function isAuthError(error: any): boolean {
  return (
    error.status === 401 ||
    error.message?.includes('authentication') ||
    error.message?.includes('API key')
  );
}

export function getErrorMessage(error: any, context: string = ''): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  return `An unexpected error occurred${context ? ` while ${context}` : ''}.`;
}