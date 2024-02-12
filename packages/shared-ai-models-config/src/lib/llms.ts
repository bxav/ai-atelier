export const types = ['OpenAI', 'Mistral', 'Llama'] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  token: number;
  description: string;
  strengths?: string;
  type: Type;
}

export const models: Model<ModelType>[] = [
  {
    id: 'c305f976-8e38-42b1-9fb7-d21b2e34f0da',
    name: 'gpt-4-1106-preview',
    token: 30,
    description:
      'Generates creative text formats, answers your questions informatively, and handles complex tasks.',
    type: 'OpenAI',
    strengths: 'Powerful & versatile',
  },
  {
    id: 'ac0797b0-7e31-43b6-a494-da7e2ab43445',
    name: 'gpt-3.5-turbo-1106',
    token: 10,
    description:
      'Creates text formats, answers questions effectively, but with less complexity than larger models.',
    type: 'OpenAI',
    strengths: 'Balanced & adaptable',
  },
  {
    id: '06525397-9490-4820-b69a-b01f350e4c6f',
    name: 'mistral-medium',
    token: 20,
    description:
      'Offers informative responses, translations, and creative writing, focusing on efficiency.',
    type: 'Mistral',
    strengths: 'Efficient & informative',
  },
  {
    id: '0305a3ed-8349-4e25-bd4d-4a3dafca65de',
    name: 'mistral-small',
    token: 10,
    description:
      'Handles similar tasks as the medium model but with reduced complexity and resource requirements.',
    type: 'Mistral',
    strengths: 'Compact & accessible',
  },
  {
    id: '81549dd5-dce0-49a6-8b91-67bbe2a357f0',
    name: 'mistral-tiny',
    token: 5,
    description:
      'Offers basic functionality for answering questions, translating, and creative writing, ideal for low-resource scenarios.',
    type: 'Mistral',
    strengths: 'Lightweight & essential',
  },
];
