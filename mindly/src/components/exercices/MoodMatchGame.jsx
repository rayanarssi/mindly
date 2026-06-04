import { useState, useCallback } from "react";
import { Box, Text, Button, VStack, HStack } from "@chakra-ui/react";
import backArrow from "../../assets/Login/back_arrow.svg";
import "./moodMatchGame.css";

const MOOD_MATCHES = [
	{
		feeling: "I feel overwhelmed",
		feelingEmoji: "🌊",
		correctAction: "Make a tiny plan",
		actionIcon: "📋",
		message:
			"Breaking a big task into smaller steps can make it feel more manageable. Pick one small thing to start with.",
	},
	{
		feeling: "I feel distracted",
		feelingEmoji: "🌀",
		correctAction: "Put your phone away",
		actionIcon: "📵",
		message:
			"Removing distractions can help you focus on one thing at a time. Your notifications can wait.",
	},
	{
		feeling: "I feel tired",
		feelingEmoji: "😴",
		correctAction: "Take a short break",
		actionIcon: "☕",
		message:
			"Rest is not a reward for finishing work, it is a requirement for doing good work. A short pause can recharge you.",
	},
	{
		feeling: "I feel unmotivated",
		feelingEmoji: "🫥",
		correctAction: "Start with 5 minutes",
		actionIcon: "⏱️",
		message:
			"Starting is often the hardest part. Commit to just 5 minutes, momentum will carry you the rest of the way.",
	},
	{
		feeling: "I feel unsure of myself",
		feelingEmoji: "🤔",
		correctAction: "Ask for help",
		actionIcon: "🙋",
		message:
			"Reaching out is a sign of strength, not weakness. You do not have to figure everything out alone.",
	},
	{
		feeling: "I feel stressed",
		feelingEmoji: "😰",
		correctAction: "Take a deep breath",
		actionIcon: "🌬️",
		message:
			"A single deep breath can activate your calm response and help you reset. You are safe in this moment.",
	},
];

const SUPPORTIVE_MESSAGES = [
	"Your feelings are valid.",
	"Small actions can make a difference.",
	"You don't need to solve everything at once.",
	"Progress often starts with one small step.",
	"Taking care of yourself is productive too.",
];

const TOTAL_ROUNDS = 4;

