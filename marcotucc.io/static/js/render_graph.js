// import { data } from './graph_data.js';
import { data } from "./parse_graph.js";

// Set up the SVG
const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create force simulation
let simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Create groups for main graph and projects graph
const mainGroup = svg.append("g") // appending a "g" means adding <g></g> groups that are used to render svg things in the browser

// Draw links
let links = mainGroup.append("g")
    .selectAll("line") // Create an empty selection of <line> elements
    .data(data.links)  // Bind the data to this selection
    .enter()           // Identify data items without corresponding DOM elements
    .append("line")    // Create and append a <line> element for each data item
    .attr("class", "link"); // Set attributes for the new <line> elements

// Draw nodes
let nodes = mainGroup.append("g")
    .selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", d => `node ${d.central ? 'central-node' : ''}`)
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
    .on("click", select_node);


// Add circles to nodes
nodes.append("circle")
    .attr("r", n => n.central ? 95 : 35)

// Add labels to nodes
nodes.append("text")
    .text(d => d.label)
    .attr("dy", ".38em");

// Update positions on each tick
simulation.on("tick", () => {
    links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

// Drag functions
function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}

function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}

function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}


let centralNode = nodes.filter(d => d.central);
let selectedNode = centralNode


function select_node(event) {
    
    nodes.selectAll("text").style("font-weight", "normal")
    
    if (!d3.select(this).datum().central) {
        if (d3.select(this).datum() != selectedNode.datum()) {
            selectedNode = d3.select(this)
            selectedNode.select("text").style("font-weight", "bold") 
        }
        else {
            selectedNode.select("text").style("font-weight", "normal") 
            centralNode.select("text").style("font-weight", "bold")
            selectedNode = centralNode
        }
    }

    else {
        centralNode.select("text").style("font-weight", "bold")
    }

};

function navigate_to_url(event) {
    const node = d3.select(this).datum();
    const nodeUrl = node.url

    // Use the History API to change the URL without reloading the page
    history.pushState({ nodeId: node.id }, node.name, nodeUrl);
    // document.getElementById("content-panel").innerHTML = `<p>${node.label}</p>`

    fetch(nodeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response error");
            }
            return response.text();
        })
        .then(htmlContent => {
            document.getElementById("content-panel").innerHTML = htmlContent
        })
        .catch(error => {
            console.error("Error fetching node content:", error);
            document.getElementById("content-panel").innerHTML = "<p>Error</p>"
        })


    // // Fetch node content using AJAX
    // fetch(nodeUrl)
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.error) {
    //             document.getElementById('content-panel').innerHTML = `<p>${data.error}</p>`;
    //         } else {
    //             document.getElementById('content-panel').innerHTML = `
    //                 <h1>${data.name}</h1>
    //                 <p>${data.description}</p>
    //             `;
    //         }
    //     })
    //     .catch(error => console.error('Error fetching node content:', error));
}

nodes.on("click", navigate_to_url);

// // Handle browser back/forward navigation
// window.onpopstate = function(event) {
//     if (event.state && event.state.nodeId) {
//         const nodeId = event.state.nodeId;
//         const nodeUrl = event.state.nodeUrl;
        
//         document.getElementById("content-panel").innerHTML = 

//         // // Fetch and display the content for the node
//         // fetch(nodeUrl)
//         //     .then(response => response.json())
//         //     .then(data => {
//         //         if (data.error) {
//         //             document.getElementById('content-panel').innerHTML = `<p>${data.error}</p>`;
//         //         } else {
//         //             document.getElementById('content-panel').innerHTML = `
//         //                 <h1>${data.name}</h1>
//         //                 <p>${data.description}</p>
//         //             `;
//         //         }
//         //     })
//         //     .catch(error => console.error('Error fetching node content:', error));
//     }
// };

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