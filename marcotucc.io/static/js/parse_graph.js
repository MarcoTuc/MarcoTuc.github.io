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


function parse_graph(node, from = null, depth = 0) {
    if (Array.isArray(node)) { node = node[0] }
    if (!node.url) {
        node.url = '/nodes/' + node.id 
    }
    if (depth > 1) {
        node.url = from.url + "/" + node.id
        console.log(node.url)
    }
    nodes.push(node)
    if (from != null) {
        links.push({
            source: from.id,
            target: node.id
        })
    }
    if (node.children.length > 0) {
        depth += 1 
        for (let i = 0; i < node.children.length; i++) {
            parse_graph(node.children[i], from = node, depth = depth)
        }
    }
}

parse_graph(graph_json)

console.log(nodes)

export const data = {
    nodes: nodes,
    links: links
}

