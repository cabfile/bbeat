class BytebeatProcessor extends AudioWorkletProcessor {
	constructor(opt) {
		super();
		var fakeWindow = {};
		var mathNames = Object.getOwnPropertyNames(Math);
		var mathProps = mathNames.map((prop) => {
			return Math[prop];
		});
		mathNames.push('int','window');
		mathProps.push(Math.floor,fakeWindow);
		var prefunc = new Function(...mathNames, 't', 'return '+opt.processorOptions.expr);
		this.func = prefunc.bind(null,...mathProps);
		this.audioContextSR = opt.processorOptions.audioContextSR;
		this.sampleRate = opt.processorOptions.sampleRate;
		this.type = opt.processorOptions.type;
		this.t = opt.processorOptions.startFrom;
		this.samp = opt.processorOptions.sampling;
		this.ls = 0;
		this.nn=v=>isNaN(v)?this.ls:this.ls=v;
		this.isStereo = Array.isArray(this.func(0));
	}
	process(inputs, outputs, parameters) {
		const output = outputs[0];
		output.forEach((channel) => {
			for (let i = 0; i < channel.length; i++) {
				this.t++;
				let t = this.t/this.audioContextSR*this.sampleRate;
				if(!this.samp) t = Math.floor(t);
				let res = this.func(+t);
				if(this.isStereo) res = (res[0]+res[1])/2; // we have no support for stereo so this is the best we can do
				res = this.nn(res);
				if(this.type == 0)
					channel[i] = wrap(res,0,256)/128-1;
				else if(this.type == 1)
					channel[i] = wrap(res+127,0,256)/128-1;
				else if(this.type == 2)
					channel[i] = Math.min(Math.max(res,-1),1);
			}
		});
		return true;
	}
}

function wrap(val,min,max) {
	return (((val - min) % (max - min)) + (max - min)) % (max - min) + min;
}

registerProcessor("processor", BytebeatProcessor);

// note: i have no idea what im doing this sucks and i need help
// note: hello