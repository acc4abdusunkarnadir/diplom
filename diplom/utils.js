const axios = require('axios');

const apiKey = "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"; // Replace this

async function completeChat(prompt) {
    const url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };
    const payload = {
        inputs: prompt
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const result = response.data;

        if (Array.isArray(result) && result[0]?.generated_text) {
            return result[0].generated_text.trim();
        } else {
            return "Sorry, I couldn't understand that.";
        }
    } catch (error) {
        console.error("Error calling Hugging Face API:", error.message);
        return "Error connecting to AI service.";
    }
}

// Example usage
completeChat("Tell me a joke about cats.").then(console.log);
