
// Quad. Draws a rectangle in a given color.

function Quad(x, y, width, height, color = "white", text='', funcion)
{
	this.x = x
	this.y = y
	this.width = width
	this.height = height
	this.color = color

	this.ymin = y -height;
	this.ymax = y;
	this.xmin = x;
	this.xmax = x+width;


	this.text = text;
	this.funcion = function(){
		funcion()
	};
}

Quad.prototype.update = function(deltaTime){
	if(this.ymin<yClick && this.ymax>yClick && this.xmin<xClick && this.xmax>xClick){
		this.funcion();
		yClick=0;
		xClick=0;
	}
	
}

Quad.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the rectangle
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);

	context.font = "10px Mario";
	context.fillStyle = "#293935";
	var textSize = context.measureText(this.text);
		//context.fillText(text, 256 - textSize.width/2, 224 + 36);
	context.fillText(this.text, this.x + this.width / 2 - textSize.width / 2, this.y + this.height / 2 + textSize.actualBoundingBoxAscent / 2);
}


