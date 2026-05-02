import { Box, Text, Button, VStack, HStack, Flex } from "@chakra-ui/react";
import backArrow from "../../assets/Login/back_arrow.svg";
import usePatternRecall from "../../hooks/usePatternRecall";
import "../../ui/games.css";

function PatternRecall({ gameState, onBack }) {
	const {
		level,
		config,
		round,
		status,
		highlightedButton,
		message,
		buttons,
		playerInput,
		sequence,
		handleButtonClick,
		retry,
		resetGame,
		goToNextLevel,
		hasNextLevel,
		LEVELS,
	} = gameState;

	// Expert mode: subtle distraction animation
	const isExpert = level === "expert";

	return (
		<Box className="pattern-recall-game">
			<VStack gap={6} align="center">
				{/* Header info */}
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
								<span style={{ color: config?.color || "#472c1b" }}>
									{config?.label}
								</span>
							</Text>
							<Text fontSize="lg" fontWeight="bold" color="#472c1b">
								Round: {round}
							</Text>
						</HStack>
					)}
				</Flex>

				{/* Message area */}
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

				{/* Game buttons grid */}
				{status !== "complete" && (
					<Flex
						className={`buttons-grid ${isExpert ? "expert-mode" : ""}`}
						gap={4}
						wrap="wrap"
						justify="center"
						maxW="800px"
					>
						{buttons.map((btn) => {
							const isHighlighted = highlightedButton === btn.id;
							const isDisabled = status !== "input";

							return (
								<Box
									key={btn.id}
									className={`game-button ${isHighlighted ? "highlighted" : ""} ${isDisabled ? "disabled" : ""}`}
									bg={btn.color}
									onClick={() => handleButtonClick(btn.id)}
									cursor={isDisabled ? "not-allowed" : "pointer"}
									opacity={isDisabled && !isHighlighted ? 0.6 : 1}
									borderRadius="15px"
									w="110px"
									h="110px"
									transition="all 0.2s ease"
									boxShadow={
										isHighlighted
											? "0 0 25px rgba(0,0,0,0.4)"
											: "0 4px 15px rgba(0,0,0,0.15)"
									}
									transform={isHighlighted ? "scale(1.15)" : "scale(1)"}
									_hover={!isDisabled ? { transform: "scale(1.05)" } : {}}
									position="relative"
									overflow="hidden"
								>
									{/* Expert mode: subtle random flash overlay */}
									{isExpert && status === "showing" && (
										<Box
											position="absolute"
											inset="0"
											bg="white"
											opacity={Math.random() > 0.7 ? 0.2 : 0}
											borderRadius="15px"
											pointerEvents="none"
										/>
									)}
								</Box>
							);
						})}
					</Flex>
				)}

				{/* Wrong answer: retry button */}
				{status === "wrong" && (
					<Button
						className="game-card-btn stress-btn"
						size="lg"
						onClick={retry}
					>
						Try Again
					</Button>
				)}

				{/* Level complete */}
				{status === "complete" && (
					<VStack gap={4}>
						{hasNextLevel() && (
							<Button
								className="game-card-btn focus-btn"
								size="lg"
								onClick={goToNextLevel}
							>
								Next Level
							</Button>
						)}
						<Button
							className="game-card-btn focus-btn"
							size="lg"
							onClick={resetGame}
						>
							Back to Levels
						</Button>
					</VStack>
				)}

				{/* Progress indicator */}
				{status === "input" && status !== "complete" && (
					<Text fontSize="sm" color="#666">
						Entered: {playerInput.length} / {sequence.length}
					</Text>
				)}
			</VStack>
		</Box>
	);
}

export default PatternRecall;
