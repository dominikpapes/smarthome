import { useEffect, useState } from "react";
import { Card, Button, Modal, Stack } from "react-bootstrap";
import EditRoomModal from "../components/EditRoomModal";
import ConfirmationModal from "../components/ConfirmModal";
import NewRoomModal from "../components/NewRoomModal";
import AirConditionerView from "../components/AirConditionerView";
import LightsView from "../components/LightsView";
import { Room } from "../interfaces/Interfaces";
import { initialRoomState } from "../config/InitialStates";
import {
  deleteAcs,
  deleteLights,
  deleteRoom,
  getRooms,
  postRoom,
  updateAcs,
  updateLights,
} from "../api/functions";

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([initialRoomState]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const token = localStorage.getItem("token") || " ";

  function loadRooms() {
    getRooms(token).then((data: any) => {
      setRooms(data);
    });
  }

  const handleShowEditModal = (myRoom: Room) => {
    setShowEditModal(true);
    setSelectedRoom(myRoom);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowConfirmModal = (myRoom: Room) => {
    setShowConfirmModal(true);
    setSelectedRoom(myRoom);
  };

  async function handleConfirmDeleteRoom() {
    if (selectedRoom) {
      // setRooms(deleteRoomById(rooms, selectedRoom.id));
      await deleteRoom(selectedRoom.id, token);
      loadRooms();
      setShowConfirmModal(false);
    }
  }

  const handleCancelDeleteRoom = () => {
    setShowConfirmModal(false);
  };

  const handleShowNewRoomModal = () => {
    setShowNewRoomModal(true);
  };

  const handleCloseNewRoomModal = () => {
    setShowNewRoomModal(false);
  };

  async function handleAddRoom(newRoom: Room) {
    // ovdje treba staviti logiku za POST prema serveru koji ce stvarima dodijeliti prave ID-jeve
    let addedRoom: Room = await postRoom(newRoom, token);
    console.log(addedRoom);
    // za svaki ac i light napravi post
    newRoom.airconditioners.map((ac) => {
      ac.room = addedRoom.id;
    });
    newRoom.lights.map((light) => {
      light.room = addedRoom.id;
    });
    await Promise.all([
      updateAcs(newRoom.airconditioners, token),
      updateLights(newRoom.lights, token),
    ]);

    loadRooms();
  }

  async function handleEditRoom(
    updatedRoom: Room,
    acs_to_delete: number[],
    lights_to_delete: number[]
  ) {
    console.log("Updated room", updatedRoom);
    updatedRoom.airconditioners.map((ac) => (ac.room = updatedRoom.id));
    updatedRoom.lights.map((light) => (light.room = updatedRoom.id));
    await Promise.all([
      deleteAcs(acs_to_delete, token),
      deleteLights(lights_to_delete, token),
      updateAcs(updatedRoom.airconditioners, token),
      updateLights(updatedRoom.lights, token),
    ]);
    setShowEditModal(false);
    loadRooms();
  }

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <>
      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-info">
            <Card.Header>
              <Stack direction="horizontal">
                <h3>{room.name}</h3>
                <Button
                  variant="dark"
                  className="ms-auto"
                  onClick={() => handleShowEditModal(room)}
                  title="Edit"
                >
                  <i className="fa-solid fa-pen"></i>
                </Button>
              </Stack>
              <h6>{room.hour}:00</h6>
              <h6>{room.temperature}°C</h6>
            </Card.Header>
            <Card.Body>
              {room.airconditioners.length > 0 && (
                <>
                  <h4 className="mt-2">Klima uređaji</h4>

                  <Stack
                    direction="vertical"
                    gap={1}
                    className="devices-list"
                    key={room.id}
                  >
                    {room.airconditioners.map((ac) => (
                      <AirConditionerView
                        key={ac.id}
                        acName={ac.name}
                        temperature={ac.temperature}
                        fanSpeed={ac.fan_speed}
                        turnedOn={ac.turned_on}
                      ></AirConditionerView>
                    ))}
                  </Stack>
                </>
              )}

              {room.lights.length > 0 && (
                <>
                  <h4 className="mt-2">Svjetla:</h4>

                  <Stack
                    direction="vertical"
                    gap={1}
                    className="devices-list"
                    key={room.id}
                  >
                    {room.lights.map((light) => (
                      <LightsView
                        lightName={light.name}
                        intensity={light.intensity}
                        turnedOn={light.turned_on}
                        key={light.id}
                      ></LightsView>
                    ))}
                  </Stack>
                </>
              )}
              <Button
                variant="danger"
                className="mt-2"
                onClick={() => handleShowConfirmModal(room)}
                title="Delete"
              >
                <i className="fa-solid fa-xmark"></i>
              </Button>
            </Card.Body>
          </div>
        ))}
        <div className="new-room-btn">
          <Button variant="primary" size="lg" onClick={handleShowNewRoomModal}>
            <i className="fa-solid fa-plus"></i>
          </Button>
        </div>
      </div>

      <NewRoomModal
        show={showNewRoomModal}
        addRoom={handleAddRoom}
        handleClose={handleCloseNewRoomModal}
      />

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRoom?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditRoomModal
            room={selectedRoom || initialRoomState}
            onClose={handleCloseEditModal}
            onSubmit={handleEditRoom}
          />
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        show={showConfirmModal}
        onHide={handleCancelDeleteRoom}
        onConfirm={handleConfirmDeleteRoom}
        roomName={selectedRoom ? selectedRoom.name : ""}
      />
    </>
  );
}

export default Rooms;
