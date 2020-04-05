$(function () {

    var nodes_data = [
        {
            bias: -0.6118263011744194,
            type: 'input',
            squash: 'LOGISTIC',
            mask: 1,
            index: 0
        },
        {
            bias: -0.8103608002843123,
            type: 'output',
            squash: 'LOGISTIC',
            mask: 1,
            index: 1
        }
    ]

    var links_data = [{ weight: 0.5708069428622515, source: 0, target: 1, gater: null }]

    createBrain(nodes_data, links_data);
});

function redrawBrain(brain, links_data) {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var nodes_data = brain.nodes;
    brain.input_nodes.forEach((index, i) => {
        nodes_data[index].fx = 5;
        nodes_data[index].fy = (i * 15) + 15;
    });
    brain.output_nodes.forEach((index, i) => {
        nodes_data[index].fx = (width - 5);
        nodes_data[index].fy = (i * 15) + 15;
    });
    

    svg.select("g").selectAll("line").remove();
    svg.select("g").selectAll("circle").remove();

    //draw circles for the nodes 
    var node = svg.select("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes_data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "blue");

    //draw lines for the links 
    var link = svg.select("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", 2);

    drawBrain(nodes_data, links_data, node, link);
}

function drawBrain(nodes_data, links_data, node, link) {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    //set up the simulation 
    //nodes only for now 
    var simulation = d3.forceSimulation()
        //add nodes
        .nodes(nodes_data);

    //add forces
    //we're going to add a charge to each node 
    //also going to add a centering force
    simulation
        .force("charge_force", d3.forceManyBody())
        .force("center_force", d3.forceCenter(width / 2, height / 2));


    //add tick instructions: 
    simulation.on("tick", tickActions);

    //Create the link force 
    //We need the id accessor to use named sources and targets 

    var link_force = d3.forceLink(links_data)
        .id(function (d) { return d.index; })

    //Add a links force to the simulation
    //Specify links  in d3.forceLink argument   


    simulation.force("links", link_force)

    function tickActions() {
        //update circle positions each tick of the simulation 
        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

        //update link positions 
        //simply tells one end of the line to follow one node around
        //and the other end of the line to follow the other node around
        
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; })
            .attr("stroke-width", function (d) { return (d.weight + 2) * 2});

    }
}

function createBrain(nodes_data, links_data) {

    //create somewhere to put the force directed graph
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");


    //draw circles for the nodes 
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes_data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "red");
        
    //draw lines for the links 
    var link = svg.select("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", 2);

    drawBrain(nodes_data, links_data, node, link);
}