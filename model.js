import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.1';

const generator = pipeline("text2text-generation")

async function generateText(inputText) {
    if (!inputText || inputText.trim() === '') {
        return 'Please enter some text to generate from.';
    }
    const result = await generator(inputText);
    return result

}

export { generateText };