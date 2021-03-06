<!DOCTYPE html>
<html lang="en">
<head>
<title>Basic Handler | Jcrop Demo</title>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />

<script src="../js/jquery.min.js"></script>
<script src="../js/jquery.Jcrop.js"></script>
<link rel="stylesheet" href="demo_files/main.css" type="text/css" />
<link rel="stylesheet" href="demo_files/demos.css" type="text/css" />
<link rel="stylesheet" href="../css/jquery.Jcrop.css" type="text/css" />
<script src="pixastic.js"></script>
<script src="pixastic.effects.js"></script>
<script src="pixastic.worker.js"></script>


</head>
<body>

<div class="container">
<div class="row">
<div class="width-center">
<div class="jc-demo-box">

<div id="div" >
<img src="demo_files/sagomod.png" id="target"  width='600px' height='400px'  alt="[Jcrop Example]" />
<canvas id="myCanvas"  style="display : none"  width='600px' height='400px'></canvas>
</div>
<input type="button" id="btn" value="Edit" class="btn-inverse" >
<div class="showdiv" style="display:none">

<input class="btn btn-info" type="button"  id="blur" value="blur"></input>	

<input class="btn btn-info" type="button"  id="posterize"  value="posterize"></input>	

<input class="btn btn-info" type="button"  id="colorfilter" value="color"></input>	

<input type="range"  min="-5" max ="5" id="brightness" ></input>	

<input id="reset" type="button" value="reset" class="btn-primary" ></button>

<!--					<div class="clearfix"></div>-->
<button id="crop" value="crop" onclick='crop()' class="btn-danger">Crop</button> 
</div>
</div>
</div>
</div>
</div>

</body>
<script type="text/javascript">
$('#btn').on('click', function(){
	$('.showdiv').fadeToggle('slow');
	
});


var jcrop_api;
var coord = {};
jQuery(function($){
	$('#div').Jcrop({
		onChange:   saveCoords,
		onSelect:   saveCoords
		},function(){
		jcrop_api = this;
	});
});

var imageObj = new Image();
imageObj.src = 'demo_files/sagomod.png';	

function saveCoords(c)
{
	coord = c;
};

$('.btn').on('click',function(){
	var effectName  =  $(this).val();
	console.log(effectName);	
	doTest(effectName);
})

$('#brightness').on('input',function(){
	var val = $('#brightness').val();
	console.log(val);
	tests['brightness'].options = {
		brightness : val,
		contrast : 0.1
	}
	
	doTest('brightness');
	
});

$('#reset').on('click',function(){
	
	$('#brightness').val('0');
	$('#myCanvas').css('display','none');
	$('#target').css('display','block');
	
});


function crop(){
	
	jcrop_api.release();
	
	var canvas = document.getElementById('myCanvas');
	
	var sourceX = coord.x;
	var sourceY = coord.y;
	var sourceWidth = coord.w;
	var sourceHeight = coord.h;
	var destWidth = canvas.width;
	var destHeight = canvas.height;
	var destX = 0;
	var destY = 0;
	
	if(sourceX != undefined){
		
		
		var context = canvas.getContext('2d');
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		console.log(sourceX + "   "  +  sourceY);
		console.log(sourceWidth + "   " +  sourceHeight);
		
		$('#target').css('display','none');
		
		$('#myCanvas').css('display','block');
		
		
		
		context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		var imageData = context.getImageData(destX, destY, destWidth, destHeight);
		var data = imageData.data;
		var dataURL = canvas.toDataURL();
		coord = {};
		console.log(dataURL)
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
	callback(image);
}

function doTest(test){
	
	//var img = document.getElementById("target"), 
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
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
		ctx.drawImage(img, 0, 0,canvas.width,canvas.height,0, 0,canvas.width,canvas.height);
	}
	
	var P;
	
	test =  test.toString();
	canvas.title = tests[test].effect;
	//console.log($('#canvas'));
	
	P = new Pixastic(ctx);
	//P.revert($('#myCanvas'));
	
	
	//	 P("blur", {amount:0}); //This should remove the blur
	//	 P("brightness", {amount:0}); //This should remove the blur
	//	 P("posterize", {amount:0}); //This should remove the blur
	//	 P("color", {amount:0}); //This should remove the blur
	
	P[tests[test].effect](tests[test].options).done(function() {
		canvas.style.display = "block";
		}, function(p) {
	});
}

</script>

</html>

