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
import BreathingBalance from "../components/games/BreathingBalance";
import useBreathingBalance from "../hooks/useBreathingBalance";
import { getLevelConfig } from "../services/gameLevels";

import "../ui/games.css";

function BreathingGame() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const levelId = searchParams.get("level");
	const gameState = useBreathingBalance();

	const showGame = gameState.level !== null;

	if (!showGame && levelId) {
		const levelConfig = getLevelConfig("stress", levelId);
		if (levelConfig) {
			gameState.selectLevel(levelId);
		}
	}

	return (
		<Box className="games-page">
			<Box
				className="games-container"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				minH="calc(100vh - 100px)"
			>
				{showGame ? (
					<BreathingBalance
						gameState={gameState}
						onBack={() => {
							gameState.resetGame();
							navigate("/games/stress");
						}}
					/>
				) : (
					<Box>
						<Box className="level-selection">
							<Box
								as="button"
								className="back-arrow"
								onClick={() => navigate("/games")}
							>
								<Box
									as="img"
									src="/src/assets/Login/back_arrow.svg"
									alt="Back"
								/>
							</Box>
							<VStack gap={8} align="center" mt={8}>
								<Heading className="games-title" textAlign="center">
									Breathing Balance
								</Heading>
							</VStack>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default BreathingGame;
