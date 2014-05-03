/*********************************************************
*	Bouncing Circle
*	Created 9/29/2013 by Carlo Wahlstedt
**********************************************************/

$(function(){
	
});

var DrawingApp = function(options) {
    // grab canvas element
    var canvas = document.getElementById("canvas"),
        ctxt = canvas.getContext("2d"),
        curColor = "black",
		curSize = 2,
		lines = [,,],
    	offset = $(canvas).offset(),
    	colorsShowing = false,
    	selColor = curColor;

	var numberOfCircles = 16;
	//setup the drawing area
	var drawingAreaX = 0,
		drawingAreaY = 0,
		drawingAreaWidth = 480,
		drawingAreaHeight = 480;

    //setup the canvas context
    ctxt.lineWidth = 0;
    ctxt.lineCap = "round";
    ctxt.pX = undefined;
    ctxt.pY = undefined;
	ctxt.beginPath();
	ctxt.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	ctxt.closePath();
	ctxt.lineWidth = "1";
	ctxt.strokeStyle = "black";
	ctxt.fillStyle = "white";
	ctxt.fill();
	ctxt.strokeRect(drawingAreaX, drawingAreaY, drawingAreaWidth+7, drawingAreaHeight+7);
	
	//list of pen sizes
	var cursor = { size:5, radius:5, location:canvas.width-55 },
     	colorX = 5,
    	colorY = canvas.height-48;

	//where the magic happens
    var self = {
		//this is the single press event
        preDraw: function(event) {
            $.each(event.touches, function(i, touch) {
            	var x = this.pageX - offset.left,
	            	y = this.pageY - offset.top,
                	id = touch.identifier;

                //if it's in the drawing area then record the draw
            	if (y < drawingAreaHeight && x < drawingAreaWidth) {
	                lines[id] = { x     : x, 
	                              y     : y, 
	                              color : curColor,
	                              size 	: curSize
	                           };
	                //force a dot to be drawn
                   	self.move(id, 1, 0);
            	} else {
            		//this checks if the cusor size needs to be changed
            		var redraw = false;
					for (i = 0; i < cursor.length; i++) {
	            		if (x > cursor[i].location-25 && x < cursor[i].location+15) {
	            			curSize = cursor[i].radius;
	            			redraw = true;
						}
					}
	            	if (redraw) self.drawCursors();
					//if the color wheel is pressed
					if (x > colorX-20 && x < colorX+40) {
						self.showColors();
					}
					//check to see if the trashcan was clicked
					if (x > trashX && x < trashX+40) {
						var ck = confirm("Are you sure you want to clear your drawing?");
						if (ck == true) {
							lines = [];
							ctxt.clearRect(drawingAreaX, drawingAreaY, drawingAreaWidth+10, drawingAreaHeight+10);
							self.drawRect();
						}
					}
					//check to see if the save button was clicked
					if (x > saveX && x < saveX+40){
						var ck = confirm("Save your drawing?");
						if (ck == true) {
							self.saveImg(true, false);
						}
					}

					//share the drawing
					if (x > shareX && x < shareX+40) {
						var fileName = self.saveImg(false, true);
						//here is where the file is sent to be shared
			          	window.plugins.shareImage.share("image", { fileName:fileName }, 
				       		function(result) {
				          		//alert(result);
					       	}, function(error) {
					          	alert('Error: ' + error);
					       	}
				       	);

					}
            	}
            });
			//prevent scrolling
            event.preventDefault();
        },
        //when the screen is touched this where the drawing happens
        draw: function(event) {
            $.each(event.touches, function(i, touch) {
                var	x = this.pageX - offset.left,
                	y = this.pageY - offset.top;
                //only store the keystrokes if they are in the drawing area
            	if (y < drawingAreaHeight && x < drawingAreaWidth) {
                	var id = touch.identifier,
                    	moveX = x - lines[id].x,
                    	moveY = y - lines[id].y;
                    if (x != moveX || y != moveY) {                	
		                var ret = self.move(id, moveX, moveY);
		                lines[id].x = ret.x;
		                lines[id].y = ret.y;
                    }
               	}
            });
        },
        //this is where the actual drawing on the screen happens
        move: function(i, changeX, changeY) {
            ctxt.strokeStyle = lines[i].color;
			ctxt.lineWidth = lines[i].size;
            ctxt.beginPath();
            ctxt.moveTo(lines[i].x, lines[i].y);

            ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
            ctxt.stroke();
            ctxt.closePath();

            return { x: lines[i].x + changeX, y: lines[i].y + changeY };
        }
    };
	//create the box to draw in
	self.drawRect();
	//now draw the cursors on screen and select the one in use
	self.drawCursors();

	//starts the drawing app
    return self.init();
};