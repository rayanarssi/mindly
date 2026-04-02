import {
	Box,
	Text,
	Input,
	Button,
	VStack,
	Flex,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../library/supabase/AuthContext";
import backArrow from "../assets/Login/back_arrow.svg";
import userIconBrown from "../assets/Login/user_icon_brown.svg";
import userIconBeige from "../assets/Login/user_icon_beige.svg";
import expertIconBrown from "../assets/Login/expert_icon_brown.svg";
import expertIconBeige from "../assets/Login/expert_icon_beige.svg";
import "../ui/register.css";

function Register() {
	const navigate = useNavigate();
	const location = useLocation();
	const { signUp } = useAuth();
	const preselectedRole = location.state?.role || null;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [selectedRole, setSelectedRole] = useState(preselectedRole);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleRoleSelect = (role) => {
		setSelectedRole(role);
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");

		if (!selectedRole) {
			setError("Please select a role");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setLoading(true);

		try {
			const result = await signUp(formData.email, formData.password, formData.name, selectedRole);

			if (selectedRole === "expert") {
				navigate("/expert-verification");
			} else {
				navigate("/", { state: { registered: true } });
			}
		} catch (err) {
			setError(err.message || "Failed to create account. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box className="register-page">
			<Box className="register-container">
				<Box
					as="button"
					className="back-arrow"
					onClick={() => navigate("/login")}
				>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>

				<Box className="register-card">
					<Flex className="register-content" gap={8} align="stretch">
						<Box className="register-form-section">
							<Text className="register-subtitle">Create Account</Text>
							{error && (
								<Text color="red.500" mb={4} fontSize="sm">
									{error}
								</Text>
							)}
							<form onSubmit={handleRegister}>
								<VStack gap={4}>
									<Box width="100%">
										<Text className="input-label">Name</Text>
										<Input
											type="text"
											name="name"
											placeholder="Enter your name"
											className="register-input"
											value={formData.name}
											onChange={handleInputChange}
											required
										/>
									</Box>

									<Box width="100%">
										<Text className="input-label">Email</Text>
										<Input
											type="email"
											name="email"
											placeholder="Enter your email"
											className="register-input"
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
											className="register-input"
											value={formData.password}
											onChange={handleInputChange}
											required
										/>
									</Box>

									<Button
										type="submit"
										className="register-button"
										disabled={!selectedRole || loading}
									>
										{loading ? "Creating Account..." : "Create Account"}
									</Button>
								</VStack>
							</form>

							<Text className="login-link">
								Already have an account?{" "}
								<Box as="button" onClick={() => navigate("/login")}>
									Log in
								</Box>
							</Text>
						</Box>

						<Box className="register-role-section">
							<Text className="input-label">Choose Your Role</Text>
							<VStack gap={4} mt={4}>
								<Box
									as="button"
									type="button"
									className={`role-button ${selectedRole === "user" ? "role-selected" : ""}`}
									onClick={() => handleRoleSelect("user")}
								>
									<Flex className="role-header">
										<Box
											as="img"
											src={
												selectedRole === "user" ? userIconBeige : userIconBrown
											}
											alt="User"
											className="role-icon-large"
										/>
										<Text className="role-label-large">User</Text>
									</Flex>
									<Text className="role-description">
										Watching videos and asking questions helps you understand
										the topic and stay engaged.{" "}
									</Text>
								</Box>

								<Box
									as="button"
									type="button"
									className={`role-button ${selectedRole === "expert" ? "role-selected" : ""}`}
									onClick={() => handleRoleSelect("expert")}
								>
									<Flex className="role-header">
										<Box
											as="img"
											src={
												selectedRole === "expert"
													? expertIconBeige
													: expertIconBrown
											}
											alt="Expert"
											className="role-icon-large"
										/>
										<Text className="role-label-large">Expert</Text>
									</Flex>
									<Text className="role-description">
										Share your knowledge with others by posting videos and
										answer their questions.{" "}
									</Text>
								</Box>
							</VStack>
						</Box>
					</Flex>
				</Box>
			</Box>
		</Box>
	);
}

export default Register;
