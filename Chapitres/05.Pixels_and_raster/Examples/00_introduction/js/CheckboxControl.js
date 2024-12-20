export default class CheckboxControl {
  constructor({ label, checked = true, onChange }) {
    this.container = document.createElement("div");
    this.container.className = "checkbox-control";

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.checked = checked;

    const labelElement = document.createElement("label");
    labelElement.textContent = label;

    this.container.appendChild(this.checkbox);
    this.container.appendChild(labelElement);

    this.checkbox.addEventListener("change", (e) => {
      onChange(e.target.checked);
    });

    // Append directly to body instead of looking for .controls
    document.body.appendChild(this.container);
  }
}
