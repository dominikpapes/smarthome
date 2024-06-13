import { Badge, Stack } from "react-bootstrap";

interface props {
  acName: string;
  temperature: number;
  fanSpeed: number;
  turnedOn: boolean;
}

function AirConditionerView(props: props) {
  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <Badge
          bg={props.turnedOn ? "dark" : "secondary"}
          className="breakable-badge"
        >
          <i className="fa-solid fa-fan"></i>
          {"   "}
          {props.acName}
        </Badge>
        <Badge bg={props.turnedOn ? "primary" : "secondary"}>
          <i className="fa-solid fa-temperature-quarter"></i>
          {"   "}
          {props.temperature}°C
        </Badge>
        <Badge bg={props.turnedOn ? "success" : "secondary"}>
          <i className="fa-solid fa-wind"></i>
          {"   "}
          {props.fanSpeed}
        </Badge>
      </Stack>
    </>
  );
}

export default AirConditionerView;
