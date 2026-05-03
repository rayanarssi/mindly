import {
	Box,
	Heading,
	Text,
	Button,
	VStack,
	HStack,
	Flex,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PatternRecall from "../components/games/PatternRecall";
import usePatternRecall from "../hooks/usePatternRecall";
import { getLevelConfig } from "../services/gameLevels";

import "../ui/games.css";

function FocusGame() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const levelId = searchParams.get("level");
	const gameState = usePatternRecall();

	const showGame = gameState.level !== null;

	if (!showGame && levelId) {
		const levelConfig = getLevelConfig("focus", levelId);
		if (levelConfig) {
			gameState.selectLevel(levelId);
		}
	}

	return (
		<Box className="games-page">
			<Box className="games-container">
				{showGame ? (
					<PatternRecall
						gameState={gameState}
						onBack={() => {
							gameState.resetGame();
							navigate("/games/focus");
						}}
					/>
				) : (
					<Box pt={60}>
						<Box className="level-selection">
							<Box
								as="button"
								className="back-arrow"
								onClick={() => navigate("/games")}
							>
								<Box as="img" src="/src/assets/Login/back_arrow.svg" alt="Back" />
							</Box>
							<VStack gap={8} align="center">
								<Heading className="games-title" textAlign="center">
									Pattern Recall
								</Heading>
								<Text fontSize="lg" color="#472c1b" textAlign="center" maxW="600px">
									Remember the sequence of colored buttons and repeat it back. Each round gets longer!
								</Text>
							</VStack>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default FocusGame;
