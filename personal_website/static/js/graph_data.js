// Graph data
// This is a mockup of the graph data. Eventually I'd like to construct some json-based tree-like structure with fields referring to urls that point to the pages relative to the selected node. But let's go one step at a time. 

export const data = {
    nodes: [
        { id: "marco", label: "Marco Tuccio", central: true},
        { id: "about", label: "About" },
        { id: "projects", label: "Projects" },
        { id: "contact", label: "Contact" },
        { id: "photos", label: "Photos" }
    ],
    links: [
        { source: "marco", target: "about" },
        { source: "marco", target: "projects" },
        { source: "marco", target: "contact" },
        { source: "marco", target: "photos" }
    ]
};