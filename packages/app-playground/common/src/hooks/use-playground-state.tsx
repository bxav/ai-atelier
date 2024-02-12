import { PresetConfigContext } from '../contexts/preset-config-id-context';
import { PromptConfigContext } from '../contexts/prompt-config-id-context';
import { useCompletion } from 'ai/react';
import { useContext, useEffect, useState } from 'react';

export const usePlaygroundState = () => {
  const { promptConfig, setPromptConfig } = useContext(PromptConfigContext);
  const { presetConfig } = useContext(PresetConfigContext);
  const [input, setInput] = useState('');
  const [instruction, setInstruction] = useState('');
  const { completion, complete, setCompletion, error } = useCompletion({
    api: '/api/completion',
    body: {
      ...presetConfig,
    },
  });

  useEffect(() => {
    // Update states based on promptConfig
    setInput(promptConfig.prompt);
    setInstruction(promptConfig.instruction);
    setCompletion(promptConfig.result);
  }, [promptConfig]);

  return {
    input,
    setInput,
    instruction,
    setInstruction,
    completion,
    complete,
    presetConfig,
    error,
    promptConfig,
    setPromptConfig,
  };
};
