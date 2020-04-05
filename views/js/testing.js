
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

                redrawBrain(result.reference.brain, connections);
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


