import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import Slider from "./Slider";
import { Light } from "../interfaces/Interfaces";
import { initialLightState } from "../config/InitialStates";

interface props {
  onSubmit: (newLight: Light) => void;
}

function NewLightForm(props: props) {
  const [newLight, setNewLight] = useState<Light>(initialLightState);
  const [nameLengthWarning, setNameLengthWarning] = useState(false);

  function handleLightChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewLight((prevLight) => ({
      ...prevLight,
      [name]: value,
    }));
    if (newLight.name.length > 20) {
      setNameLengthWarning(true);
    } else {
      setNameLengthWarning(false);
    }
  }

  function handleSliderChange(value: number) {
    setNewLight({ ...newLight, intensity: value });
  }

  function handleSubmit(e: React.FormEvent) {
    if (!nameLengthWarning) {
      e.preventDefault();
      props.onSubmit(newLight);
      setNewLight(initialLightState);
    }
  }
  return (
    <Card className="p-2 m-2">
      <Form.Group className="mb-3">
        <Form.Label>Naziv svjetla</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={newLight.name}
          onChange={handleLightChange}
        />
        <Alert show={nameLengthWarning} className="m-3">
          Ime ne smije biti dulje od 20 znakova.
        </Alert>
        <Slider
          minValue={1}
          maxValue={5}
          givenSelected={newLight.intensity}
          typeOfValue="Intenzitet"
          unit={""}
          onChange={(value) => handleSliderChange(value)}
        />
      </Form.Group>
      <Button
        variant="success"
        disabled={nameLengthWarning}
        size="sm"
        onClick={handleSubmit}
      >
        Dodaj
      </Button>
    </Card>
  );
}

export default NewLightForm;
