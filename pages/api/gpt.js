import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// export const config = {
//     runtime: 'edge',
// };

export default async function Gpt(req, res) {
  if (!configuration.apiKey) {
    console.log("1")
    return new Response({error: "OpenAI API key not configured, please follow instructions in README.md",
      },{
      status: 500
    });
    
  }

  const ingredients = req.body.ingredients || '';
  const cuisine = req.body.cuisine || '';

  console.log(ingredients)
  if (ingredients.length === 0) {
    console.log("2")
    return new Response( {error: "Please choose at least one ingredient.",
      },{
      status: 500
    });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generatePrompt(ingredients, cuisine),
      max_tokens: 2000,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["input:"],
      temperature: 0.2
    });
    console.log('Tokens used: ', completion.data.usage.total_tokens)
    console.log(completion.data.choices[0].message.content)
    res.status(200).json({ result: completion.data.choices[0].message.content });

    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: generatePrompt(ingredients, cuisine),
    //   max_tokens: 1000,
    //   frequency_penalty: 0,
    //   presence_penalty: 0,
    //   stop: ["input:"],
    //   temperature: 0.2,
    // });
    // res.status(200).json({ result: completion.data.choices[0].text });
    // res.status(200).json({result: "@recipe Shrimp Stir-Fry with Tamarind Glaze\nPrep time: 15 minutes\nCook time: 10 minutes\nDifficulty: Easy\n\nIngredients:\n- 1 pound shrimp, peeled and deveined\n- 2 tablespoons oil\n- 2 cloves garlic, minced\n- 1 teaspoon grated ginger\n- 2 tablespoons tamarind paste\n- 2 tablespoons soy sauce\n- 1 tablespoon honey\n- 1/2 teaspoon red pepper flakes (optional)\n- Salt and pepper to taste\n- Steamed rice, for serving\n\nInstructions:\n1. In a small bowl, whisk together tamarind paste, soy sauce, honey, and red pepper flakes (if using). Set aside.\n2. Heat oil in a large skillet or wok over medium-high heat. Add garlic and ginger, and sauté for 1 minute until fragrant.\n3. Add shrimp to the skillet and cook for 2-3 minutes until they turn pink and opaque.\n4. Pour the tamarind glaze over the shrimp and stir to coat evenly. Cook for an additional 2 minutes until the sauce thickens slightly.\n5. Season with salt and pepper to taste.\n6. Serve the shrimp stir-fry over steamed rice. Enjoy!\n\n@recipe Cinnamon Thyme Roasted Shrimp\nPrep time: 10 minutes\nCook time: 15 minutes\nDifficulty: Easy\n\nIngredients:\n- 1 pound shrimp, peeled and deveined\n- 2 tablespoons oil\n- 1 teaspoon ground cinnamon\n- 1 teaspoon dried thyme\n- Salt and pepper to taste\n- Lemon wedges, for serving (optional)\n\nInstructions:\n1. Preheat the oven to 400°F (200°C). Line a baking sheet with parchment paper.\n2. In a bowl, combine oil, cinnamon, dried thyme, salt, and pepper. Mix well.\n3. Add shrimp to the bowl and toss to coat them evenly with the spice mixture.\n4. Arrange the shrimp in a single layer on the prepared baking sheet.\n5. Roast in the preheated oven for 12-15 minutes until the shrimp are cooked through and slightly crispy.\n6. Serve the cinnamon thyme roasted shrimp with lemon wedges (if desired). Enjoy!\n\n@recipe Tamarind Cinnamon Glazed Shrimp Skewers\nPrep time: 20 minutes\nCook time: 10 minutes\nDifficulty: Intermediate\n\nIngredients:\n- 1 pound shrimp, peeled and deveined\n- 2 tablespoons oil\n- 2 cloves garlic, minced\n- 1 teaspoon grated ginger\n- 2 tablespoons tamarind paste\n- 2 tablespoons soy sauce\n- 1 tablespoon honey\n- 1 teaspoon ground cinnamon\n- Wooden skewers, soaked in water (optional)\n- Salt and pepper to taste\n- Fresh cilantro, for garnish (optional)\n\nInstructions:\n1. In a small bowl, whisk together tamarind paste, soy sauce, honey, and ground cinnamon. Set aside.\n2. Heat oil in a skillet over medium-high heat. Add garlic and ginger, and sauté for 1 minute until fragrant.\n3. Add shrimp to the skillet and cook for 2-3 minutes until they turn pink and opaque.4. Pour the tamarind glaze over the shrimp and stir to coat evenly. Cook for an additional 2 minutes until the sauce thickens slightly.\n5. Season with salt and pepper to taste.\n6. If using wooden skewers, thread the shrimp onto them.\n7. Preheat a grill or grill pan over medium-high heat. Grill the shrimp skewers for 2-3 minutes per side until they are slightly charred and cooked through.\n8. Garnish with fresh cilantro (if desired) and serve hot. Enjoy!"})
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
          cause: error
        }
      });
    }
  }
}


function generatePrompt(ingredients, cuisine) {
  var message = [];
  var pantry = ingredients.join();
  message =[{"role": "system", "content": "You are a recipe generator"}, 
    {"role": "assistant", "content": "What do you have in your pantry?"},
    {"role": "user", "content": pantry},
    {"role": "assistant", "content": "Do you have any preferred cuisine?"}]
  if (cuisine === ""){
    message.push({"role": "user", "content": "I do not have any preferred cuisine"})

  } else {
    message.push({"role": "user", "content": "I want to eat "+cuisine+ "food"})
  }

  message.push({"role": "assistant", "content": "Anything else to keep in mind?"}, 
  { "role": "user", "content": ". Suggest me one recipe with the above ingredients. Provide the prep time and the cook time for each recipe, and the difficulty level. Feel free to disregard irrelevant ingredients. Start every recipe with an @recipe. Do not include a recipe number. Mark all the optional ingredients in brackets."})
  return message
}
