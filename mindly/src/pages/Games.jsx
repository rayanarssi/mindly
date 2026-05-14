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

import "../ui/games.css";

function Games() {
	const navigate = useNavigate();

	return (
		<Box>
			<Navbar />
			<Box className="games-page">
				<Toaster toaster={toaster}>
					{(toast) => (
						<ToastRoot>
							<ToastTitle>{toast.title}</ToastTitle>
							<ToastDescription>{toast.description}</ToastDescription>
							<ToastCloseTrigger />
						</ToastRoot>
					)}
				</Toaster>
				<Box className="games-container">
					<VStack gap={8} className="games-content" align="flex-start">
						<Heading className="games-title"> Mini Games</Heading>

						{/* Game Cards Grid */}
						<Flex
							className="games-grid"
							direction={{ base: "column", md: "row" }}
							gap={6}
							justify="center"
							align="stretch"
						>
							{/* Focus Game Card */}
							<Box className="game-card focus-card" position="relative" p={6}>
								<Box position="absolute" top={4} right={4}>
									<Box className="game-theme-badge focus-badge">Focus</Box>
								</Box>
								<VStack gap={3} align="flex-start" mt={8}>
									<Text className="game-card-subtitle">Pattern Recall</Text>
									<Text className="game-card-desc" mb={2}>
										Train your memory by recalling sequences colors,
										and patterns in the correct order.
									</Text>
									<VStack
										gap={1}
										align="flex-start"
										mb={2}
										className="game-card-features"
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
										className="game-card-btn focus-btn"
										size="sm"
										onClick={() => navigate("/games/focus")}
									>
										Play
									</Button>
								</VStack>
							</Box>

							{/* Stress Game Card */}
							<Box className="game-card stress-card" position="relative" p={6}>
								<Box position="absolute" top={4} right={4}>
									<Box className="game-theme-badge stress-badge">Stress</Box>
								</Box>
								<VStack gap={3} align="flex-start" mt={8}>
									<Text className="game-card-subtitle">Breathing Balance</Text>
									<Text className="game-card-desc" mb={2}>
										Regain control through rhythm. Learn to stay calm by controlling your breathing.
									</Text>
									<VStack
										gap={1}
										align="flex-start"
										mb={2}
										className="game-card-features"
									>
										<HStack gap={2}>
											<Text fontSize="sm" color="#666">
												•
											</Text>
											<Text fontSize="sm" color="#666">
												Stress regulation through breathing
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#666">
												•
											</Text>
											<Text fontSize="sm" color="#666">
												Focus and rhythm control
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#666">
												•
											</Text>
											<Text fontSize="sm" color="#666">
												Staying calm under pressure
											</Text>
										</HStack>
									</VStack>
									<Button
										className="game-card-btn stress-btn"
										size="sm"
										onClick={() => navigate("/games/stress")}
									>
										Play
									</Button>
								</VStack>
							</Box>

							{/* Motivation Game Card */}
							<Box
								className="game-card motivation-card"
								position="relative"
								p={6}
							>
								<Box position="absolute" top={4} right={4}>
									<Box className="game-theme-badge motivation-badge">
										Motivation
									</Box>
								</Box>
								<VStack gap={3} align="flex-start" mt={8}>
									<Text className="game-card-subtitle">Resist</Text>
									<Text className="game-card-desc" mb={2}>
										Stay focused on your task while resisting distractions that
										try to pull you away.
									</Text>
									<VStack
										gap={1}
										align="flex-start"
										mb={2}
										className="game-card-features"
									>
										<HStack gap={2}>
											<Text fontSize="sm" color="#666">
												•
											</Text>
											<Text fontSize="sm" color="#666">
												Fight distractions
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#666">
												•
											</Text>
											<Text fontSize="sm" color="#666">
												Build self-control
											</Text>
										</HStack>
										<HStack gap={2}>
											<Text fontSize="sm" color="#666">
												•
											</Text>
											<Text fontSize="sm" color="#666">
												Stay consistent over time
											</Text>
										</HStack>
									</VStack>
									<Button className="game-card-btn motivation-btn" size="sm">
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

export default Games;
