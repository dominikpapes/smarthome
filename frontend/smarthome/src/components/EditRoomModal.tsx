import { Button, Card, Form, Stack } from "react-bootstrap";
import { useState, useEffect } from "react";
import { AirConditioner, Light, Room } from "../interfaces/Interfaces";
import NewAirConditionerForm from "./NewAirConditionerForm";
import Slider from "./Slider";
import NewLightForm from "./NewLightForm";

interface Props {
  room: Room;
  onClose: () => void;
  onSubmit: (
    updatedRoom: Room,
    acs_to_delete: number[],
    lights_to_delete: number[]
  ) => void;
}

function EditRoomModal({ room, onClose, onSubmit }: Props) {
  const [updatedRoom, setUpdatedRoom] = useState<Room>(room);
  const [showNewAc, setShowNewAc] = useState(false);
  const [showNewLight, setShowNewLight] = useState(false);
  const [acsToDelete, setAcsToDelete] = useState<number[]>([]);
  const [lightsToDelete, setLightsToDelete] = useState<number[]>([]);

  useEffect(() => {
    setUpdatedRoom(room);
  }, [room]);

  function handleSliderChange(
    type: "temperature" | "fan" | "intensity",
    id: number,
    value: number
  ) {
    if (type === "temperature" || type === "fan") {
      const updatedAcs = updatedRoom.airconditioners.map((ac) =>
        ac.id === id
          ? {
              ...ac,
              [type === "temperature" ? "temperature" : "fanSpeed"]: value,
            }
          : ac
      );
      setUpdatedRoom({ ...updatedRoom, airconditioners: updatedAcs });
    } else {
      const updatedLights = updatedRoom.lights.map((light) =>
        light.id === id ? { ...light, intensity: value } : light
      );
      setUpdatedRoom({ ...updatedRoom, lights: updatedLights });
    }
  }

  function handleAddAc(newAc: AirConditioner) {
    setUpdatedRoom((prevRoom) => ({
      ...prevRoom,
      airconditioners: [
        ...prevRoom.airconditioners,
        { ...newAc, acId: Date.now() },
      ],
    }));
    setShowNewAc(false); // Hide form after submission
  }

  function handleAddLight(newLight: Light) {
    setUpdatedRoom((prevRoom) => ({
      ...prevRoom,
      lights: [...prevRoom.lights, { ...newLight, lightId: Date.now() }],
    }));
    setShowNewLight(false); // Hide form after submission
  }

  function handleDeleteAc(acId: number) {
    // dodaj u listu acs_to_delete i nju predaj u delete_acs
    setAcsToDelete((prevAcsToDelete) => [...prevAcsToDelete, acId]);
    const updatedAcs = updatedRoom.airconditioners.filter(
      (ac) => ac.id !== acId
    );
    setUpdatedRoom({ ...updatedRoom, airconditioners: updatedAcs });
  }

  function handleDeleteLight(lightId: number) {
    // dodaj u listu lights_to_delete i nju predaj u delete_lights
    setLightsToDelete((prevLightsToDelete) => [...prevLightsToDelete, lightId]);
    const updatedLights = updatedRoom.lights.filter(
      (light) => light.id !== lightId
    );
    setUpdatedRoom({ ...updatedRoom, lights: updatedLights });
  }

  function handleToggleAc(acId: number) {
    const updatedAcs = updatedRoom.airconditioners.map((ac) =>
      ac.id === acId ? { ...ac, turned_on: !ac.turned_on } : ac
    );
    setUpdatedRoom({ ...updatedRoom, airconditioners: updatedAcs });
  }

  function handleToggleLight(lightId: number) {
    const updatedLights = updatedRoom.lights.map((light) =>
      light.id === lightId ? { ...light, turned_on: !light.turned_on } : light
    );
    setUpdatedRoom({ ...updatedRoom, lights: updatedLights });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(acsToDelete);
    onSubmit(updatedRoom, acsToDelete, lightsToDelete);
    onClose();
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Card className="room-edit">
          <h3>Klima uređaji</h3>
          {updatedRoom.airconditioners.map((ac) => (
            <Card className="p-3 m-1" key={ac.id}>
              <Stack direction="horizontal">
                <Form.Label>{ac.name}</Form.Label>
                <Button
                  variant="danger"
                  className="ms-auto"
                  onClick={() => handleDeleteAc(ac.id)}
                  title="Delete"
                >
                  <i className="fa-solid fa-xmark"></i>
                </Button>
              </Stack>
              <Form.Check
                type="switch"
                id={`ac-switch-${ac.id}`}
                label={ac.turned_on ? "Uključeno" : "Isključeno"}
                checked={ac.turned_on}
                onChange={() => handleToggleAc(ac.id)}
              />
              <Slider
                minValue={18}
                maxValue={30}
                givenSelected={ac.temperature}
                typeOfValue="Temperatura"
                unit="°C"
                onChange={(value) =>
                  handleSliderChange("temperature", ac.id, value)
                }
                disabled={!ac.turned_on}
              />
              <Slider
                minValue={1}
                maxValue={5}
                givenSelected={ac.fan_speed}
                typeOfValue="Fan Speed"
                unit=""
                onChange={(value) => handleSliderChange("fan", ac.id, value)}
                disabled={!ac.turned_on}
              />
            </Card>
          ))}
          <Button
            onClick={() => setShowNewAc(!showNewAc)}
            variant={showNewAc ? "danger" : "primary"}
            className="w-25 mt-2"
          >
            {showNewAc ? "Odustani" : "Dodaj"}
          </Button>
          {showNewAc && <NewAirConditionerForm onSubmit={handleAddAc} />}
        </Card>

        <Card className="room-edit">
          <h3>Svjetla</h3>
          {updatedRoom.lights.map((light) => (
            <Card className="p-3 m-1" key={light.id}>
              <Stack direction="horizontal">
                <Form.Label>{light.name}</Form.Label>
                <Button
                  variant="danger"
                  className="ms-auto"
                  onClick={() => handleDeleteLight(light.id)}
                  title="Delete"
                >
                  <i className="fa-solid fa-xmark"></i>
                </Button>
              </Stack>

              <Form.Check
                type="switch"
                id={`light-switch-${light.id}`}
                label={light.turned_on ? "Uključeno" : "Isključeno"}
                checked={light.turned_on}
                onChange={() => handleToggleLight(light.id)}
              />
              <Slider
                minValue={1}
                maxValue={5}
                givenSelected={light.intensity}
                typeOfValue="Intensity"
                unit=""
                onChange={(value) =>
                  handleSliderChange("intensity", light.id, value)
                }
                disabled={!light.turned_on}
              />
            </Card>
          ))}
          <Button
            onClick={() => setShowNewLight(!showNewLight)}
            variant={showNewLight ? "danger" : "primary"}
            className="w-25 mt-2"
          >
            {showNewLight ? "Odustani" : "Dodaj"}
          </Button>
          {showNewLight && <NewLightForm onSubmit={handleAddLight} />}
        </Card>

        <Button variant="primary" type="submit">
          U redu
        </Button>
      </Form>
    </>
  );
}

export default EditRoomModal;
