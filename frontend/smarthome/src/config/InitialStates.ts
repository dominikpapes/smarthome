import { AirConditioner, Light, Room, UserLogin, UserRegister } from "../interfaces/Interfaces";


export const initialRoomState: Room = {
  id: 0,
  name: "",
  temperature:0,
  airconditioners: [],
  lights: [],
  owner: ""
};
  
export const initialAcState: AirConditioner = {
  id: 0,
  name: "",
  temperature: 20,
  fan_speed: 3,
  turned_on: true,
  room: 0
};
  
export const initialLightState: Light = {
  id: 0,
  name: "",
  intensity: 3,
  turned_on: true,
  room: 0
};

export const initialUserLoginState: UserLogin = {
  username: "",
  password: ""
}

export const initialUserRegisterState: UserRegister = {
  username: "",
  password: "",
  password_confirmation: ""
}