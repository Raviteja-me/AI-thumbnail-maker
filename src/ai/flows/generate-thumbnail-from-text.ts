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
  thumbnailText: z.string().optional().describe('Optional text to include in the thumbnail.'),
  aspectRatio: z.enum(['landscape', 'square']).default('landscape').describe('The aspect ratio of the thumbnail.'),
  apiKey: z.string().optional().describe('Optional Google AI API key.'),
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
        apiKey: input.apiKey || process.env.GOOGLE_API_KEY,
    };
    
    const aspectRatioText = input.aspectRatio === 'landscape' ? '16:9 landscape' : '1:1 square';
    
    let prompt = `You are a viral marketing expert specializing in creating clickable YouTube thumbnails.

    Your task is to generate an engaging, high-quality YouTube thumbnail based on the user's video idea.

    **Key principles for a great thumbnail:**
    1.  **Aspect Ratio:** The image MUST be ${aspectRatioText}.
    2.  **High Contrast & Vibrant Colors:** Make the image pop. Use bright, saturated colors that grab attention.
    3.  **Clear Focal Point:** The main subject should be instantly recognizable.
    4.  **Dynamic Composition:** Use angles and layouts that create energy and interest.
    5.  **Emotionally Resonant:** The image should evoke curiosity, excitement, or another strong emotion.
    6.  **Readability:** Ensure the image is clear and understandable even at a small size.`;

    if (input.thumbnailText) {
        prompt += `
    7.  **Text Integration:** Include the following text in the thumbnail. Make it BIG, BOLD, and EASY TO READ. Use a thick, clean font with high contrast against the background (e.g., by using an outline or shadow). Place it strategically to draw attention without obscuring the main subject.`;
    } else {
        prompt += `
    Leave space for potential text overlays. Do not include any text in the image itself.`;
    }

    prompt += `

    **Instructions:**
    Create a thumbnail for a YouTube video with the following topic. The image must have a ${aspectRatioText} aspect ratio.
    
    **Video Topic:** ${input.prompt}`;

    if (input.thumbnailText) {
        prompt += `
    **Text to include:** "${input.thumbnailText}"`;
    }


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
