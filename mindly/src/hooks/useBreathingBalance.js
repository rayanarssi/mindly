import { useState, useCallback, useEffect, useRef } from "react";
import { getExerciceLevelIds, getLevelConfig } from "../services/exerciceLevels";

export default function useBreathingBalance() {
	const [level, setLevel] = useState(null);
	const [round, setRound] = useState(1);
	const [status, setStatus] = useState("idle");
	const [phase, setPhase] = useState("idle");
	const [message, setMessage] = useState("Select a level to begin");
	const [progress, setProgress] = useState(0);
	const config = level ? getLevelConfig("stress", level) : null;
	const levelIds = getExerciceLevelIds("stress");
	const timerRef = useRef(null);

	const selectLevel = useCallback((levelId) => {
		setLevel(levelId);
		setRound(1);
		setStatus("playing");
		setPhase("inhale");
		setMessage("Follow the breathing rhythm...");
		setProgress(0);
	}, []);

	const startBreathingCycle = useCallback(() => {
		if (!config) return;
		const inhaleTime = config.inhaleTime;
		const exhaleTime = config.exhaleTime;
		const holdTime = config.holdTime;

		setPhase("inhale");
		setMessage("Breathe IN...");

		timerRef.current = setTimeout(() => {
			setPhase("hold");
			setMessage("Hold...");

			timerRef.current = setTimeout(() => {
				setPhase("exhale");
				setMessage("Breathe OUT...");

				timerRef.current = setTimeout(() => {
					setProgress((prev) => Math.min(prev + 20, 100));
					if (round < config.rounds) {
						setRound((prev) => prev + 1);
						startBreathingCycle();
					} else {
						setStatus("complete");
						setMessage("Well done! You completed the rhythm.");
					}
				}, exhaleTime);
			}, holdTime);
		}, inhaleTime);
	}, [config, round]);

	useEffect(() => {
		if (status === "playing") {
			startBreathingCycle();
		}
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [status, startBreathingCycle]);

	const retry = useCallback(() => {
		setRound(1);
		setStatus("playing");
		setPhase("inhale");
		setMessage("Follow the breathing rhythm...");
		setProgress(0);
	}, []);

	const resetExercice = useCallback(() => {
		setLevel(null);
		setRound(1);
		setStatus("idle");
		setPhase("idle");
		setMessage("Select a level to begin");
		setProgress(0);
	}, []);

	const goToNextLevel = useCallback(() => {
		const currentIndex = levelIds.indexOf(level);
		if (currentIndex < levelIds.length - 1) {
			const nextLevel = levelIds[currentIndex + 1];
			selectLevel(nextLevel);
		}
	}, [level, levelIds, selectLevel]);

	const hasNextLevel = useCallback(() => {
		const currentIndex = levelIds.indexOf(level);
		return currentIndex < levelIds.length - 1;
	}, [level, levelIds]);

	return {
		level,
		config,
		round,
		status,
		phase,
		message,
		progress,
		selectLevel,
		retry,
		resetExercice,
		goToNextLevel,
		hasNextLevel,
		LEVELS: levelIds,
	};
}
