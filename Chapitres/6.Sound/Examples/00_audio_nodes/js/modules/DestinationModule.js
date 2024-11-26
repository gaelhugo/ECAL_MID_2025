import BaseModule from "./BaseModule.js";

export default class DestinationModule extends BaseModule {
  constructor(context, id, x, y) {
    super(context, id, x, y);
    this.type = "destination";
    this.height = 80;

    // Use audio context destination
    this.audioNode = this.audioContext.destination;

    // Only input, no outputs
    this.inputs = [{ x: 0, y: this.height / 2 }];
    this.outputs = [];

    // No controls needed
    this.controls = [];
  }
}
