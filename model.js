import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.1';

generator = pipeline("text2text-generation")

async function generateText(inputText) {
    if (!inputText || inputText.trim() === '') {
        return 'Please enter some text to generate from.';
    }

    
    const result = await generator(inputText, {
        max_new_tokens: 100, // Increased token length
        num_return_sequences: 1,
        temperature: 0.9, // Increased temperature for more creative outputs
        do_sample: true,
        top_k: 50,
        top_p: 0.95
    });

    return result

}

export { generateText };