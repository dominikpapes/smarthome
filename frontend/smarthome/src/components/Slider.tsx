import { useState } from "react";

interface Props {
  minValue: number;
  maxValue: number;
  givenSelected: number;
  typeOfValue: string;
  unit: string;
  onChange?: (value: number) => void;
  disabled?: boolean; // Add the optional disabled prop
}

function Slider(props: Props) {
  const [selectedValue, setSelectedValue] = useState(props.givenSelected);
  function handleSlide(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setSelectedValue(value);
    if (props.onChange) props.onChange(value);
  }

  return (
    <div>
      <p>
        {props.typeOfValue}: {selectedValue}
        {props.unit}
      </p>
      <input
        type="range"
        className="form-range"
        min={props.minValue}
        max={props.maxValue}
        value={selectedValue}
        onChange={handleSlide}
        disabled={props.disabled} // Use the disabled prop
      />
    </div>
  );
}

export default Slider;
