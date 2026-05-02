import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import backArrow from "../../assets/Login/back_arrow.svg";
import "../../ui/games.css";

function LevelSelection({ onSelectLevel, levels }) {
	const navigate = useNavigate();
	const levelCards = [
		{
			key: "easy",
			title: "Easy",
			desc: "Start with 3 buttons, slow playback. Perfect for warming up.",
			color: "#472c1b",
			btnClass: "focus-btn",
		},
		{
			key: "intermediate",
			title: "Intermediate",
			desc: "Start with 4 buttons, medium speed. Ready for a challenge?",
			color: "#472c1b",
			btnClass: "motivation-btn",
		},
		{
			key: "expert",
			title: "Expert",
			desc: "Start with 5 buttons, fast speed + distractions. Only for pros!",
			color: "#472c1b",
			btnClass: "stress-btn",
		},
	];

	return (
		<Box className="level-selection">
			<Box
				as="button"
				className="back-arrow"
				onClick={() => navigate("/games")}
			>
				<Box as="img" src={backArrow} alt="Back" />
			</Box>
			<VStack gap={8} align="center">
				<Heading className="games-title" textAlign="center">
					Pattern Recall
				</Heading>
				<Text fontSize="lg" color="#472c1b" textAlign="center" maxW="600px">
					Remember the sequence of colored buttons and repeat it back. <br /> Each
					round gets longer!
				</Text>

				<HStack
					gap={6}
					justify="center"
					flexWrap="wrap"
					className="level-cards"
				>
					{levelCards.map((lvl) => (
						<Box
							key={lvl.key}
							className="game-card"
							borderColor={lvl.color}
							p={6}
							flex="1"
							minW="280px"
							maxW="350px"
						>
							<VStack gap={3} align="flex-start">
								<Text
									fontSize="1.5rem"
									fontWeight="bold"
									color="#472c1b"
									fontFamily="Just Another Hand, cursive"
								>
									{lvl.title}
								</Text>
								<Text fontSize="0.9rem" color="#472c1b">
									{lvl.desc}
								</Text>
								<Button
									className={`game-card-btn ${lvl.btnClass}`}
                  backgroundColor="#472c1b"
									size="sm"
									onClick={() => onSelectLevel(lvl.key)}
								>
									Select {lvl.title}
								</Button>
							</VStack>
						</Box>
					))}
				</HStack>
			</VStack>
		</Box>
	);
}

export default LevelSelection;
