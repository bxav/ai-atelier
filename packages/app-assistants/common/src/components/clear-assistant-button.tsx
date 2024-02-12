'use client';

import { Button, ButtonProps } from '@bxav/ui-components';

import { Assistant } from '../contexts/selected-assistant-context';
import { updateAssistantAction } from '../actions/update-assistant-action';
import { useAssistant } from '../hooks/use-assistant';

type ClearAssistantButtonProps = Pick<
  ButtonProps,
  'size' | 'variant' | 'children'
>;

const ClearAssistantButton = ({ ...props }: ClearAssistantButtonProps) => {
  const [, setSelectedAssistant] = useAssistant();

  const handleClearClick = () => {
    setSelectedAssistant((prevAssistant: Assistant) => {
      const newMessages: any[] = [];
      if (prevAssistant.id) {
        updateAssistantAction({
          ...prevAssistant,
          messages: newMessages,
        });
      }

      return {
        ...prevAssistant,
        messages: newMessages,
      };
    });
  };

  return <Button onClick={handleClearClick} {...props} />;
};

export { ClearAssistantButton };
