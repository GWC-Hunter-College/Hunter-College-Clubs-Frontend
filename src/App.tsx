import './App.css'
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ClubDirectory from './pages/ClubDirectory';
import Club from "./pages/Club";
import Event from "./pages/Event";
function App() {


  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<ClubDirectory />} />
      <Route path="/club/:clubId" element={<Club />} />
      <Route path="/event/:eventId" element={<Event />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
    
  );
}

export default App
