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
import BreathingBalance from "../components/exercices/BreathingBalance";
import useBreathingBalance from "../hooks/useBreathingBalance";
import { getLevelConfig } from "../services/exerciceLevels";

import "../ui/exercices.css";

function BreathingExercice() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const levelId = searchParams.get("level");
	const exerciceState = useBreathingBalance();

	const showExercice = exerciceState.level !== null;

	if (!showExercice && levelId) {
		const levelConfig = getLevelConfig("stress", levelId);
		if (levelConfig) {
			exerciceState.selectLevel(levelId);
		}
	}

	return (
		<Box className="exercices-page">
			<Box
				className="exercices-container"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				minH="calc(100vh - 100px)"
			>
				{showExercice ? (
					<BreathingBalance
						exerciceState={exerciceState}
						onBack={() => {
							exerciceState.resetExercice();
							navigate("/exercices/stress");
						}}
					/>
				) : (
					<Box>
						<Box className="level-selection">
							<Box
								as="button"
								className="back-arrow"
								onClick={() => navigate("/exercices")}
							>
								<Box
									as="img"
									src="/src/assets/Login/back_arrow.svg"
									alt="Back"
								/>
							</Box>
							<VStack gap={8} align="center" mt={8}>
								<Heading className="exercices-title" textAlign="center">
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

export default BreathingExercice;
