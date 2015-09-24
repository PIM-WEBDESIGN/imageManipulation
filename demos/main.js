

var jcrop_api;
var coord = {};
var ctx = "";

var imageObj = new Image();
imageObj.src = 'demo_files/pepsi2.png';	



function saveCoords(c)
{
	coord = c;
};


function crop(){
	
	jcrop_api.release();
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var sourceX = coord.x;
	var sourceY = coord.y;
	var sourceWidth = coord.w;
	var sourceHeight = coord.h;
	var destWidth = canvas.width;
	var destHeight = canvas.height;
	var destX = 0;
	var destY = 0;

	
	
	if(sourceX != undefined){
		if($(canvas).css('display') == "block"){
			convertCanvasToImage(canvas,function(imageObj){
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);			
			/*	var resCanvas = document.getElementById('resultImg');
				var resCtx = resCanvas.getContext('2d');
				var width =(imageObj.width/imageObj.height) * 100;
				resCtx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight,0,0,width,100);
				coord = {};
				});
			*/
			
			})
	
		}
		else{			
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			$('#target').css('display','none');
			
			$('#myCanvas').css('display','block');
			
			ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
			
			var resCanvas = document.getElementById('resultImg');
			var resCtx = resCanvas.getContext('2d');
			
			
			var width =(imageObj.width/imageObj.height) * 100;
			
			resCtx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight,0,0,width,100);
			coord = {};
			/*
			convertCanvasToImage(canvas,function(imageObj){
				var myCanvas = document.getElementById('resultImg');
				var ctx = myCanvas.getContext('2d');
				alert(imageObj.height);
				 
				alert(myCanvas.height);
				ctx.drawImage(imageObj,0,0); // Or at whatever offset you like			
			});*/
			
		}
	}
	
}
var tests = {			
	'posterize': {
		effect : "posterize",
		options : {
			levels : 5
		}
	},
	
	'color' : { 
		effect : "colorfilter",
		options : {
			r : 0,
			g : 194 / 255,
			b : 177 / 255,
			luminosity : 0
		}
	}, 
	'blur' : {
		effect : "blur",
		options : {
			kernelSize : 5
		}
	},
	'brightness' : {
		effect : "brightness",
		options : {
			brightness : -1.00,
			contrast : -0.1
		}
	}
	
};

function convertCanvasToImage(canvas,callback) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	//console.log(image);
	callback(image);
}

function doTest(test) {
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');
	
	var img = "";
	if($(canvas).css('display') == "block"){
		convertCanvasToImage(canvas,function(image){
			img = image;
		});
	}
	else{
		img = document.getElementById("target");	
		$('#target').css('display','none');
		$('#myCanvas').css('display','block');
	}
	
	var P;
	
	test =  test.toString();
	
	// canvas.style.display = "none";
	//canvas.width = img.width;
	//canvas.height = img.height;
	canvas.title = tests[test].effect;
	ctx.drawImage(img, 0, 0);
	
	P = new Pixastic(ctx);
	
	//console.log(tests[test].effect);
	
	P[tests[test].effect](tests[test].options).done(function() {
		//alert('completed');
		canvas.style.display = "block";
		}, function(p) {
		console.log(p);
	});
}


window.onload  = function(){
	var image  = new Image();
	image.src = 'demo_files/pepsi2.png';
	
	jQuery(function($){
	$('#div').Jcrop({
		onChange:   saveCoords,
		onSelect:   saveCoords
		},function(){
		jcrop_api = this;
	});
});


$('#btn').on('click', function(){
	$('.showdiv').fadeToggle('slow');
});
$('.btn').on('click',function(){
	var effectName  =  $(this).val();
	console.log(effectName);	
	doTest(effectName);
})

$('#brightness').on('input',function(){
	var val = $('#brightness').val();
	console.log(val);
	tests['brightness'].options =  {brightness : val,
		contrast : 0
	}
	doTest('brightness');
});

$('#reset').on('click',function(){
	$('#brightness').val('0')
	

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	$('#myCanvas').css('display','none');
	$('#target').css('display','block');
});




}		