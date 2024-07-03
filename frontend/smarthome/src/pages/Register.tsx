import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert, CardHeader } from "react-bootstrap";
import { UserRegister } from "../interfaces/Interfaces";
import { initialUserRegisterState } from "../config/InitialStates";

async function register(data: UserRegister) {
  try {
    const response = await fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.username) {
        console.error("Error: Username already exists.");
        alert("Korisničko ime postoji.");
        return;
      }
      throw new Error("Registration failed. Please try again.");
    }

    const result = await response.json();
    console.log("Success", result);
  } catch (error) {
    console.error("Error", error);
    alert("An error occurred. Please try again.");
  }
}

function validate_password(formData: UserRegister) {
  const lengthCriteria = /.{8,}/;
  const uppercaseCriteria = /[A-Z]/;
  const lowercaseCriteria = /[a-z]/;
  const numberCriteria = /[0-9]/;

  return (
    lengthCriteria.test(formData.password) &&
    uppercaseCriteria.test(formData.password) &&
    lowercaseCriteria.test(formData.password) &&
    numberCriteria.test(formData.password)
  );
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialUserRegisterState);
  const [showPasswordAlert, setShowPasswordAlert] = useState("");
  const [showPasswordConfAlert, setShowPasswordConfAlert] = useState("");
  const [showUsernameAlert, setShowUsernameAlert] = useState("")

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowPasswordAlert("");
    setShowPasswordConfAlert("");
    var err = false;
    const alphanumericPattern = /^[a-zA-Z0-9]{20}$/;
    if (alphanumericPattern.test(formData.username) && formData.username.length <= 20) {
      setShowUsernameAlert("Korisničko ime mora biti alfanumerički znakovi duljine 20.")
      err = true;
    }
    if (formData.password != formData.password_confirmation) {
      setShowPasswordConfAlert("Lozinke nisu jednake.");
      err = true;
    }
    if (!validate_password(formData)) {
      setShowPasswordAlert(
        "Lozinka mora biti duga barem 8 znakova, sadržavati barem jedno veliko slovo, barem jedno malo slovo i barem jednu znamenku."
      );
    }

    if (!err) {
      register(formData).then(() => {
        navigate("/");
      });
    } 
  }

  return (
    <>
      <Card className="login-form-container p-3 mt-5">
        <Card.Title>Stvori račun</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
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
          <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
            <Form.Label>Ponovljena lozinka</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ponovite lozinku"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Stvori račun
            </Button>
            <Button variant="danger" href="/">
              Odustani
            </Button>
          </div>
          {showUsernameAlert && (
            <Alert variant="danger" className="mt-3" dismissible>
              {showUsernameAlert}
            </Alert>
          )}
          {showPasswordAlert && (
            <Alert variant="danger" className="mt-3" dismissible>
              {showPasswordAlert}
            </Alert>
          )}
          {showPasswordConfAlert && (
            <Alert variant="danger" className="mt-3" dismissible>
              {showPasswordConfAlert}
            </Alert>
          )}
        </Form>
      </Card>
    </>
  );
}

export default Register;
