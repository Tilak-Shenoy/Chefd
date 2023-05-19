import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

export const openaiConfig = new OpenAIApi(configuration);