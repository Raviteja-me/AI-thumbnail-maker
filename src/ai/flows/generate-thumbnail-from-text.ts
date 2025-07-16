'use server';
/**
 * @fileOverview Generates three thumbnail options based on a text prompt using the Gemini model.
 *
 * - generateThumbnailsFromText - A function that handles the thumbnail generation process.
 * - GenerateThumbnailsFromTextInput - The input type for the generateThumbnailsFromText function.
 * - GenerateThumbnailsFromTextOutput - The return type for the generateThumbnailsFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThumbnailsFromTextInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate thumbnails from.'),
});
export type GenerateThumbnailsFromTextInput = z.infer<typeof GenerateThumbnailsFromTextInputSchema>;

const GenerateThumbnailsFromTextOutputSchema = z.object({
  thumbnail1: z.string().describe('The first generated thumbnail as a data URI.'),
  thumbnail2: z.string().describe('The second generated thumbnail as a data URI.'),
  thumbnail3: z.string().describe('The third generated thumbnail as a data URI.'),
});
export type GenerateThumbnailsFromTextOutput = z.infer<typeof GenerateThumbnailsFromTextOutputSchema>;

export async function generateThumbnailsFromText(input: GenerateThumbnailsFromTextInput): Promise<GenerateThumbnailsFromTextOutput> {
  return generateThumbnailsFromTextFlow(input);
}

const thumbnailPrompt = ai.definePrompt({
  name: 'thumbnailPrompt',
  input: {schema: GenerateThumbnailsFromTextInputSchema},
  output: {schema: GenerateThumbnailsFromTextOutputSchema},
  prompt: `You are an AI that generates thumbnails based on a text prompt. Generate three distinct thumbnails based on the prompt below. Return them as data URIs.

Prompt: {{{prompt}}}`,
});

const generateThumbnailsFromTextFlow = ai.defineFlow(
  {
    name: 'generateThumbnailsFromTextFlow',
    inputSchema: GenerateThumbnailsFromTextInputSchema,
    outputSchema: GenerateThumbnailsFromTextOutputSchema,
  },
  async input => {
    const {output} = await thumbnailPrompt(input);
    return output!;
  }
);
