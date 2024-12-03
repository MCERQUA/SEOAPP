import { useState, useEffect, useCallback } from 'react';
import { useOpenAI } from '../../../context/OpenAIContext';
import { createOpenAIClient, handleOpenAIRequest } from '../../../utils/openai-client';
import { getErrorMessage } from '../../../utils/error-handlers';
import { validateInstructions, formatInstructions } from '../../../utils/instructions';

export function useInstructions(
  initialInstructions: string | null,
  onInstructionsChange: (instructions: string) => void
) {
  const [value, setValue] = useState(initialInstructions || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useOpenAI();

  const fetchInstructions = useCallback(async () => {
    if (!state.selectedAssistant?.id || !state.apiKey) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const openai = createOpenAIClient(state.apiKey);
      
      const assistant = await handleOpenAIRequest(
        () => openai.beta.assistants.retrieve(state.selectedAssistant!.id),
        'fetching assistant instructions'
      );

      if (assistant.instructions) {
        const formattedInstructions = formatInstructions(assistant.instructions);
        setValue(formattedInstructions);
        onInstructionsChange(formattedInstructions);
      }
    } catch (error) {
      console.error('Failed to fetch assistant instructions:', error);
      setError(getErrorMessage(error, 'loading instructions'));
    } finally {
      setIsLoading(false);
    }
  }, [state.selectedAssistant?.id, state.apiKey, onInstructionsChange]);

  useEffect(() => {
    fetchInstructions();
  }, [fetchInstructions]);

  const handleChange = (newValue: string) => {
    const { isValid, error } = validateInstructions(newValue);
    
    if (!isValid) {
      setError(error);
      return;
    }

    setError(null);
    setValue(newValue);
    onInstructionsChange(newValue);
  };

  const retry = () => {
    setError(null);
    fetchInstructions();
  };

  return {
    value,
    isLoading,
    error,
    handleChange,
    retry
  };
}