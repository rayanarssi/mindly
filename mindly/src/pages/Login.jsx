import { Box, Heading, Text, Input, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import backArrow from "../assets/Login/back_arrow.svg";
import "../ui/login.css";

function Login() {
	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();
		navigate("/");
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
					<form onSubmit={handleLogin}>
						<VStack gap={4}>
							<Box width="100%">
								<Text className="input-label">Email</Text>
								<Input
									type="email"
									placeholder="Enter your email"
									className="login-input"
								/>
							</Box>

							<Box width="100%">
								<Text className="input-label">Password</Text>
								<Input
									type="password"
									placeholder="Enter your password"
									className="login-input"
								/>
							</Box>

							<Button type="submit" className="login-button">
								Log In
							</Button>
						</VStack>
					</form>

					<Text className="register-link">
						Don't have an account yet?{" "}
						<Box
							as="button"
							onClick={() => navigate("/register")}
							
						>
							Register here
						</Box>
					</Text>
				</Box>
			</Box>
		</Box>
	);
}

export default Login;
