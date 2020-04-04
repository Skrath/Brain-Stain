
$(function() {

    function newtest() {
        var randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        $('.colorbox').css('background-color', '#'+randomColor);

        $.ajax({
            dataType: "json",
            url: "/result",
            data: {
                color: randomColor
            },
            success: function( result ) {
                console.log(result);
                $('.colorbox p').css('color', result.value);
                $('#responseform #generation').val(result.reference.generation);
                $('#responseform #index').val(result.reference.index);

                var connections = result.reference.brain.connections.map(obj => {
                    obj.source = obj.from;
                    obj.target = obj.to;
                    return obj
                 })
                console.log(result.reference.brain.nodes);
                console.log(connections);

                // var circles = d3.select("svg").select("g").selectAll("circle").data(result.reference.brain.nodes);
                // circles.exit().remove();//remove unneeded circles
                // circles.enter().append("circle")
                //     .attr("r", 5)
                //     .attr("fill", "red");//create any new circles needed

                // var lines = d3.select("svg").select("g").selectAll("line").data(connections);
                // lines.exit().remove();
                // lines.enter().append("line")
                //     .attr("stroke-width", 2);

                redrawBrain(result.reference.brain.nodes, connections);
            }
        });
    }

    $("#responseform").submit(function(e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.
    
        var form = $(this);
        var url = form.attr('action');
    
        $.ajax({
               type: "POST",
               url: "/submitscore",
               data: form.serialize(), // serializes the form's elements.
               success: function(data)
               {
                    console.log(data);
                    newtest();
               }
             });
    });

    newtest();
});


