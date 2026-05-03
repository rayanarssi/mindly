import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./library/supabase/AuthContext";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpertVerification from "./pages/ExpertVerification";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import GameLevels from "./pages/GameLevels";
import FocusGame from "./pages/FocusGame";
import BreathingGame from "./pages/BreathingGame";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/videos" element={<Videos />} />
				<Route path="/video/:id" element={<VideoDetail />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/expert-verification" element={<ExpertVerification />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/games" element={<Games />} />
				<Route path="/games/:gameId" element={<GameLevels />} />
				<Route path="/games/stress/play" element={<BreathingGame />} />
				<Route path="/games/:gameId/play" element={<FocusGame />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
