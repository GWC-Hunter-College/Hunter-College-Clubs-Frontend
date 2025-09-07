import './App.css'
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Club from "./pages/Club";
import Event from "./pages/Event";
function App() {


  return (
    <Routes> 
      <Route path="/home" element={<Home />} />
      <Route path="/club" element={<Club />} />
      <Route path="/event" element={<Event />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
    
  );
}

export default App
