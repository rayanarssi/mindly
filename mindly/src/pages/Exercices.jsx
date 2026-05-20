import {
	Box,
	Heading,
	Text,
	Button,
	VStack,
	HStack,
	Flex,
	Toaster,
	createToaster,
	ToastRoot,
	ToastTitle,
	ToastDescription,
	ToastCloseTrigger,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const toaster = createToaster({});

import "../ui/exercices.css";

function Exercices() {
	const navigate = useNavigate();

	return (
		<Box>
			<Navbar />
			<Box className="exercices-page">
				<Toaster toaster={toaster}>
					{(toast) => (
						<ToastRoot>
							<ToastTitle>{toast.title}</ToastTitle>
							<ToastDescription>{toast.description}</ToastDescription>
							<ToastCloseTrigger />
						</ToastRoot>
					)}
				</Toaster>
				<Box className="exercices-container">
					<VStack gap={8} className="exercices-content" align="flex-start">
						<Heading className="exercices-title"> Exercices</Heading>

						{/* Exercice Cards Grid */}
						<Flex
							className="exercices-grid"
							direction={{ base: "column", md: "row" }}
							gap={6}
							justify="center"
							align="stretch"
						>
							{/* Focus Exercice Card */}
							<Box
								className="exercice-card focus-card"
								position="relative"
								p={6}
							>
								<Box position="absolute" top={4} right={4}>
									<Box className="exercice-theme-badge focus-badge">Focus</Box>
								</Box>
								<VStack gap={3} align="flex-start" mt={8}>
									<Text className="exercice-card-subtitle">Pattern Recall</Text>
									<Text className="exercice-card-desc" mb={2}>
										Train your memory by recalling sequences colors, and
										patterns in the correct order.
									</Text>
									<VStack
										gap={1}
										align="flex-start"
										mb={2}
										className="exercice-card-features"
									>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Improve short-term memory
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Sharpen your attention
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Progressive difficulty each round
											</Text>
										</HStack>
									</VStack>
									<Button
										className="exercice-card-btn focus-btn"
										size="sm"
										onClick={() => navigate("/exercices/focus")}
									>
										Play
									</Button>
								</VStack>
							</Box>

							{/* Stress Exercice Card */}
							<Box
								className="exercice-card stress-card"
								position="relative"
								p={6}
							>
								<Box position="absolute" top={4} right={4}>
									<Box className="exercice-theme-badge stress-badge">
										Stress
									</Box>
								</Box>
								<VStack gap={3} align="flex-start" mt={8}>
									<Text className="exercice-card-subtitle">
										Breathing Balance
									</Text>
									<Text className="exercice-card-desc" mb={2}>
										Regain control through rhythm. Learn to stay calm by
										controlling your breathing.
									</Text>
									<VStack
										gap={1}
										align="flex-start"
										mb={2}
										className="exercice-card-features"
									>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Stress regulation through breathing
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Focus and rhythm control
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Staying calm under pressure
											</Text>
										</HStack>
									</VStack>
									<Button
										className="exercice-card-btn stress-btn"
										size="sm"
										onClick={() => navigate("/exercices/stress")}
									>
										Play
									</Button>
								</VStack>
							</Box>

							{/* Motivation Exercice Card */}
							<Box
								className="exercice-card motivation-card"
								position="relative"
								p={6}
							>
								<Box position="absolute" top={4} right={4}>
									<Box className="exercice-theme-badge motivation-badge">
										Motivation
									</Box>
								</Box>
								<VStack gap={3} align="flex-start" mt={8}>
									<Text className="exercice-card-subtitle">Resist</Text>
									<Text className="exercice-card-desc" mb={2}>
										Stay focused on your task while resisting distractions that
										try to pull you away.
									</Text>
									<VStack
										gap={1}
										align="flex-start"
										mb={2}
										className="exercice-card-features"
									>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Fight distractions
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Build self-control
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#472c1b">
												•
											</Text>
											<Text fontSize="sm" color="#472c1b">
												Stay consistent over time
											</Text>
										</HStack>
									</VStack>
									<Button
										className="exercice-card-btn motivation-btn"
										size="sm"
									>
										Play
									</Button>
								</VStack>
							</Box>
						</Flex>
					</VStack>
				</Box>
			</Box>
		</Box>
	);
}

export default Exercices;
