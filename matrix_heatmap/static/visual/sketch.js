let matrixData;
let maxVal;

async function computeMatrix() {
    const n = document.getElementById('matrixSize').value;
    
    try {
        const response = await fetch('/compute_matrix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ n: parseInt(n) })
        });
        const data = await response.json();
        matrixData = data.matrix;
        maxVal = data.max_val;
        redraw();
    } catch (error) {
        console.error('Error:', error);
    }
}

function setup() {
    noLoop();
    const canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
}

function draw() {
    background(255);
    if (!matrixData) return;

    const n = matrixData.length;
    const margin = 30;
    
    // Calculate cell size based on canvas size and matrix dimensions
    const cellSize = min((width - 2 * margin) / n, (height - 2 * margin) / n);
    
    // Center the matrix
    translate(margin, margin);
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const value = matrixData[i][j];
            // Map value to color intensity
            const col = map(value, 0, maxVal, 55, 200);
            fill(col, 100, 255 - col);
            stroke(167);
            strokeWeight(40/n);
            rect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

async function generateText() {
    const prompt = document.getElementById("inputText").value

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: prompt })
        });
        const data = await response.json();
        const textContainer = document.getElementById("text-container");
        textContainer.textContent = data.text;
    }
    catch (error) {
        console.error("Error:", error)
    }
}