function shuffle(array) {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function buildRound(match) {
	const otherActions = MOOD_MATCHES.filter(
		(m) => m.correctAction !== match.correctAction,
	).map((m) => ({ action: m.correctAction, icon: m.actionIcon }));
	const pool = shuffle(otherActions).slice(0, 3);
	const options = shuffle([
		{ action: match.correctAction, icon: match.actionIcon, isCorrect: true },
		...pool.map((o) => ({ action: o.action, icon: o.icon, isCorrect: false })),
	]);
	return { match, options };
}

function MoodMatchGame({ onBack }) {
	const [gameState, setGameState] = useState("welcome");
	const [rounds, setRounds] = useState([]);
	const [currentRound, setCurrentRound] = useState(0);
	const [selectedAction, setSelectedAction] = useState(null);
	const [showResult, setShowResult] = useState(false);
	const [completedMatches, setCompletedMatches] = useState([]);

	const startGame = useCallback(() => {
		const selected = shuffle(MOOD_MATCHES).slice(0, TOTAL_ROUNDS);
		setRounds(selected.map(buildRound));
		setCurrentRound(0);
		setSelectedAction(null);
		setShowResult(false);
		setCompletedMatches([]);
		setGameState("playing");
	}, []);

	const handleActionClick = useCallback(
		(option) => {
			setSelectedAction(option);
			setCompletedMatches((prev) => [
				...prev,
				{
					feeling: rounds[currentRound].match.feeling,
					feelingEmoji: rounds[currentRound].match.feelingEmoji,
					correctAction: rounds[currentRound].match.correctAction,
					message: rounds[currentRound].match.message,
					userPickedCorrect: option.isCorrect,
				},
			]);
			setShowResult(true);
		},
		[currentRound, rounds],
	);

	const handleNext = useCallback(() => {
		if (currentRound < rounds.length - 1) {
			setCurrentRound((prev) => prev + 1);
			setSelectedAction(null);
			setShowResult(false);
		} else {
			setGameState("complete");
		}
	}, [currentRound, rounds]);

	const handleRestart = useCallback(() => {
		startGame();
	}, [startGame]);

	if (gameState === "welcome") {
		return (
			<Box className="mood-match-game">
				<Box as="button" className="back-arrow" onClick={onBack}>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>

				<Box className="mood-welcome">
					<Text className="mood-welcome-title">Mood Match</Text>
					<Text className="mood-welcome-subtitle">
						Different feelings need different kinds of support. Match each
						feeling with a small action that can help.
					</Text>
					
					<Button className="mood-btn" onClick={startGame}>
						Begin
					</Button>
				</Box>
			</Box>
		);
	}

	if (gameState === "complete") {
		const correctCount = completedMatches.filter(
			(m) => m.userPickedCorrect,
		).length;
		const shownMessages = shuffle(SUPPORTIVE_MESSAGES).slice(0, 4);

		return (
			<Box className="mood-match-game">
				<Box as="button" className="back-arrow" onClick={onBack}>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>

				<Box className="mood-complete">
					<Box className="mood-complete-icon">🌸</Box>
					<Text className="mood-complete-title">Well done!</Text>
					<Text fontSize="16px" color="#6b5a4a" maxW="400px">
						You matched {correctCount} out of {completedMatches.length}{" "}
						feelings. Every time you check in, you learn a little more about
						yourself.
					</Text>

					<Box className="mood-complete-messages">
						{shownMessages.map((msg, i) => (
							<Box key={i} className="mood-complete-message">
								{msg}
							</Box>
						))}
					</Box>

					<Box className="mood-actions">
						<Button className="mood-btn" onClick={handleRestart}>
							Play Again
						</Button>
						<Button className="mood-btn-secondary" onClick={onBack}>
							Back to Exercises
						</Button>
					</Box>
				</Box>
			</Box>
		);
	}

	const current = rounds[currentRound];
	if (!current) return null;

	const { match, options } = current;

	return (
		<Box className="mood-match-game">
			<Box as="button" className="back-arrow" onClick={onBack}>
				<Box as="img" src={backArrow} alt="Back" />
			</Box>

			<VStack gap={6} align="center" width="100%">
				<Box className="mood-round-badge">
					{currentRound + 1} of {rounds.length}
				</Box>

				<Box
					className="mood-fade-in"
					key={currentRound}
					width="100%"
					display="flex"
					flexDirection="column"
					alignItems="center"
					gap={6}
				>
					<Box className="feeling-card">
						<Text className="feeling-label">How you feel</Text>
						<Box className="feeling-emoji">{match.feelingEmoji}</Box>
						<Text className="feeling-text">{match.feeling}</Text>
					</Box>

					{!showResult && (
						<>
							<Text fontSize="15px" color="#8a7a6a" textAlign="center">
								Which action could help most?
							</Text>

							<Box className="actions-grid">
								{options.map((option, idx) => (
									<Box
										key={idx}
										className="action-card"
										onClick={() => handleActionClick(option)}
									>
										<Box className="action-card-icon">{option.icon}</Box>
										<Text className="action-card-text">{option.action}</Text>
									</Box>
								))}
							</Box>
						</>
					)}

					{showResult && (
						<Box className="mood-result">
							<Box className="mood-result-icon">
								{selectedAction?.isCorrect ? "✨" : "💡"}
							</Box>

							{selectedAction?.isCorrect ? (
								<Text className="mood-result-correct">Great match!</Text>
							) : (
								<Text className="mood-result-gentle">
									That can help too! Another approach:{" "}
									<strong>{match.correctAction}</strong>
								</Text>
							)}

							<Box className="mood-result-message">{match.message}</Box>

							<Button className="mood-btn" onClick={handleNext}>
								{currentRound < rounds.length - 1
									? "Next Feeling"
									: "See Results"}
							</Button>
						</Box>
					)}
				</Box>
			</VStack>
		</Box>
	);
}

export default MoodMatchGame;
