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
		this.func(0);
	}
	process(inputs, outputs, parameters) {
		const output = outputs[0];
		output.forEach((channel) => {
			for (let i = 0; i < channel.length; i++) {
				this.t++;
				let t = Math.floor(this.t/this.audioContextSR*this.sampleRate);
				if(this.type == 0)
					channel[i] = wrap(this.func(+t),0,256)/128-1;
				else if(this.type == 1)
					channel[i] = wrap(this.func(+t)+127,0,256)/128-1;
				else if(this.type == 2)
					channel[i] = Math.min(Math.max(this.func(+t),-1),1);
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