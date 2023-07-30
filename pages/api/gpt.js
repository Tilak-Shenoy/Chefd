import { Configuration, OpenAIApi } from "openai-edge";

const configuration = new Configuration({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const config = {
    runtime: 'edge',
};

export default async function Gpt(req, res) {
  if (!configuration.apiKey) {
    let error = {
      message: "OpenAI API key not configured, please use a valid API key"
    }
    res = new Response(JSON.stringify(error), {
      status: 500,
       headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Optional: Add CORS header
    }
    });
    return res;
  }

  // req is a ReadableStream when edge function is used.
  const body = req.body;
  const textDecoder = new TextDecoder()
  var data  = {}
  for await (const chunk of body.values({ preventCancel: true })) {
  // Decode the chunk to get the right data 
    data = textDecoder.decode(chunk)
  }

  let jsonData = JSON.parse(data)

  const ingredients = jsonData.ingredients || '';
  const cuisine = jsonData.cuisine || '';

  if (ingredients.length === 0) {
    let error = {
        message: "Please choose at least one ingredient.",
    }
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Optional: Add CORS header
      }
    });
  }


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredients, cuisine),
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["input:"],
      temperature: 0.6,
    });


    var responseData  = ''
    for await (const chunk of completion.body.values({ preventCancel: true })) {
      // Decode the chunk to get the right data 
      responseData += textDecoder.decode(chunk)
    }

    let jsonResponse = JSON.parse(responseData)
    console.log('Tokens used: ', jsonResponse.usage.total_tokens)

    let response = {
      result: jsonResponse.choices[0].text
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Optional: Add CORS header
      }
    });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return new Response(JSON.stringify(error.response.data), {
        status: error.response.status,
        headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Optional: Add CORS header
      }
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      let errorMessage = {
          message: 'An error occurred during your request.'
      }

      return new Response(JSON.stringify(errorMessage), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Optional: Add CORS header
        }
      });
      
    }
  }
}

function generatePrompt(ingredients, cuisine) {
  if (cuisine === ''){
    return `You are a michelin star chef with immense knowledge of ingredients, produce and food. Suggest three recipes with following key ingredients. Clearly show the recipe name, prep time, cook time, difficulty level, ingredients and instructions.
  Discard any unnecessary ingredients.
    Ingredients: ${ingredients}. Feel free to disregard irrelevant ingredients. Start every recipe with an @recipe. Do not include a recipe number. Mark all the optional ingredients in brackets. Do not include the word title`;

  } else {
    return ` You are a michelin star chef with immense knowledge of ingredients, produce and food. Suggest three ${cuisine} recipes with following key ingredients. Clearly show the recipe name, prep time, cook time, difficulty level, ingredients and instructions.
  Discard any unnecessary ingredients.
    Ingredients: ${ingredients}. Feel free to disregard irrelevant ingredients. Start every recipe with an @recipe. Do not include a recipe number. Mark all the optional ingredients in brackets. Do not include the word title`;
  }
}