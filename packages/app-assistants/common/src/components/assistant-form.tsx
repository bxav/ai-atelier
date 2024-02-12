'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AssistantConfig } from '../contexts/selected-assistant-context';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@bxav/ui-components';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@bxav/ui-components';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Textarea } from '@bxav/ui-components';
import { createAssistantAction } from '../actions/create-assistant-action';
import { updateAssistantAction } from '../actions/update-assistant-action';
import { useAssistant } from '../hooks/use-assistant';
import { useTransition } from 'react';

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: '',
    })
    .max(100, {
      message: '',
    }),
  description: z
    .string()
    .max(4000, {
      message: '',
    })
    .optional(),
  model: z.string(),
  systemPrompt: z
    .string()
    .min(10, {
      message: 'System prompt must be at least 10 characters.',
    })
    .max(4000, {
      message: 'System prompt must be at most 4000 characters.',
    }),
});

type AssistantFormProps = {
  onUpdated?: (assistant: any) => void;
};

const AssistantForm = ({ onUpdated }: AssistantFormProps) => {
  const [selectedAssistant, setSelectedAssistant] = useAssistant();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      name: selectedAssistant.name,
      model: (selectedAssistant.config as AssistantConfig)?.model,
      description: selectedAssistant.description || undefined,
      systemPrompt: (selectedAssistant.config as AssistantConfig)?.prompt,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      console.log(data, selectedAssistant);

      let newAssistant;
      if (selectedAssistant.id) {
        newAssistant = await updateAssistantAction({
          ...selectedAssistant,
          id: selectedAssistant.id,
          name: data.name,
          description: data.description,
          config: {
            model: data.model,
            prompt: data.systemPrompt,
          },
        });

        setSelectedAssistant({
          ...selectedAssistant,
          name: newAssistant.name,
          description: newAssistant.description || null,
          config: newAssistant.config,
          messages: selectedAssistant.messages,
        });

        if (onUpdated) {
          onUpdated(newAssistant);
        }
      } else {
        await createAssistantAction({
          ...selectedAssistant,
          name: data.name,
          description: data.description,
          config: {
            prompt: data.systemPrompt,
          },
        });
      }
    });
  }

  return (
    <Form {...form}>
      <SignedOut>
        <SignInButton>
          <Button className="mb-6 w-full">Sign in & Save</Button>
        </SignInButton>
      </SignedOut>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SignedIn>
          <Button type="submit" className="w-full" disabled={isPending}>
            Save
          </Button>
        </SignedIn>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your assistant name"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the name of your assistant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your assistant description"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the description of your assistant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="gpt-3.5-turbo-1106" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo-1106">
                    gpt-3.5-turbo-1106
                  </SelectItem>
                  <SelectItem value="gpt-4-1106-preview">
                    gpt-4-1106-preview
                  </SelectItem>
                  <SelectItem value="mistral-medium">mistral-medium</SelectItem>
                  <SelectItem value="mistral-small">mistral-small</SelectItem>
                  <SelectItem value="mistral-tiny">mistral-tiny</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This is the model of your assistant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your are an helpfull assistant."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the system prompt of your assistant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export { AssistantForm };
