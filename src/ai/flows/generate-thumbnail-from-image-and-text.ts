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

const generateThumbnailsFromImageAndTextFlow = ai.defineFlow(
  {
    name: 'generateThumbnailsFromImageAndTextFlow',
    inputSchema: GenerateThumbnailsFromImageAndTextInputSchema,
    outputSchema: GenerateThumbnailsFromImageAndTextOutputSchema,
  },
  async (input) => {
    const model = 'googleai/gemini-2.0-flash-preview-image-generation';
    const config = { responseModalities: ['IMAGE', 'TEXT'] };
    const prompt = [
      { media: { url: input.photoDataUri } },
      { text: `Generate a thumbnail based on this image and the following description: ${input.description}` },
    ];

    const [result1, result2, result3] = await Promise.all([
      ai.generate({ model, prompt, config }),
      ai.generate({ model, prompt, config }),
      ai.generate({ model, prompt, config }),
    ]);

    return {
      thumbnail1: result1.media.url,
      thumbnail2: result2.media.url,
      thumbnail3: result3.media.url,
    };
  }
);
