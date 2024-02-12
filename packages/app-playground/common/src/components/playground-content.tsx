import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@bxav/ui-components';

import { CompletePlayground } from './complete-playground';
import { EditPlayground } from './edit-playground';
import { InsertPlayground } from './insert-playground';
import { MaxLengthSelector } from './maxlength-selector';
import { ModeSelectorTabs } from './mode-selector-tabs';
import { ModelSelector } from './model-selector';
import { TemperatureSelector } from './temperature-selector';
import { TopPSelector } from './top-p-selector';
import { models, types } from '@bxav/shared-ai-models-config';

export const PlaygroundContent = ({}: {}) => (
  <ModeSelectorTabs>
    <div className="container h-full py-6">
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
        <div className="flex-col space-y-4 sm:flex md:order-2">
          <div className="grid gap-2">
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mode
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-[320px] text-sm" side="left">
                Choose the interface that best suits your task. You can provide:
                a simple prompt to complete, starting and ending text to insert
                a completion within, or some text with instructions to edit it.
              </HoverCardContent>
            </HoverCard>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="complete">
                <span className="sr-only">Complete</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5"
                >
                  <rect
                    x="4"
                    y="3"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4"
                    y="7"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4"
                    y="11"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4"
                    y="15"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="8.5"
                    y="11"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="8.5"
                    y="15"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="13"
                    y="11"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                </svg>
              </TabsTrigger>
              <TabsTrigger value="insert">
                <span className="sr-only">Insert</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
                    fill="currentColor"
                  ></path>
                  <rect
                    x="4"
                    y="15"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="8.5"
                    y="15"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="13"
                    y="15"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                </svg>
              </TabsTrigger>
              <TabsTrigger value="edit">
                <span className="sr-only">Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5"
                >
                  <rect
                    x="4"
                    y="3"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4"
                    y="7"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4"
                    y="11"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4"
                    y="15"
                    width="4"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="8.5"
                    y="11"
                    width="3"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                  <path
                    d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </TabsTrigger>
            </TabsList>
          </div>
          <ModelSelector types={types} models={models} />
          <TemperatureSelector />
          <MaxLengthSelector />
          <TopPSelector />
        </div>
        <div className="md:order-1">
          <TabsContent value="complete" className="mt-0 border-0 p-0">
            <CompletePlayground />
          </TabsContent>
          <TabsContent value="insert" className="mt-0 border-0 p-0">
            <InsertPlayground />
          </TabsContent>
          <TabsContent value="edit" className="mt-0 border-0 p-0">
            <EditPlayground />
          </TabsContent>
        </div>
      </div>
    </div>
  </ModeSelectorTabs>
);
