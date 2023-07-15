import { Configuration, OpenAIApi } from "openai";

export default async function dalle(req, res) {
  
  const configuration = new Configuration({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
  });

   const openai = new OpenAIApi(configuration);
    if (req.method === 'POST') {
      console.log('Calling Dall-E')
        try {
            const { prompt } = req.body;

            const aiResponse = await openai.createImage({
                prompt,
                n: 1,
                size: '512x512'
            });

            const image = aiResponse.data.data[0].url;
            console.log('Dall-E call succesful.')
            res.status(200).json({ photo: image });
        } catch (error) {
            console.error(error);
            res.status(500).send(error?.response.data.error.message || 'Something went wrong');
        }
    } else {
        res.status(500).send('Mehod not allowed');
    }
}