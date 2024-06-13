import { useEffect, useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function Titlebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [location]);

  const username = localStorage.getItem("username") || " ";

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
    console.log("logout");
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        sticky="top"
      >
        <Navbar.Brand className="pl-4">SmartHome</Navbar.Brand>
        {isLoggedIn && (
          <>
            <Nav className="ml-auto pr-3">
              <Nav.Item className="d-flex align-items-center">
                <span className="mx-2 text-light">{username}</span>
                <Button variant="dark" onClick={handleLogout} className="mx-1">
                  <i className="fa-solid fa-right-from-bracket text-light"></i>
                </Button>
              </Nav.Item>
            </Nav>
          </>
        )}
      </Navbar>
    </>
  );
}

export default Titlebar;
