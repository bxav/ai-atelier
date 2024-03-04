import { WriterWithReflectionAgent } from './writer-with-reflection-agent';
import { FakeListChatModel } from '@langchain/core/utils/testing';

describe('WriterWithReflectionAgent', () => {
  let model: any;
  let agent: WriterWithReflectionAgent;

  beforeEach(() => {
    model = new FakeListChatModel({
      responses: ['Generated content', 'Review of content'],
    });
    agent = new WriterWithReflectionAgent({
      model,
      writerPrompt: 'Write:',
      reviewerPrompt: 'Review:',
      maxReviews: 3,
    });
  });

  describe('Initialization', () => {
    it('should correctly initialize with provided model', () => {
      expect(agent).toHaveProperty('model', model);
    });

    it('should set the writer prompt correctly', () => {
      expect(agent).toHaveProperty('writerPrompt', 'Write:');
    });

    it('should set the reviewer prompt correctly', () => {
      expect(agent).toHaveProperty('reviewerPrompt', 'Review:');
    });

    it('should set the maximum number of reviews correctly', () => {
      expect(agent).toHaveProperty('maxReviews', 3);
    });
  });

  describe('Content Creation', () => {
    it('should generate content based on provided instructions', async () => {
      const instructions = ['Start writing'];
      const [post, messages] = await agent.createContent(instructions);

      expect(post).toBe('Generated content');
    });

    it('should generate the expected number of reviews', async () => {
      const instructions = ['Start writing'];
      const [, messages] = await agent.createContent(instructions);

      const reviewMessages = messages.filter(m => m.content === 'Review of content');
      expect(reviewMessages).toHaveLength(3);
    });
  });
});
