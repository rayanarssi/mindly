import { useState, useCallback, useRef } from "react";

// Level configurations
const LEVELS = {
	easy: { startLength: 3, speed: 850, label: "Easy", rounds: 5 },
	intermediate: {
		startLength: 4,
		speed: 600,
		label: "Intermediate",
		rounds: 5,
	},
	expert: { startLength: 5, speed: 550, label: "Expert", rounds: 5 },
};

const MAX_ROUNDS = 5;

// 6 colored buttons
const BUTTONS = [
	{ id: 0, color: "#e74c3c", label: "Red" },
	{ id: 1, color: "#3498db", label: "Blue" },
	{ id: 2, color: "#2ecc71", label: "Green" },
	{ id: 3, color: "#f1c40f", label: "Yellow" },
	{ id: 4, color: "#9b59b6", label: "Purple" },
	{ id: 5, color: "#e67e22", label: "Orange" },
];

function generateSequence(length) {
	return Array.from({ length }, () =>
		Math.floor(Math.random() * BUTTONS.length),
	);
}

export default function usePatternRecall() {
	const [level, setLevel] = useState(null);
	const [round, setRound] = useState(1);
	const [sequence, setSequence] = useState([]);
	const [playerInput, setPlayerInput] = useState([]);
	const [status, setStatus] = useState("idle");
	const [highlightedButton, setHighlightedButton] = useState(null);
	const [message, setMessage] = useState("Select a level to start");
	const timeoutRef = useRef(null);

	const config = level ? LEVELS[level] : null;

	// Play sequence with visual highlighting
	const playSequence = useCallback((seq, index, speed) => {
		if (index >= seq.length) {
			setStatus("input");
			setHighlightedButton(null);
			setMessage("Your turn! Repeat the pattern");
			return;
		}

		setHighlightedButton(seq[index]);

		timeoutRef.current = setTimeout(() => {
			setHighlightedButton(null);
			timeoutRef.current = setTimeout(() => {
				playSequence(seq, index + 1, speed);
			}, 200);
		}, speed);
	}, []);

	// Start a round with given level
	const startRound = useCallback(
		(currentRound, selectedLevel) => {
			const lvl = selectedLevel || level;
			const cfg = LEVELS[lvl];
			if (!cfg) return;

			const length = cfg.startLength + (currentRound - 1);
			const newSequence = generateSequence(length);

			setSequence(newSequence);
			setPlayerInput([]);
			setStatus("showing");
			setMessage("Watch carefully...");

			timeoutRef.current = setTimeout(() => {
				playSequence(newSequence, 0, cfg.speed);
			}, 1000);
		},
		[playSequence, level],
	);

	// Handle player button click
	const handleButtonClick = useCallback(
		(buttonId) => {
			if (status !== "input") return;

			const newInput = [...playerInput, buttonId];
			setPlayerInput(newInput);
			setHighlightedButton(buttonId);
			setTimeout(() => setHighlightedButton(null), 200);

			if (newInput.length === sequence.length) {
				const isCorrect = newInput.every((val, idx) => val === sequence[idx]);

				if (isCorrect) {
					if (round >= MAX_ROUNDS) {
						setStatus("complete");
						setMessage("Level complete! Well done!");
					} else {
						setStatus("correct");
						setMessage("Correct! Get ready for the next round...");
						timeoutRef.current = setTimeout(() => {
							setRound((r) => {
								const next = r + 1;
								startRound(next);
								return next;
							});
						}, 1500);
					}
				} else {
					setStatus("wrong");
					setMessage("Try again!");
				}
			}
		},
		[status, playerInput, sequence, startRound],
	);

	// Select level and start game
	const selectLevel = useCallback(
		(selectedLevel) => {
			setLevel(selectedLevel);
			setRound(1);
			startRound(1, selectedLevel); // pass level directly to avoid async state
		},
		[startRound],
	);

	// Retry current round
	const retry = useCallback(() => {
		setPlayerInput([]);
		setStatus("showing");
		setMessage("Watch carefully...");
		timeoutRef.current = setTimeout(() => {
			playSequence(sequence, 0, config?.speed || 500);
		}, 1000);
	}, [sequence, config, playSequence]);

	// Go to next level
	const goToNextLevel = useCallback(() => {
		const levelOrder = ["easy", "intermediate", "expert"];
		const currentIndex = levelOrder.indexOf(level);
		if (currentIndex < levelOrder.length - 1) {
			const nextLevel = levelOrder[currentIndex + 1];
			selectLevel(nextLevel);
		}
	}, [level, selectLevel]);

	// Check if there is a next level
	const hasNextLevel = useCallback(() => {
		const levelOrder = ["easy", "intermediate", "expert"];
		return levelOrder.indexOf(level) < levelOrder.length - 1;
	}, [level]);

	// Reset to level selection
	const resetGame = useCallback(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setLevel(null);
		setRound(1);
		setSequence([]);
		setPlayerInput([]);
		setStatus("idle");
		setHighlightedButton(null);
		setMessage("Select a level to start");
	}, []);

	return {
		level,
		config,
		round,
		sequence,
		playerInput,
		status,
		highlightedButton,
		message,
		buttons: BUTTONS,
		selectLevel,
		handleButtonClick,
		retry,
		resetGame,
		goToNextLevel,
		hasNextLevel,
		LEVELS,
	};
}
