import { Box, Heading, Text, Input, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../library/supabase/AuthContext";
import backArrow from "../assets/Login/back_arrow.svg";
import "../ui/login.css";

function Login() {
	const navigate = useNavigate();
	const { signIn } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signIn(formData.email, formData.password);
			navigate("/");
		} catch (err) {
			console.error("Login error:", err);
			setError(err.message || "Invalid email or password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box className="login-page">
			<Box className="login-container">
				<Box as="button" className="back-arrow" onClick={() => navigate("/")}>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>

				<VStack className="login-header">
					<Heading className="login-title">Welcome Back</Heading>
				</VStack>

				<Box className="login-card">
					<Text className="login-subtitle">Log In</Text>
					{error && (
						<Text color="red.500" mb={4} fontSize="sm">
							{error}
						</Text>
					)}
					<form onSubmit={handleLogin}>
						<VStack gap={4}>
							<Box width="100%">
								<Text className="input-label">Email</Text>
								<Input
									type="email"
									name="email"
									placeholder="Enter your email"
									className="login-input"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</Box>

							<Box width="100%">
								<Text className="input-label">Password</Text>
								<Input
									type="password"
									name="password"
									placeholder="Enter your password"
									className="login-input"
									value={formData.password}
									onChange={handleInputChange}
									required
								/>
							</Box>

							<Button type="submit" className="login-button" disabled={loading}>
								{loading ? "Logging in..." : "Log In"}
							</Button>
						</VStack>
					</form>

					<Text className="register-link">
						Don't have an account yet?{" "}
						<Box as="button" onClick={() => navigate("/register")}>
							Register here
						</Box>
					</Text>
				</Box>
			</Box>
		</Box>
	);
}

export default Login;
