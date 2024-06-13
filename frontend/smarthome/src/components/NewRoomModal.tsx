import { useState, useEffect } from "react";
import { Alert, Button, Card, Form, Modal, Stack } from "react-bootstrap";
import AirConditionerView from "./AirConditionerView";
import LightsView from "./LightsView";
import NewAirConditionerForm from "./NewAirConditionerForm";
import NewLightForm from "./NewLightForm";
import { Room, AirConditioner, Light } from "../interfaces/Interfaces";
import { initialRoomState } from "../config/InitialStates";

interface Props {
  show: boolean;
  addRoom: (room: Room) => void;
  handleClose: () => void;
}

function NewRoomModal(props: Props) {
  const [newRoom, setNewRoom] = useState<Room>(initialRoomState);
  const [nameLengthWarning, setNameLengthWarning] = useState(false);

  useEffect(() => {
    if (!props.show) {
      setNewRoom(initialRoomState);
    }
  }, [props.show]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
    if (newRoom.name.length > 20) {
      setNameLengthWarning(true);
    } else {
      setNameLengthWarning(false);
    }
  }

  function handleAddAc(newAc: AirConditioner) {
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      airconditioners: [...prevRoom.airconditioners, { ...newAc }],
    }));
  }

  function handleAddLight(newLight: Light) {
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      lights: [...prevRoom.lights, { ...newLight }],
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (!nameLengthWarning) {
      e.preventDefault();
      props.addRoom(newRoom);
      props.handleClose();
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      centered
      backdrop="static"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>Stvori novu sobu</Modal.Header>
        <Modal.Body>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Naziv sobe</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newRoom.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Alert show={nameLengthWarning} className="m-3">
              Ime ne smije biti dulje od 20 znakova.
            </Alert>
            <Card className="p-1 mb-3">
              <Card.Title>Klima uređaji</Card.Title>
              <Stack direction="vertical" gap={1} className="devices-list mb-2">
                {newRoom.airconditioners.map((ac, index) => (
                  <AirConditionerView
                    key={index}
                    acName={ac.name}
                    temperature={ac.temperature}
                    fanSpeed={ac.fan_speed}
                    turnedOn={true}
                  />
                ))}
              </Stack>
              <NewAirConditionerForm onSubmit={handleAddAc} />
            </Card>

            <Card className="p-1 mb-3">
              <Card.Title>Svjetla</Card.Title>
              <Stack direction="vertical" gap={1} className="devices-list mb-2">
                {newRoom.lights.map((light, index) => (
                  <LightsView
                    key={index}
                    lightName={light.name}
                    intensity={light.intensity}
                    turnedOn={true}
                  ></LightsView>
                ))}
              </Stack>

              <NewLightForm onSubmit={handleAddLight} />
            </Card>
          </Card.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            OK
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NewRoomModal;
