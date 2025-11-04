import './App.css'
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ClubDirectory from './pages/ClubDirectory';
import Club from "./pages/Club";
import Event from "./pages/Event";
import ClubCreate from "./pages/ClubCreate"
import EventCreate from "./pages/EventCreate"
import { EventModalProvider } from "./context/EventModalContext";


function App() {
  return (
    <EventModalProvider>
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<ClubDirectory />} />
        <Route path="/club/:clubId" element={<Club />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/club/create" element={<ClubCreate />} />
        <Route path="/event/create" element={<EventCreate />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </EventModalProvider>
    
  );
}

export default App
