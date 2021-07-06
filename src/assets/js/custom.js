$(document).ready(function() {  
	var nice = $("html").niceScroll();  // The document page (body)	
	$("#div1").html($("#div1").html()+' '+nice.version); 
    $(".scroll_outer").niceScroll(".scroll_inner",{cursorcolor:"#92a5b5",cursoropacitymax:1,boxzoom:true,touchbehavior:true});  // Second scrollable DIV   

    
    $(".file_fields_outer").niceScroll(".file_fields_list",{cursorcolor:"#92a5b5",cursoropacitymax:1,boxzoom:true,touchbehavior:true});  // Second scrollable DIV  

    $(".schema_outer").niceScroll(".schema_inner",{cursorcolor:"#92a5b5",cursoropacitymax:1,boxzoom:true,touchbehavior:true});  // Second scrollable DIV   

    $(".data-ingestion-fileouter").niceScroll(".data-ingestion-filelist",{cursorcolor:"#92a5b5",cursoropacitymax:1,boxzoom:true,touchbehavior:true});  // Second scrollable DIV 

    var minThread = 0;
    var maxThread = 20;
    $('#threadInc').click(function(){
    	var myvar = Number($('.thread-to-spawn span').text());
    	if(myvar <= maxThread){
    		$('.thread-to-spawn span').html(myvar + 1);
    	}
    	
    });
    $('#threadDec').click(function(){
    	var myvar = Number($('.thread-to-spawn span').text());
    	if(myvar > minThread){
    		$('.thread-to-spawn span').html(myvar - 1);
    	}
    	
    });

    $('#freqInc').click(function(){
        var myvar = Number($('.data-frequency-cont input[type="text"]').val());
        if(myvar <= 20){
            $('.data-frequency-cont input[type="text"]').val(myvar + 1);
        }
        
    });
    $('#freqDec').click(function(){
        var myvar = Number($('.data-frequency-cont input[type="text"]').val());
        if(myvar > 0){
            $('.data-frequency-cont input[type="text"]').val(myvar - 1);
        }
        
    });

  });