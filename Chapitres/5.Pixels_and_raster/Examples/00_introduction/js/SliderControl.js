export default class SliderControl {
  constructor({ min, max, value, label, onChange }) {
    this.container = document.createElement("div");
    this.container.className = "slider-control";

    const labelElement = document.createElement("label");
    labelElement.textContent = label;

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = min;
    this.input.max = max;
    this.input.value = value;

    this.container.appendChild(labelElement);
    this.container.appendChild(this.input);

    this.input.addEventListener("input", (e) => {
      onChange(parseInt(e.target.value));
    });

    document.body.appendChild(this.container);
  }

  setValue(value) {
    this.input.value = value;
  }
}
