import { Box, Heading, Text, Button, VStack, Input, Flex } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../library/supabase/AuthContext";
import { supabase } from "../library/supabase/supabaseClient";
import backArrow from "../assets/Login/back_arrow.svg";
import uploadIcon from "../assets/Login/create_icon.svg";
import "../ui/login.css";

function ExpertVerification() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file || !user) return;

		setUploading(true);
		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `${user.id}_verification.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from("verification-docs")
				.upload(fileName, file, { upsert: true });

			if (uploadError) throw uploadError;

			const { data: { publicUrl } } = supabase.storage
				.from("verification-docs")
				.getPublicUrl(fileName);

			await supabase
				.from("users")
				.update({ verification_doc: publicUrl, verification_status: "pending" })
				.eq("id", user.id);

			navigate("/", { state: { registered: true, expertPending: true } });
		} catch (error) {
			console.error("Error uploading document:", error);
			alert("Failed to upload document. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<Box className="login-page">
			<Box className="login-container">
				<Box as="button" className="back-arrow" onClick={() => navigate("/register")}>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>

				<VStack className="login-header">
					<Heading className="login-title">Expert Verification</Heading>
				</VStack>

				<Box className="login-card">
					<Text className="login-subtitle">Upload Your Credentials</Text>
					<form onSubmit={handleSubmit}>
						<VStack gap={4}>
							<Text color="#472c1b" textAlign="center" opacity={0.8}>
								To become an expert on Mindly, please upload a document that
								verifies your expertise (diploma, certificate, or professional ID).
							</Text>

							<Box
								className="upload-area"
								border="2px dashed #472c1b"
								borderRadius="15px"
								p={8}
								textAlign="center"
								cursor="pointer"
								_hover={{ bg: "#f5f0d5" }}
								onClick={() => document.getElementById("file-input").click()}
							>
								<Input
									id="file-input"
									type="file"
									accept=".pdf,.jpg,.jpeg,.png"
									onChange={handleFileChange}
									display="none"
								/>
								<Box as="img" src={uploadIcon} alt="Upload" w="60px" h="60px" mb={4} mx="auto" />
								{file ? (
									<Text color="#472c1b" fontWeight="600">
										{file.name}
									</Text>
								) : (
									<>
										<Text color="#472c1b" fontWeight="600" mb={2}>
											Click to upload or drag and drop
										</Text>
										<Text color="#472c1b" opacity={0.6} fontSize="sm">
											PDF, JPG, PNG (max 10MB)
										</Text>
									</>
								)}
							</Box>

							<Button
								type="submit"
								className="login-button"
								disabled={!file || uploading}
								w="100%"
							>
								{uploading ? "Uploading..." : "Submit for Verification"}
							</Button>
						</VStack>
					</form>

					<Text className="register-link" mt={4}>
						<Box as="button" onClick={() => navigate("/")}>
							Skip for now (you can verify later)
						</Box>
					</Text>
				</Box>
			</Box>
		</Box>
	);
}

export default ExpertVerification;
