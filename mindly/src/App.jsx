import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./library/supabase/AuthContext";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpertVerification from "./pages/ExpertVerification";
import Profile from "./pages/Profile";
import Exercices from "./pages/Exercices";
import ExerciceLevels from "./pages/ExerciceLevels";
import FocusExercice from "./pages/FocusExercice";
import BreathingExercice from "./pages/BreathingExercice";
import Forum from "./pages/Forum";
import Admin from "./pages/admin/Admin";

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
				<Route path="/exercices" element={<Exercices />} />
				<Route path="/exercices/:exerciceId" element={<ExerciceLevels />} />
				<Route path="/exercices/stress/play" element={<BreathingExercice />} />
				<Route path="/exercices/:exercId/play" element={<FocusExercice />} />
				<Route path="/forum" element={<Forum />} />
				<Route path="/admin" element={<Admin />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
