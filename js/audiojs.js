	function initVolumeAxis(canvasWidth,canvasHeight){
		var waveFormObject = document.getElementById("waveform");
		var wavImage = waveFormObject.getContext("2d");
		var dBList = [-1,-3,-6,-9,-12,-15,-18,-21];
		var electricLevel = 0;
		wavImage.lineWidth = 1;
		wavImage.strokeStyle = 'rgba(0,53,0,1)'; 
		wavImage.fillStyle="rgba(150,150,150,1)"; 
		wavImage.font="1px Arial";
		wavImage.beginPath();

		for (var i = 0;i<=dBList.length -1;i++){
			electricLevel = Math.sqrt(Math.pow(10, dBList[i]/10));
			wavImage.moveTo(0,canvasHeight/2-Math.round(electricLevel*canvasHeight/2));
			wavImage.lineTo(canvasWidth,canvasHeight/2-Math.round(electricLevel*canvasHeight/2));
			wavImage.moveTo(0,canvasHeight/2+Math.round(electricLevel*canvasHeight/2));
			wavImage.lineTo(canvasWidth,canvasHeight/2+Math.round(electricLevel*canvasHeight/2));
		}
		wavImage.stroke();
		for (var i = 0;i<=dBList.length -1;i++){
			electricLevel = Math.sqrt(Math.pow(10, dBList[i]/10));
			wavImage.fillText(dBList[i]+"dB",canvasWidth - 35,canvasHeight/2-Math.round(electricLevel*canvasHeight/2)-2);
			wavImage.fillText(dBList[i]+"dB",canvasWidth - 35,canvasHeight/2+Math.round(electricLevel*canvasHeight/2)+10);
		}
	}
	function initTimeAxis(audioTime,canvasWidth,canvasHeight){
		var waveFormObject = document.getElementById("waveform");
		var wavImage = waveFormObject.getContext("2d");		
		var maxTimeMark = 20;
		var timeAxis = Math.ceil(audioTime/maxTimeMark/100)*100;
		var timeMarkNum = Math.ceil(audioTime/timeAxis);
		var timeStep = Math.ceil(canvasWidth/timeMarkNum);
		
		wavImage.translate(0.5,0.5);
		wavImage.lineWidth = 1;
		wavImage.fillStyle="rgba(150,150,150,1)"; 
		wavImage.font="1px Arial";
		wavImage.strokeStyle = 'rgba(15,15,15,1)'; 
		wavImage.beginPath();
		for(var i = 0;i<=timeMarkNum - 1;i++){
			wavImage.moveTo(timeStep*i,0);
			wavImage.lineTo(timeStep*i,canvasHeight);
		}
		wavImage.stroke();
		
		for(var i = 0;i<=timeMarkNum - 1;i++){
			wavImage.fillText(i*timeAxis+"ms",i*timeStep + 2,canvasHeight - 10);
		}
		var moveMarkObject = document.getElementById("movemark");
		var moveMark = moveMarkObject.getContext("2d");	
		moveMark.translate(0.5,0.5);
		moveMark.strokeStyle = 'rgba(255,255,0,1)'; 
		moveMark.backgroundAlpha = 0;
		moveMark.clearRect(0,0,canvasWidth,canvasHeight);
	}
	function drawWave(data,canvasWidth,canvasHeight,sampleDataNum){
		
		var waveFormObject = document.getElementById("waveform");
		var wavImage = waveFormObject.getContext("2d");
		var stepLength = 2;
		var samplePosition = 44;
		var amplitude = 0;
		var yHeight = canvasHeight/2;
		var samplePointNum = Math.floor(sampleDataNum/2);
		wavImage.translate(0.5,0.5);
		wavImage.lineWidth = 1;
		wavImage.strokeStyle = 'rgba(75,243,167,1)'; 
		wavImage.beginPath();		
		wavImage.scale(canvasWidth/(samplePointNum), 1); 
		wavImage.moveTo(0,yHeight);
		wavImage.lineTo(canvasWidth,yHeight);
		wavImage.moveTo(0,yHeight);
		for (var i = 0;i <= samplePointNum;i++){		
			amplitude = twoBytesToSigned(data[samplePosition], data[samplePosition+1])*canvasHeight>>16;			
			wavImage.lineTo(i,yHeight);
			wavImage.moveTo(i+1,yHeight-amplitude);
			samplePosition = samplePosition + stepLength;
		}
		wavImage.stroke();
	}
	function twoBytesToSigned(a, b){
		if (b<0){
			var temp1 = (b>>>0<<8)&0xffff;
			var temp2 = a>>>0&0xff;
			return (temp1 + temp2)-65536;
		}else{
			var temp1 = (b>>>0<<8)&0xffff;
			var temp2 = a>>>0&0xff;
			return (temp1 + temp2);
		}
	}
	function fourBytesToSigned(a, b, c, d){
		var temp1 = signedToUnsigned(d)*Math.pow(2,24);
		var temp2 = signedToUnsigned(c)*Math.pow(2,16);
		var temp3 = signedToUnsigned(b)*Math.pow(2,8);
		var temp4 = signedToUnsigned(a);
		return (temp1 + temp2 + temp3 + temp4);		
	}
	
	function signedToUnsigned(a){
		if (a<=0){
			return (a&0xff)>>>0;
		}else{
			return a;
		}
	}
			
	function timeMarkDraw(canvasWidth, canvasHeight,position){
		var moveMarkObject = document.getElementById("movemark");
		var moveMark = moveMarkObject.getContext("2d");	
		moveMark.clearRect(0,0,canvasWidth,canvasHeight);
		moveMark.lineWidth = 1;
		moveMark.moveTo(position,0);
		moveMark.lineTo(position,canvasHeight);
		moveMark.stroke();
	}
	
	function timeMarkController(canvasWidth,canvasHeight,audioTime){
		var media = document.getElementById("audioid");
		var currentTime = media.currentTime;
		var position = Math.floor(canvasWidth*currentTime*1000/audioTime);
		var timeStep = 100;
		//setInterval(timeMarkDraw(canvasWidth, canvasHeight,Math.floor(canvasWidth*currentTime*1000/audioTime)+100),timeStep);	

	}	