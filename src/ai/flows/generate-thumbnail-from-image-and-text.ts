'use server';
/**
 * @fileOverview AI agent that generates thumbnails from image and text description.
 *
 * - generateThumbnailsFromImageAndText - A function that handles the thumbnail generation process.
 * - GenerateThumbnailsFromImageAndTextInput - The input type for the generateThumbnailsFromImageAndText function.
 * - GenerateThumbnailsFromImageAndTextOutput - The return type for the generateThumbnailsFromImageAndText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThumbnailsFromImageAndTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A reference image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A text description to guide the thumbnail generation.'),
});
export type GenerateThumbnailsFromImageAndTextInput = z.infer<typeof GenerateThumbnailsFromImageAndTextInputSchema>;

const GenerateThumbnailsFromImageAndTextOutputSchema = z.object({
  thumbnail1: z.string().describe('The first generated thumbnail image as a data URI.'),
  thumbnail2: z.string().describe('The second generated thumbnail image as a data URI.'),
  thumbnail3: z.string().describe('The third generated thumbnail image as a data URI.'),
});
export type GenerateThumbnailsFromImageAndTextOutput = z.infer<typeof GenerateThumbnailsFromImageAndTextOutputSchema>;

export async function generateThumbnailsFromImageAndText(input: GenerateThumbnailsFromImageAndTextInput): Promise<GenerateThumbnailsFromImageAndTextOutput> {
  return generateThumbnailsFromImageAndTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThumbnailsFromImageAndTextPrompt',
  input: {schema: GenerateThumbnailsFromImageAndTextInputSchema},
  output: {schema: GenerateThumbnailsFromImageAndTextOutputSchema},
  prompt: `You are an AI thumbnail generator. Please generate three different thumbnail options based on the reference image and text description provided. Return the thumbnails as data URIs.

Reference Image: {{media url=photoDataUri}}
Description: {{{description}}}`,
});

const generateThumbnailsFromImageAndTextFlow = ai.defineFlow(
  {
    name: 'generateThumbnailsFromImageAndTextFlow',
    inputSchema: GenerateThumbnailsFromImageAndTextInputSchema,
    outputSchema: GenerateThumbnailsFromImageAndTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
