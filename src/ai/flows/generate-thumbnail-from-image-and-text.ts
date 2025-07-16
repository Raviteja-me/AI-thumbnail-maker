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

const thumbnailPrompt = ai.definePrompt({
    name: 'viralThumbnailFromImagePrompt',
    input: { schema: GenerateThumbnailsFromImageAndTextInputSchema },
    prompt: `You are a viral marketing expert specializing in creating clickable YouTube thumbnails.

    Your task is to modify the provided image based on the user's description to create an engaging, high-quality YouTube thumbnail.

    **Key principles for a great thumbnail:**
    1.  **High Contrast & Vibrant Colors:** Make the image pop. Use bright, saturated colors that grab attention.
    2.  **Clear Focal Point:** The main subject should be instantly recognizable.
    3.  **Dynamic Composition:** Use angles and layouts that create energy and interest.
    4.  **Emotionally Resonant:** The image should evoke curiosity, excitement, or another strong emotion.
    5.  **Readability:** Ensure the image is clear and understandable even at a small size. Leave space for text if the user's prompt implies it.

    **Instructions:**
    Modify the reference image based on the following description to create a thumbnail that will get clicks.

    **Description:** {{{description}}}
    **Reference Image:** {{media url=photoDataUri}}
    `,
});

const generateThumbnailsFromImageAndTextFlow = ai.defineFlow(
  {
    name: 'generateThumbnailsFromImageAndTextFlow',
    inputSchema: GenerateThumbnailsFromImageAndTextInputSchema,
    outputSchema: GenerateThumbnailsFromImageAndTextOutputSchema,
  },
  async (input) => {
    const model = 'googleai/gemini-2.0-flash-preview-image-generation';
    const config = { responseModalities: ['IMAGE', 'TEXT'] };
    
    const [result1, result2, result3] = await Promise.all([
      ai.generate({ model, prompt: await thumbnailPrompt.render({input}), config }),
      ai.generate({ model, prompt: await thumbnailPrompt.render({input}), config }),
      ai.generate({ model, prompt: await thumbnailPrompt.render({input}), config }),
    ]);

    return {
      thumbnail1: result1.media.url,
      thumbnail2: result2.media.url,
      thumbnail3: result3.media.url,
    };
  }
);
