import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./library/supabase/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpertVerification from "./pages/ExpertVerification";
import Profile from "./pages/Profile";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/expert-verification" element={<ExpertVerification />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
