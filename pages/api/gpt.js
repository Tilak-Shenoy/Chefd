import { Configuration, OpenAIApi } from "openai-edge";

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Configure edge function for faster req-resp
export const config = {
    runtime: 'edge',
};

var cache = require('memory-cache');

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
  const generatedRecipes = jsonData.generatedRecipes || ''

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

  console.log('Generating recipes...')
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredients, cuisine, generatedRecipes),
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

    cache.put(jsonData, jsonResponse.choices[0].text, 1000 * 60 * 10);
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

function generatePrompt(ingredients, cuisine, generatedRecipes) {
  let prompt = ''
  if (cuisine === ''){
    prompt =  `You are a michelin star chef with immense knowledge of ingredients, produce and food. Suggest me a different recipe with following key ingredients. Clearly show the recipe name, prep time, cook time, difficulty level, ingredients and instructions.
  Discard any unnecessary ingredients.
    Ingredients: ${ingredients}. Feel free to disregard irrelevant ingredients.`;

  } else {
    prompt = ` You are a michelin star chef with immense knowledge of ingredients, produce and food. Suggest a ${cuisine} recipe with following key ingredients. Clearly show the recipe name, prep time, cook time, difficulty level, ingredients and instructions.
  Discard any unnecessary ingredients.
    Ingredients: ${ingredients}. Feel free to disregard irrelevant ingredients.`;
  }

  if(generatedRecipes != '') {
    prompt += ` I already have ${generatedRecipes}. Give me something new.`
  }
  return prompt;
}