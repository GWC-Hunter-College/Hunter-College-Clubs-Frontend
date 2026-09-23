import './App.css'
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Club from "./pages/Club";
import EventPage from "./pages/Event";
import MyClubs from "./pages/MyClubs";
import Create from "./pages/Create";
import EventCreateStep1 from "./pages/EventCreateStep1";
import EventForm from "./pages/EventForm";
import ClubForm from "./pages/ClubForm";
import { ShellProvider } from "./components/shell/ShellContext";

function App() {
  return (
    <ShellProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/club/create" element={<ClubForm />} />
        <Route path="/club/:clubId/event/new" element={<EventForm />} />
        <Route path="/club/:clubId" element={<Club />} />
        <Route path="/event/create" element={<EventCreateStep1 />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/my-clubs" element={<MyClubs />} />
        <Route path="/create" element={<Create />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </ShellProvider>
  );
}

export default App
