import {
	Box,
	Heading,
	Text,
	Button,
	VStack,
	HStack,
	Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import LevelSelection from "../components/games/LevelSelection";
import PatternRecall from "../components/games/PatternRecall";
import usePatternRecall from "../hooks/usePatternRecall";

import "../ui/games.css";

function FocusGame() {
	const navigate = useNavigate();
	const gameState = usePatternRecall();

	const showGame = gameState.level !== null;

	return (
		<Box className="games-page">
			<Box className="games-container">
				{showGame ? (
					<PatternRecall
						gameState={gameState}
						onBack={() => {
							gameState.resetGame();
						}}
					/>
				) : (
					<Box pt={60}>
						<LevelSelection
							onSelectLevel={gameState.selectLevel}
							levels={gameState.LEVELS}
						/>
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default FocusGame;
