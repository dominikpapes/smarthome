import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Titlebar from "./components/Titlebar";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Router>
        <Titlebar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
