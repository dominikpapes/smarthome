import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import { UserLogin } from "../interfaces/Interfaces";
import { initialUserLoginState } from "../config/InitialStates";

async function login(data: UserLogin) {
  try {
    const response = await fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const loginData = await response.json();
    return loginData;
  } catch (error) {
    console.error("Error ", error);
  }
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserLogin>(initialUserLoginState);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowAlert(false);
    let loginData = await login(formData);
    if (loginData) {
      navigate("/rooms");
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      setShowAlert(true);
    }
  }

  return (
    <>
      <Card className="login-form-container p-3 mt-5">
        <Card.Title>Prijava</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Korisničko ime</Form.Label>
            <Form.Control
              type="text"
              placeholder="Unesite korisničko ime"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Lozinka</Form.Label>
            <Form.Control
              type="password"
              placeholder="Unesite lozinku"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Nav variant="pills" activeKey="1">
            <Nav.Item>
              <Button variant="primary" type="submit">
                U redu
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/register">Stvori račun</Nav.Link>
            </Nav.Item>
          </Nav>
        </Form>
        {showAlert && (
          <Alert variant="danger" className="mt-3" dismissible>
            Krivi podaci za prijavu.
          </Alert>
        )}
      </Card>
    </>
  );
}

export default Login;
