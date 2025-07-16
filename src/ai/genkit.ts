import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // We don't set the API key here directly anymore.
      // It will be passed in the flow input or use the GOOGLE_API_KEY env var.
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
