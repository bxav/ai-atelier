import { SelectedAssistantContext } from '../contexts/selected-assistant-context';
import { useContext } from 'react';
export { defaultAssistant } from '../contexts/selected-assistant-context';

export function useAssistant() {
  const { assistant, setAssistant } = useContext(SelectedAssistantContext);

  return [assistant, setAssistant] as const;
}
