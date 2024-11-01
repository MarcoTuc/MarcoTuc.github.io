import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.15.1';

// Initialize the text generation pipeline
let generator = null;

async function initializeModel() {
    try {
        generator = await pipeline('text2text-generation', 'Xenova/t5-small');
        console.log('Model loaded successfully');
    } catch (err) {
        console.error('Error loading model:', err);
    }
}

async function generateText(inputText) {
    if (!generator) {
        console.log('Model is still loading...');
        return;
    }

    try {
        const result = await generator(inputText, {
            max_length: 100,
            num_return_sequences: 1
        });
        return result[0].generated_text;
    } catch (err) {
        console.error('Error generating text:', err);
        return 'Error generating text. Please try again.';
    }
}

// Initialize the model when the script loads
initializeModel();

export { generateText }; 