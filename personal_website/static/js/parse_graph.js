const element = document.getElementById("tree-container");

let graph_json
var nodes = []
var links = []


await fetch("static/js/graph.json")
    .then(response => response.json())
    .then(data => {
        graph_json = data
    })

const svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)

function log_leaves(node) {
    for (let n = 0; n < node.length; n++) {
        console.log(node[n])
    }
}

function parse_graph(node, from = null) {
    if (Array.isArray(node)) { node = node[0] }
    nodes.push(node)
    if (from != null) {
        links.push({
            source: from.id,
            target: node.id
        })
    }
    if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            parse_graph(node.children[i], from = node)
        }
    }
}

parse_graph(graph_json)

export const data = {
    nodes: nodes,
    links: links
}
