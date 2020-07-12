let video;
let poseNet;
let pose;
let stop = 0;
let fim = 0;
var i = 1;
var Np = 16284;
var grafxr = [];
var grafyr = [];
    
var grafxl = [];
var grafyl = [];
var Graf1 =[];

const savitzkyGolay = require('ml-savitzky-golay');

average = function(a){
    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
    for(var m, s = 0, l = t; l--; s += a[l]);
    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
    return r.deviation = Math.sqrt(r.variance = s / t), r;
}

function setup() {
 if (stop != 1){
   canvas= createCanvas(640,480);
   video = createCapture(VIDEO);
   video.hide()
   poseNet = ml5.poseNet(video, modelLoaded);
   poseNet.on('pose', gotPoses);
   }
}

function Graf(xr, yr, xl, yl){
	this.xr = xr;
	this.yr = yr;
	this.xl = xl;
	this.yl = yl;
}


function gotPoses(poses){
 if (stop != 1){ 
   console.log(poses)
   if (poses.length > 0){
     pose = poses[0].pose;
     skeleton = poses[0].skeleton;

   }
  }
}

function modelLoaded(){
   console.log('poseNet ready');
}



draw = function(){

  image(video, 0, 0);
   if (stop != 1){
    if (pose){
     let eyeR = pose.rightEye;
     let eyeL = pose.leftEye;
     let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

     
     // Para apenas os 2 pontos

     fill('green');
     ellipse(pose.rightShoulder.x , pose.rightShoulder.y , 2*d/5);
     ellipse(pose.leftShoulder.x , pose.leftShoulder.y , 2*d/5);

     var xr = pose.rightShoulder.x;
     var yr = pose.rightShoulder.y;
     var xl = pose.leftShoulder.x ;
     var yl = pose.leftShoulder.y ; 

     var adicionar = grafxr.push(xr );
     var adicionar = grafyr.push(yr);
     var adicionar = grafxl.push(xl);
     var adicionar = grafyl.push(yl );

     Graf1.push({xr1 : xr , yr1 : yr, xl1 : xl, yl1 : yl });
     i++;

    
     

     line(pose.rightShoulder.x  , pose.rightShoulder.y , pose.leftShoulder.x , pose.leftShoulder.y );
     setTimeout(Stop, 30000);
  

   }
  }
 return [yr,yl]; 
}


function Stop() {
  stop = 1;
  video.remove()
  canvas.remove()
  
  var _gerarCsv = function(){
     
    var csv = 'Xr, Yr, Xl, Yl\n';
 
    Graf1.forEach(function(row) {
            csv += row.xr1;
            csv += ','+ row.yr1;
            csv += ','+ row.xl1;
	    csv += ','+ row.yl1;
            csv += '\n';
    });
    
    
   var hiddenElement = document.createElement('a');
   hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
   hiddenElement.target = '_blank';
   hiddenElement.download = 'dados.csv';
   hiddenElement.click();
};





function _analise(yr,yl){
	
	var yrm = average(grafyr).mean;
	var yrs = average(grafyr).deviation;
	var ylm = average(grafyl).mean;
	var yls = average(grafyl).deviation;

	var yr_yrm = grafyr.map( x => x - yrm); 
	var yr_norm = yr_yrm.map(x => x / yrs);
	var yl_ylm = grafyl.map( x => x - ylm); 
	var yl_norm = yl_ylm.map(x => x / yls);
	
	var sumy = yr_norm.map( (x,i) => x + yl_norm[i]);

	let options = { derivative: 0, polynomial: 0, windowSize: 53};
	let sumy1 = savitzkyGolay(sumy, 1, options); 
	document.write( "sumy ",sumy,"<br />","sumy1 ",sumy1);
}
	
	



 if (fim!=1){
  _gerarCsv();
}


 fim =1;


_analise(draw()[0], draw()[1]);

    
}
