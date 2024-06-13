import { Alert, Button, Card, Form } from "react-bootstrap";
import Slider from "./Slider";
import { useState } from "react";
import { AirConditioner } from "../interfaces/Interfaces";
import { initialAcState } from "../config/InitialStates";

interface props {
  onSubmit: (ac: AirConditioner) => void;
}
function NewAirConditionerForm(props: props) {
  const [newAc, setNewAc] = useState<AirConditioner>(initialAcState);
  const [nameLengthWarning, setNameLengthWarning] = useState(false);

  function handleAcChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewAc((prevAc) => ({
      ...prevAc,
      [name]: value,
    }));
    if (newAc.name.length > 20) {
      setNameLengthWarning(true);
    } else {
      setNameLengthWarning(false);
    }
  }

  function handleSliderChange(
    type: "temperature" | "fan" | "intensity",
    value: number
  ) {
    if (type === "temperature") {
      setNewAc({ ...newAc, temperature: value });
    } else if (type === "fan") {
      setNewAc({ ...newAc, fan_speed: value });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    if (!nameLengthWarning) {
      e.preventDefault();
      props.onSubmit(newAc);
      setNewAc(initialAcState);
    }
  }
  return (
    <Card className="p-2 m-2">
      <Card.Title>Novi klima uređaj</Card.Title>
      <Form.Group className="mb-3">
        <Form.Label>Naziv klima uređaja</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={newAc.name}
          onChange={handleAcChange}
        />
        <Alert show={nameLengthWarning} className="m-3">
          Ime ne smije biti dulje od 20 znakova.
        </Alert>
        <Slider
          minValue={18}
          maxValue={30}
          givenSelected={newAc.temperature}
          typeOfValue="Temperatura"
          unit={"°C"}
          onChange={(value) => handleSliderChange("temperature", value)}
        />
        <Slider
          minValue={1}
          maxValue={5}
          givenSelected={newAc.fan_speed}
          typeOfValue="Brzina ventilatora"
          unit=""
          onChange={(value) => handleSliderChange("fan", value)}
        />
      </Form.Group>
      <Button
        variant="success"
        size="sm"
        onClick={handleSubmit}
        disabled={nameLengthWarning}
      >
        Dodaj
      </Button>
    </Card>
  );
}

export default NewAirConditionerForm;
