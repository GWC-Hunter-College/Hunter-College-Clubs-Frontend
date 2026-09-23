import './App.css'
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Placeholder from "./pages/Placeholder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/clubs" element={<Placeholder title="Clubs" phase="Phase 2" />} />
      <Route path="/club/create" element={<Placeholder title="New club" phase="Phase 5" />} />
      <Route path="/club/:clubId/event/new" element={<Placeholder title="New event" phase="Phase 5" />} />
      <Route path="/club/:clubId" element={<Placeholder title="Club" phase="Phase 2" />} />
      <Route path="/event/create" element={<Placeholder title="New event" phase="Phase 5" />} />
      <Route path="/event/:eventId" element={<Placeholder title="Event" phase="Phase 3" />} />
      <Route path="/my-clubs" element={<Placeholder title="My Clubs" phase="Phase 4" />} />
      <Route path="/create" element={<Placeholder title="Create" phase="Phase 5" />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App
