import { AirConditioner, Light, Room } from "../interfaces/Interfaces";

export async function getRooms(token: string) {
  try {
    const response = await fetch("/api/get-rooms/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function postRoom(data: Room, token: string) {
  try {
    const response = await fetch("/api/create-room/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ name: data.name }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newData = await response.json();
    return newData;
  } catch (error) {
    console.error("Error ", error);
  }
}

export async function deleteRoom(id: number, token: string) {
  try {
    const response = await fetch(`/api/delete-room/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error ", error);
  }
}

export async function updateAcs(data: AirConditioner[], token: string) {
  for (const ac of data) {
    try {
      const response = await fetch(`/api/update-ac/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(ac),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error ", error);
    }
  }
}

export async function deleteAcs(acs_to_delete: number[], token: string) {
  for (const id of acs_to_delete) {
    try {
      const response = await fetch(`/api/delete-ac/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error ", error);
    }
  }
}

export async function updateLights(data: Light[], token: string) {
  console.log(data);
  for (const light of data) {
    try {
      const response = await fetch(`/api/update-light/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(light),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error ", error);
    }
  }
}

export async function deleteLights(lights_to_delete: number[], token: string) {
  for (const id of lights_to_delete) {
    try {
      const response = await fetch(`/api/delete-light/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error ", error);
    }
  }
}
