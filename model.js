import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1';

// Initialize the text generation pipeline
let generator = null;

async function initializeModel() {
    try {
        generator = await pipeline('text-generation', 'Xenova/gpt2');
        console.log('Model loaded successfully');
    } catch (err) {
        console.error('Error loading model:', err);
    }
}

async function generateText(inputText) {
    if (!generator) {
        console.log('Model is still loading...');
        return 'Model is still loading, please wait...';
    }

    if (!inputText || inputText.trim() === '') {
        return 'Please enter some text to generate from.';
    }

    try {
        const result = await generator(inputText, {
            max_new_tokens: 100, // Increased token length
            num_return_sequences: 1,
            temperature: 0.9, // Increased temperature for more creative outputs
            do_sample: true,
            top_k: 50,
            top_p: 0.95
        });

        if (!result || !result[0] || !result[0].generated_text) {
            throw new Error('No text generated');
        }

        // Remove the input prompt from the generated text
        const generatedText = result[0].generated_text.slice(inputText.length);
        return generatedText || 'Could not generate meaningful text. Please try again.';

    } catch (err) {
        console.error('Error generating text:', err);
        return 'Error generating text. Please try again.';
    }
}

// Initialize the model when the script loads
initializeModel();

export { generateText };