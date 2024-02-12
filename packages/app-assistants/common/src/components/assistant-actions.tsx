import { EraserIcon, GearIcon } from '@radix-ui/react-icons';
import { Trash2 } from 'lucide-react';

import { Button, Separator } from '@bxav/ui-components';

import { DeleteAssistantButton } from './delete-assistant-button';
import { ShareCurrentAssistantPopover } from './assistant-share';
import { ClearAssistantButton } from './clear-assistant-button';

type AssistantProps = {
  selectedAssistant: any;
  setShowConfig?: any;
};

const AssistantActions = ({
  selectedAssistant,
  setShowConfig,
}: AssistantProps) => {
  return (
    <div className="flex h-12 items-center p-2">
      <div className="flex items-center gap-2">
        {selectedAssistant.shareId && (
          <>
            <DeleteAssistantButton tooltipContent="Move to trash">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Move to trash</span>
            </DeleteAssistantButton>
            <Separator orientation="vertical" className="mx-2 h-6" />
            <ShareCurrentAssistantPopover />
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ClearAssistantButton variant="outline" size="sm">
          <EraserIcon className="mr-2 h-4 w-4" />
          Clear
        </ClearAssistantButton>
      </div>
      {setShowConfig && (
        <>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(true)}
          >
            <GearIcon className="mr-2 h-4 w-4" />
            Show Config
          </Button>
        </>
      )}
    </div>
  );
};

export { AssistantActions };
