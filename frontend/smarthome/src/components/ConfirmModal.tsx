import { Modal, Button } from "react-bootstrap";

interface props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  roomName: string;
}

function ConfirmationModal(props: props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="sm" className="my-5">
      <Modal.Header>
        <Modal.Title className="m-1 mx-auto">
          Obriši {props.roomName}?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="mx-auto">
        <Button variant="primary" onClick={props.onConfirm} className="mx-2">
          Da
        </Button>
        <Button variant="secondary" onClick={props.onHide} className="mx-2">
          Ne
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmationModal;
