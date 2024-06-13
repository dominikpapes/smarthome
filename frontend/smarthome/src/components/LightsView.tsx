import { Badge, Stack } from "react-bootstrap";

interface props {
  lightName: string;
  intensity: number;
  turnedOn: boolean;
}

function LightsView(props: props) {
  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <Badge bg={props.turnedOn ? "dark" : "secondary"}>
          <i className="fa-solid fa-lightbulb"></i>
          {"   "}
          {props.lightName}
        </Badge>
        <Badge bg={props.turnedOn ? "primary" : "secondary"}>
          <i className="fa-solid fa-bolt"></i>
          {"   "}
          {props.intensity}%
        </Badge>
      </Stack>
    </>
  );
}

export default LightsView;
