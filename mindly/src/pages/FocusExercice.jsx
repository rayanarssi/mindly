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
import PatternRecall from "../components/exercices/PatternRecall";
import usePatternRecall from "../hooks/usePatternRecall";
import { getLevelConfig } from "../services/exerciceLevels";

import "../ui/exercices.css";

function FocusExercice() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const levelId = searchParams.get("level");
	const exerciceState = usePatternRecall();

	const showExercice = exerciceState.level !== null;

	if (!showExercice && levelId) {
		const levelConfig = getLevelConfig("focus", levelId);
		if (levelConfig) {
			exerciceState.selectLevel(levelId);
		}
	}

	return (
		<Box className="exercices-page">
			<Box className="exercices-container">
				{showExercice ? (
					<PatternRecall
						exerciceState={exerciceState}
						onBack={() => {
							exerciceState.resetExercice();
							navigate("/exercices/focus");
						}}
					/>
				) : (
					<Box pt={60}>
						<Box className="level-selection">
							<Box
								as="button"
								className="back-arrow"
								onClick={() => navigate("/exercices")}
							>
								<Box as="img" src="/src/assets/Login/back_arrow.svg" alt="Back" />
							</Box>
							<VStack gap={8} align="center">
								<Heading className="exercices-title" textAlign="center">
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

export default FocusExercice;
