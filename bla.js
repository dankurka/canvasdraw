var x = function(file, color) {

	var priv = {

	};
	priv.on = color;

	priv.off = 0;

	priv.data = [];

	priv.width = 1040;
	priv.height = 1040;

	priv.pixelSize = 20;
	priv.pixelRadius = 5;

	priv.loadFile = function(fileName, callback) {
		var xmlHttpObject = new XMLHttpRequest();

		xmlHttpObject.open("GET", fileName, false);

		xmlHttpObject.send(null);

		if (xmlHttpObject.status == 0) {
			callback(xmlHttpObject.responseText);
		} else {
			alert("kann json file nicht laden!");
		}

	};

	priv.init = function() {
		var i = 0;
		for (; i < priv.width; i++) {
			priv.data[i] = new Array(priv.height);
		}
	};

	priv.init();

	priv.drawPixel = function(x, y, color1, color2) {
		x = Math.floor(x);
		y = Math.floor(y);
		//console.log("x: " + x + " y: " + y);
		var middle_x = x + priv.pixelSize / 2;
		var middle_y = y + priv.pixelSize / 2;

		var i;
		var j;

		for (i = x; i < x + priv.pixelSize; i++) {
			for (j = y; j < y + priv.pixelSize; j++) {
				var dist = Math.sqrt((middle_x - i) * (middle_x - i)
						+ (middle_y - j) * (middle_y - j));
				if (dist < priv.pixelRadius) {
					priv.data[i][j] = color1;
				} else {
					if(priv.data[i][j] == priv.on){
						
					}else{
						priv.data[i][j] = color2;
					}
					
				}
			}
		}
	};

	priv.drawData = function(ctx) {
		var pixel = ctx.getImageData(0, 0, 1040, 1040);

		var i, j;
		var index;

		for (i = 0; i < priv.data.length; i++) {
			var array = priv.data[i];
			
			for (j = 0; j < array.length; j++) {
				index = i  * 4* priv.width + 4 * j ;

				// this.drawPixel(x, y);
				if (array[j] == priv.on) {
					pixel.data[index] = priv.on;
				} else {
					pixel.data[index] = priv.off;
				}

				pixel.data[index + 1] = 0;
				pixel.data[index + 2] = 0;
				pixel.data[index + 3] = 255;
			}
		}

		ctx.putImageData(pixel, 0, 0);

	};

	priv.checkData = function(data) {
		if (data.length != 361) {
			alert("data array not okay");
			return false;
		}

		var i;
		for (i = 0; i < data.length; i++) {
			var len = data[i].length;
			if (len != 24) {
				alert("data array not okay");
				return false;
			}
		}
		return true;
	};

	priv.drawToDataArray = function(data) {
		var i, j, array;
		var x, y;
		var winkel;
		var dist = data[0];

		for (i = 1; i < data.length; i++) {
			array = data[i];

			for (j = 0; j < array.length; j++) {
				winkel = Math.PI / 2 + i * 2 * Math.PI / 360;
				
				x = Math.cos(winkel) * dist[j];
				y = Math.sin(winkel) * dist[j];
				
				//console.log("winkel: " + winkel + " x: " + x + " y: " + y +  " dist:" + dist[j]);
				
				if (array[j] == 1) {
					priv.drawPixel(520 + x, 520 + y, priv.on, priv.off);
				} else {
					priv.drawPixel(520 + x, 520 + y, priv.off, priv.off);
				}
				
				

			}
			
			
		}
	};

	priv.doStuff = function(fileName) {

		var that = this;

		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");

		this.loadFile(fileName, (function(data) {
			var evalData = eval(data);

			if (priv.checkData(evalData)) {
				priv.drawToDataArray(evalData);

				that.drawData(ctx);
			} else {
				alert("data not okay");
			}

		}));

	};

	priv.doStuff(file);

};
