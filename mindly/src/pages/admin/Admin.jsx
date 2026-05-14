import { useState, useEffect } from "react";
import {
	Box,
	Heading,
	Text,
	Spinner,
	Button,
	Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../library/supabase/supabaseClient";
import { toaster } from "../../library/toaster";
import backArrow from "../../assets/Login/back_arrow.svg";
import "../../ui/login.css";
import "../../ui/admin.css";
import "../../components/profile/profile.css";

function Admin() {
	const navigate = useNavigate();
	const [adminUser, setAdminUser] = useState(null);
	const [checking, setChecking] = useState(true);
	const [email, setEmail] = useState("admin@mindly.com");
	const [password, setPassword] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [authError, setAuthError] = useState("");

	useEffect(() => {
		checkAdminSession();
	}, []);

	const checkAdminSession = async () => {
		setChecking(true);
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.user) {
			const { data: profile } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", session.user.id)
				.single();
			if (profile?.role === "admin") {
				setAdminUser(session.user);
			} else {
				await supabase.auth.signOut();
			}
		}
		setChecking(false);
	};

	const handleAdminLogin = async (e) => {
		e.preventDefault();
		setAuthLoading(true);
		setAuthError("");
		try {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			const { data: profile } = await supabase
				.from("profiles")
				.select("role, name")
				.eq("id", data.user.id)
				.single();
			if (profile?.role === "admin") {
				setAdminUser(data.user);
				toaster.create({
					title: "Welcome Admin",
					description: `Logged in as ${profile.name || "Admin"}`,
					type: "success",
				});
			} else {
				await supabase.auth.signOut();
				setAuthError("This account does not have admin access.");
			}
		} catch (err) {
			setAuthError(err.message);
		} finally {
			setAuthLoading(false);
		}
	};

	const handleAdminLogout = async () => {
		await supabase.auth.signOut();
		setAdminUser(null);
		navigate("/");
	};

	if (checking) {
		return (
			<Box className="admin-page">
				<Box className="admin-spinner">
					<Spinner size="xl" color="#472c1b" />
				</Box>
			</Box>
		);
	}

	if (!adminUser) {
		return (
			<Box className="login-page">
				<Box className="login-container">
					<Box as="button" className="back-arrow" onClick={() => navigate("/")}>
						<Box as="img" src={backArrow} alt="Back" />
					</Box>

				

					<Box className="login-card">
						<Text className="login-subtitle">Admin Login</Text>
						{authError && (
							<Text color="red.500" mb={4} fontSize="sm">
								{authError}
							</Text>
						)}
						<form onSubmit={handleAdminLogin}>
							<Box width="100%" mb={4}>
								<Text className="input-label">Email</Text>
								<Input
									type="email"
									placeholder="admin@mindly.com"
									className="login-input"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Box>
							<Box width="100%" mb={4}>
								<Text className="input-label">Password</Text>
								<Input
									type="password"
									placeholder="Enter your password"
									className="login-input"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</Box>
							<Button
								type="submit"
								className="login-button"
								disabled={authLoading}
							>
								{authLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box className="admin-page">
			<Box className="admin-container">
				<Box className="admin-header">
					<Heading className="admin-heading">
						Admin Dashboard
					</Heading>
					<Button onClick={handleAdminLogout} className="btn-logout">
						Log out
					</Button>
				</Box>
			</Box>
		</Box>
	);
}

export default Admin;
