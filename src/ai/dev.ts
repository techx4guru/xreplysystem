import { config } from 'dotenv';
config();

import '@/ai/flows/edit-and-preview-template-outputs.ts';
import '@/ai/flows/generate-reply-candidates.ts';
import '@/ai/flows/assess-candidate-safety.ts';