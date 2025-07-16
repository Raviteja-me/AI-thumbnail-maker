import {genkit, Flow, type FlowInput} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {getApiKey} from '@/lib/api-key-store';
import {z} from 'zod';

// Intercept flow execution to inject API key if available
const apiKeyMiddleware = async <I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
  flow: Flow<I, O>,
  input: FlowInput<I>
): Promise<boolean> => {
  const apiKey = await getApiKey();
  if (apiKey) {
    flow.config.model!.config = {...(flow.config.model!.config || {}), apiKey};
  } else if (process.env.GOOGLE_API_KEY) {
    // If no key in store, but one in env, use it.
    flow.config.model!.config = {
      ...(flow.config.model!.config || {}),
      apiKey: process.env.GOOGLE_API_KEY,
    };
  }
  // Let's not prevent execution, just add the key if we have it
  return true;
};

export const ai = genkit({
  plugins: [
    googleAI({
      // We don't set the API key here directly anymore
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
  flow: {
    middleware: [apiKeyMiddleware],
  },
});
