import { Box, Text, Button, VStack, HStack, Flex, Circle } from "@chakra-ui/react";
import backArrow from "../../assets/Login/back_arrow.svg";
import useBreathingBalance from "../../hooks/useBreathingBalance";
import "../../ui/games.css";

function BreathingBalance({ gameState, onBack }) {
	const {
		level,
		config,
		round,
		status,
		phase,
		message,
		retry,
		resetGame,
		goToNextLevel,
		hasNextLevel,
		progress,
	} = gameState;

	return (
		<Box className="breathing-balance-game">
			<VStack gap={6} align="center">
				<Flex
					width="100%"
					justify="space-between"
					align="center"
					wrap="wrap"
					gap={4}
				>
					<HStack gap={4}>
						<Box as="button" className="back-arrow" onClick={onBack}>
							<Box as="img" src={backArrow} alt="Back" />
						</Box>
					</HStack>
					{status !== "complete" && (
						<HStack gap={6}>
							<Text fontSize="lg" fontWeight="bold" color="#472c1b">
								Level:{" "}
								<span color="#472c1b">
									{config?.label}
								</span>
							</Text>
							<Text fontSize="lg" fontWeight="bold" color="#472c1b">
								Round: {round}
							</Text>
						</HStack>
					)}
				</Flex>

				<Box
					className={`game-message ${status}`}
					p={4}
					borderRadius="10px"
					minW="300px"
					textAlign="center"
				>
					<Text fontSize="1.3rem" fontWeight="bold" color="#472c1b">
						{message}
					</Text>
				</Box>

				{status !== "complete" && (
					<VStack gap={4}>
						<Circle
							size="150px"
							bg={phase === "inhale" ? "blue.200" : phase === "exhale" ? "green.200" : "gray.200"}
							animation={phase === "inhale" ? "breatheIn 4s ease-in-out" : phase === "exhale" ? "breatheOut 4s ease-in-out" : "none"}
							className="breathing-circle"
						>
							<Text fontSize="lg" fontWeight="bold" color="#472c1b" textTransform="capitalize">
								{phase}
							</Text>
						</Circle>
						<Text fontSize="sm" color="#472c1b">
							Progress: {progress}%
						</Text>
					</VStack>
				)}

				{status === "wrong" && (
					<Button
						className="game-card-btn stress-btn"
						size="lg"
						onClick={retry}
					>
						Try Again
					</Button>
				)}

				{status === "complete" && (
					<VStack gap={4}>
						{hasNextLevel() && (
							<Button
								className="game-card-btn stress-btn"
								size="lg"
								onClick={goToNextLevel}
							>
								Next Level
							</Button>
						)}
						<Button
							className="game-card-btn stress-btn"
							size="lg"
							onClick={resetGame}
						>
							Back to Levels
						</Button>
					</VStack>
				)}
			</VStack>
		</Box>
	);
}

export default BreathingBalance;
