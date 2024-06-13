export interface AirConditioner {
  id: number;
  name: string;
  temperature: number;
  fan_speed: number;
  turned_on: boolean;
  room: number;
}

export interface Light {
  id: number;
  name: string;
  intensity: number;
  turned_on: boolean;
  room: number;
}

export interface Room {
  id: number;
  name: string;
  temperature: number;
  airconditioners: AirConditioner[];
  lights: Light[];
  owner: string;
}

export interface UserLogin {
  username: string,
  password: string
}

export interface UserRegister {
  username: string,
  password: string,
  password_confirmation: string
}