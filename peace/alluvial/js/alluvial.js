// Jquery-UI Dialog function:
$( function() {
    $("#dialog" ).dialog({
    autoOpen: false,
    show: {
        effect: "blind",
        duration: 1000
    },
    hide: {
        effect: "blind",
        duration: 1000
    },
    });

    $( "#opener" ).on( "click", function() {
        $( "#dialog" ).dialog("open");
    });

    // Initial dialog
    $( "#dialog" ).dialog({
        autoOpen: true,
        width: 400,
        height: 500
    });
})

// Branch highlight:
function getlights() {
    $("rect,text").on({"mouseover": function () {
        var myclass = $(this).attr('class');
        //console.log("myclass: "+myclass+" | this:"+event.target.nodeName);
        $(".b, ."+myclass).stop(true,true).addClass("mybranch", 500);
    },
    mouseleave: function () {
        //var myclass = $(this).attr('class');
        $(".b, rect,text").stop(true,true).removeClass("mybranch", 500);
    }
    });
}

// toggle SVG' path view

$("#a1").click(function(){
    $("path").toggle('slow');
    if ($("rect").css("fill") == "rgb(255, 0, 0)") {
        $("rect").css("fill","white");  
    } else {
        $("rect").css("fill","red");  
    }
});



// Menu
$("#menu").menu({
   position: { my: "left top", at: "right-5 top+5" },
   select: function( event, ui ) {}
});
$("button").on('click', function() {
    $('button').removeClass("myselected");
    $(this).addClass("myselected");
})
// SVG Business
function mysvgkit(my) {
    // SVG loading + pan&zoo2
    $('#svgfile').load('./svgs/'+my+'-.svg').delay(2000).promise().done(function(){
        
        if (my=='99') {myz = 1 } else {
            myz = 1;
        }
        // Center the SVG through science$()
        const elem = document.getElementById('mysvg')
        const panzoom = Panzoom(elem, {
            maxScale: 20 
        })
        panzoom.zoom(myz  , { animate: true })
        panzoom.pan(10, 10, { relative: false })

        // Panning and pinch zooming are bound automatically (unless disablePan is true).
        // There are several available methods for zooming
        // that can be bound on button clicks or mousewheel.
        //button.addEventListener('click', panzoom.zoomIn)
        elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)          
    });    

}
mysvgkit('99');
