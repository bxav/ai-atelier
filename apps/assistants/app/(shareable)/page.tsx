import { redirect } from 'next/navigation';

import {
  AssistantChat,
  AppLayout,
  defaultAssistant,
} from '@bxav/app-assistants-common';
import { db, findCurrentUser } from '@bxav/app-assistants-common/server';

export default async function RootShareablePage() {
  const user = await findCurrentUser();

  if (user) {
    const dataAssistant = await db.assistant.findFirst({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (dataAssistant) {
      redirect(`/${dataAssistant?.id}`);
    } else {
      redirect('/new');
    }
  }

  return (
    <AppLayout
      user={user}
      assistant={{
        ...defaultAssistant,
        name: 'Assistant Builder Guide',
        description: 'Guides users through creating AI assistants',
        config: {
          prompt:
            'This assistant is designed to simulate the experience of using an Assistant Builder platform. It guides users through the process of creating their own AI assistants, explaining the capabilities, the process, and the potential applications of custom AI assistants. The GPT should be informative, engaging, and ready to answer questions about building AI assistants, their functionalities, and how users can leverage this platform for their own needs. It should encourage exploration and creativity in AI assistant development, offering insights and suggestions based on user inquiries. This assistant should maintain a friendly and welcoming tone, inviting users to explore the possibilities of AI assistant creation. It should avoid technical jargon unless specifically asked for, and instead focus on making the concept of AI assistant creation accessible to a wide audience. It should also provide clear, step-by-step explanations when detailing the creation process and be ready to offer examples of different types of AI assistants that can be created.',
          model: 'gpt-4-1106-preview',
        },
        messages: [
          {
            role: 'assistant',
            content:
              "👋 Hi there! Welcome to Assistant Builder! I'm here to help you discover how you can create your own intelligent assistants, just like me. What would you like to know more about?",
          },
          {
            role: 'user',
            content: 'What can I create here?',
          },
          {
            role: 'assistant',
            content:
              "Great question! With Assistant Builder, you can build custom AI assistants tailored for various purposes – from automating customer service, to personalizing your daily tasks, and even creating chatbots for your own unique projects. Whether you're a developer, a business owner, or just an AI enthusiast, there's something here for you. Would you like to dive into how you can build one?",
          },
          {
            role: 'user',
            content: 'How does it work?',
          },
          {
            role: 'assistant',
            content:
              "It's quite simple, actually! Our platform allows you to design your assistant's personality, define its capabilities, and train it with specific knowledge relevant to your needs. All of this is done through an intuitive interface that guides you every step of the way. To start, just log in and create a new assistant. From there, you can customize its behavior, train it with your own data, and even integrate it with your existing systems. It's like having your own AI sidekick, ready to assist you in whatever you need. Ready to get started?",
          },
        ],
      }}
    >
      <AssistantChat />
    </AppLayout>
  );
}
