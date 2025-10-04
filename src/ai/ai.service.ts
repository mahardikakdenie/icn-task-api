/* eslint-disable prettier/prettier */
// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required in .env');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateTaskSuggestions(
    context: string = 'daily work',
    type: string = 'task',
  ): Promise<string[]> {
    const prompt = `
You are a helpful productivity assistant.
Suggest exactly 3 realistic, actionable, and concise task titles for someone working on "${context}".
Return ONLY a JSON array of strings. No explanation, no markdown, no numbering.
Example: ["Review pull requests", "Write unit tests", "Plan team meeting"]
    `.trim();

    const promptDescription =
      `You are a helpful productivity assistant. Provide exactly 1 clear, concise, and realistic task description for someone working on "${context}". Return ONLY a plain string. No explanation, no markdown, no quotes. Example: Review and approve open pull requests from team members`.trim();

    const promptSubtasks =
      `You are a helpful productivity assistant. Suggest exactly 3 realistic, actionable, and concise subtasks for someone working on "${context}". Return ONLY a JSON array of strings. No explanation, no markdown, no numbering. Example: ["Check code style compliance", "Verify test coverage", "Confirm feature requirements are met"]`.trim();

    const getPrompt = (): string => {
      if (type === 'desc') {
        return promptDescription;
      }

      if (type === 'substaks') return promptSubtasks;
      return prompt;
    };

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: getPrompt() }],
        temperature: 0.7,
        max_tokens: 120,
        response_format: { type: 'json_object' }, // opsional, tapi lebih aman
      });

      const content = completion.choices[0].message.content || '[]';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const suggestions = JSON.parse(content);

      // Validasi: pastikan array string
      if (
        Array.isArray(suggestions) &&
        suggestions.every((s) => typeof s === 'string')
      ) {
        return [getPrompt()];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('OpenAI error:', error);
      // Fallback jika error
      return [
        `Review your ${context} progress`,
        `Update documentation for ${context}`,
        `Schedule a sync about ${context}`,
      ];
    }
  }
}
