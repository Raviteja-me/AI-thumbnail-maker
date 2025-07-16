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

const generateThumbnailsFromTextFlow = ai.defineFlow(
  {
    name: 'generateThumbnailsFromTextFlow',
    inputSchema: GenerateThumbnailsFromTextInputSchema,
    outputSchema: GenerateThumbnailsFromTextOutputSchema,
  },
  async (input) => {
    const model = 'googleai/gemini-2.0-flash-preview-image-generation';
    const config = { 
        responseModalities: ['IMAGE', 'TEXT'],
    };
    
    const prompt = `You are a viral marketing expert specializing in creating clickable YouTube thumbnails.

    Your task is to generate an engaging, high-quality YouTube thumbnail based on the user's video idea.

    **Key principles for a great thumbnail:**
    1.  **Aspect Ratio:** The image MUST be 16:9 landscape.
    2.  **High Contrast & Vibrant Colors:** Make the image pop. Use bright, saturated colors that grab attention.
    3.  **Clear Focal Point:** The main subject should be instantly recognizable.
    4.  **Dynamic Composition:** Use angles and layouts that create energy and interest.
    5.  **Emotionally Resonant:** The image should evoke curiosity, excitement, or another strong emotion.
    6.  **Readability:** Ensure the image is clear and understandable even at a small size. Leave space for potential text overlays.

    **Instructions:**
    Create a thumbnail for a YouTube video with the following topic. Do not include any text in the image itself. The image must have a 16:9 aspect ratio.

    **Video Topic:** ${input.prompt}
    `;

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
