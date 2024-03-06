var audioContext;
var analyzer;
var node;
var editor;
var dataArray;
var bufferLength;
var paused = false;
var playing = false;

const shittylibrary = [{e:'t*(42&t>>10)',t:0,s:8000},{e:'10*(t&5*t|t>>6|(t&32768?-6*t/7:(t&65536?-9*t&100:-9*(t&100))/11))',t:0,s:8000},{e:'(t^t>>12)*t>>8',t:0,s:22050},{e:'w=t>>9,k=32,m=2048,a=1-t/m%1,d=(14*t*t^t)%m*a,y=[3,3,4.7,2][p=w/k&3]*t/4,h="IQNNNN!!]]!Q!IW]WQNN??!!W]WQNNN?".charCodeAt(w/2&15|p/3<<4)/33*t-t,s=y*.98%80+y%80+(w>>7&&a*((5*t%m*a&128)*(0x53232323>>w/4&1)+(d&127)*(0xa444c444>>w/4&1)*1.5+(d*w&1)+(h%k+h*1.99%k+h*.49%k+h*.97%k-64)*(4-a-a))),s*s>>14?127:s',t:1,s:8000},{e:'d=t*465/(43+6*(t>>15&3^1)),((d/4&t>>6)+d/2&127)+(d/6&127)',t:0,s:8000},{e:'a=(((t>>12&31)==31)?(t/((t>>11&1)?4:2))>>(((t/((t>>11&1)?4:2))>>(t/(t>>11&1?28:14)))&7):(t>>5&t>>9|t>>6&t>>10|t>>9&t>>11|t/4%9&t>>6|t/6&t>>12|t/10&t>>14|t/4&t>>15|t/6&t>>16|t/8&t>>17|t/12&t>>18)),(((a&1)+(a&2)/2-1)/2+((a&1)+(a%4)/3-1)/2)/2',t:2,s:9000},{e:'t||(A=0,B=0,C={p:-1,t:0}),va={_:0,A:698.45,B:659.25,C:783.99,D:880,E:587.32,F:523.25,G:261.62,H:246.94,I:220,J:195.99,K:349.22,L:329.62,M:391.99,N:65.4,O:73.41,P:92.49},d0=`________________________________________________________________________________________________________________________________________________________________A000B000A000B000C000D000C000D000E000B000E000B000A000B000E000F000A000B000A000B000C000D000C000D000E000B000E000B000A000B000E000F000A000B000A000B000C000D000C000D000E000B000E000B000A000B000E000F000A000B000A000B000C000D000C000D000E000B000E000B000A000B000E000F000`,d1=`G000000_G000000_G000000_G0000000H0000000____H0000000____H0000000____H0000000____H0000000G0000000H0000000____H0000000____H0000000____H0000000____H0000000I000J000K00_K00_K00_K00_K00_K000L0K_K00_K00_K00_K00_K00_K00_K000M0K_K00_K00_K00_K00_K00_K00_K000L0K_K00_K00_K00_K00_K00_K00_K000M0K_K00_K00_K00_K00_K00_K00_K000L0K_K00_K00_K00_K00_K00_K00_K000M0K_K00_K00_K00_K00_K00_K00_K000L0K_K00_K00_K00_K00_K00_K00_K000M0K_K000`,d2=`N000O_O0N000000_N000O000N000O_O0N0000000P00_P000O0000000P00_P000N0000000P00_P000O0000000P00_P000N0000000P00_P000O0000000P00_P000N0000000P00_P000N000O000N000O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000N00_N000P000O_O0N000P000N0P0O000`,po=t/2205%416,pf=floor(po),(re=t/30.76/5.5125*va[d0[d0[pf]==0?A:A=pf]]%256/255*85.33333333333333+t/30.76/5.5125*va[d1[d1[pf]==0?B:B=pf]]%256/255*85.33333333333333+((va[d2[po]]==65.4?(C.p=t,C.t=0):va[d2[po]]==73.41?(C.p=t,C.t=1):va[d2[po]]==92.49?(C.p=t,C.t=2):0),t>=C.p&&C.p!=-1?(C.t===0?sin(cbrt((t-C.p)*(8000/44100*500)))*127+127:C.t===1?t*(sin(floor(t/8/(44100/8000)))/2+1)%256/256*(256-min((t-C.p)/8/(44100/8000),256)):C.t===2?((2&t)*64|random()*64)*max(8192-(t-C.p),0)/8192:0):0)%256/255*85.33333333333333)?min(re,255):0',t:0,s:44100},{e:"T=t*1.02,\nt/=(T>>19&1?2:1),\nT/=(T>>19&1?2:1),\nc=1.047,cs=1.107,d=1.174,ds=1.243,e=1.318,f=1.389,fs=1.476,g=1.568,gs=1.655,a=1.754,as=1.857,b=1.977,A=t*'23423423'[T>>12&7],B=t*[2,3.185,4,2,3.185,4,2,3.185][T>>12&7],('099900900090909999099090099000000'[[A,A,A,A,A,A,A,B][T>>15&7]*[b,b,b,d*2,g,g,fs,as][T>>15&7]>>6&31]*64+(T&T>>9)%256/4)+((4e5/(T&8192*2-1)|0)%256/2)",t:0,s:48000}];

