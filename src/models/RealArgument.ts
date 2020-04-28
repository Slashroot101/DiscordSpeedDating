export class RealArgument {
	readonly value: string;
	readonly argIndex: number;

	constructor(value: string, argIndex: number){
		this.value = value;
		this.argIndex = argIndex;
	}
}