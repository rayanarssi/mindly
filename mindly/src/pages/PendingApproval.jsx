import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../library/supabase/AuthContext";
import { supabase } from "../library/supabase/supabaseClient";
import verifIcon from "../assets/Login/verif_icon.png";
import "../ui/login.css";

function PendingApproval() {
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	const [status, setStatus] = useState(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		if (authLoading) return;

		if (!user) {
			navigate("/");
			return;
		}

		const checkStatus = async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("status, role")
				.eq("id", user.id)
				.single();

			if (error || !data) {
				navigate("/");
				return;
			}

			setStatus(data.status);

			if (data.role !== "expert") {
				navigate("/");
				return;
			}

			if (data.status === 3) {
				navigate("/");
				return;
			}

			setChecking(false);
		};

		checkStatus();
	}, [user, authLoading, navigate]);

	if (authLoading || checking) {
		return (
			<Box className="login-page">
				<Flex justify="center" align="center" minH="100vh">
					<Spinner size="xl" color="#472c1b" />
				</Flex>
			</Box>
		);
	}

	return (
		<Box className="login-page">
			<Box className="login-container">
				
				<Box className="login-card" textAlign="center" py={10}>
					{status === 4 ? (
						<>
							<Heading className="login-title" color="#c27a6b" mb={4}>
								Verification Declined
							</Heading>
							<Text color="#472c1b" opacity={0.8} mb={6}>
								Your account verification has been declined. Please contact
								support for more information.
							</Text>
							<Button className="login-button" onClick={() => navigate("/")}>
								Go to Home
							</Button>
						</>
					) : (
						<>
							<Box
								as="img"
								src={verifIcon}
								alt="Verification"
								w="100px"
								h="100px"
								mx="auto"
								mb={6}
							/>
							<Heading className="login-title" mb={4}>
								Verification in Progress
							</Heading>
							<Text color="#472c1b" opacity={0.8} mb={6} maxW="400px" mx="auto">
								Your account has to be verified by our admin before you can
								access all features. You will be notified once your account has
								been approved.
							</Text>
							<Button className="login-button" onClick={() => navigate("/")}>
								Go to Home
							</Button>
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
}

export default PendingApproval;