function init() {
	editor = ace.edit("editor");
	editor.session.setUseWorker(false);
	editor.setOption('wrap', true);
	editor.session.setMode("ace/mode/javascript");
	editor.session.on('change', function(delta) {
		compile();
		document.getElementById('size').innerText = editor.getValue().length+'c';
	});
	//compile();
	var canvasCtx = document.getElementById('canvas').getContext("2d");
	canvasCtx.fillStyle = "black";
	canvasCtx.fillRect(0, 0, 1024, 256);
}

async function loadExp(i) {
	var song = shittylibrary[i];
	editor.session.setValue(song.e);
	document.getElementById('type').selectedIndex = song.t;
	document.getElementById('sampleRate').value = song.s;
	if(audioContext) {
		await stop();
		await play();
	}
}

function compile(stopped=false) {
	if(!audioContext) return;
	if(node) node.disconnect();
	node = new AudioWorkletNode(
		audioContext,
		"processor",
		{
			processorOptions: {
				expr: editor.getValue(),
				audioContextSR: audioContext.sampleRate,
				sampleRate: document.getElementById('sampleRate').value,
				type: document.getElementById('type').selectedIndex,
				startFrom: stopped?0:Math.floor(audioContext.currentTime*document.getElementById('sampleRate').value)
			}
		}
	);
	node.connect(analyzer);
	analyzer.connect(audioContext.destination);
}

function draw() {
	var canvasCtx = document.getElementById('canvas').getContext("2d");
	analyzer.getByteTimeDomainData(dataArray);
	requestAnimationFrame(draw);
	canvasCtx.fillStyle = "black";
	canvasCtx.fillRect(0, 0, 1024, 256);
	canvasCtx.lineWidth = 1;
	canvasCtx.strokeStyle = "white";
	canvasCtx.beginPath();
	const sliceWidth = 1024 / bufferLength;
	let x = 0;
	for (let i = 0; i < bufferLength; i++) {
		const v = dataArray[i] / 128.0;
		const y = 256 - v * 128;

		if (i === 0) {
			canvasCtx.moveTo(x, y);
		} else {
			canvasCtx.lineTo(x, y);
		}

		x += sliceWidth;
	}
	canvasCtx.lineTo(1024, 128);
	canvasCtx.stroke();
	if(audioContext) document.getElementById('time').value = Math.floor(audioContext.currentTime*100)/100;
	else document.getElementById('time').value = 0;
}

async function stop() {
	if(playing) {
		playing = false;
		await audioContext.close();
		audioContext = null;
		paused = false;
		document.getElementById('btn-play').innerText = '▶️';
	}
}

async function play() {
	if(!audioContext) {
		audioContext = new AudioContext({sampleRate:48000});
		await audioContext.audioWorklet.addModule("processor.js");
		analyzer = audioContext.createAnalyser();
		analyzer.fftSize = 2048;
		bufferLength = analyzer.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		draw();
		compile(true);
		playing = true;
		document.getElementById('btn-play').innerText = '⏸️';
	}
}

window.onload = init;
document.getElementById('btn-play').onclick = async function() {
	if(!audioContext)
		await play();
	else if(!paused && playing) {
		await audioContext.suspend();
		paused = true;
		document.getElementById('btn-play').innerText = '▶️';
	} else {
		await audioContext.resume();
		paused = false;
		document.getElementById('btn-play').innerText = '⏸️';
	}
};
document.getElementById('canvas').onclick = document.getElementById('btn-play').onclick;
document.getElementById('btn-stop').onclick = stop;
document.getElementById('sampleRate').onchange = function() {
	if(audioContext) compile();
};
document.getElementById('sampleRates').onchange = function() {
	document.getElementById('sampleRate').value = document.getElementById('sampleRates').value;
	if(audioContext) compile();
};
document.getElementById('type').onchange = function() {
	if(audioContext) compile();
};