const EXERCICE_LEVELS = {
	focus: {
		id: "focus",
		name: "Pattern Recall",
		theme: "Focus",
		levels: {
			easy: {
				id: "easy",
				label: "Easy",
				description: "Perfect for beginners. Sequences start with 3 colors.",
				startLength: 3,
				speed: 850,
				rounds: 5,
			},
			intermediate: {
				id: "intermediate",
				label: "Intermediate",
				description:
					"Increased speed and longer sequences. Sequences start with 3 colors.",
				startLength: 4,
				speed: 600,
				rounds: 5,
			},
			expert: {
				id: "expert",
				label: "Expert",
				description:
					"Fast sequences with maximum length. Sequences start with 3 colors.",
				startLength: 5,
				speed: 550,
				rounds: 5,
			},
		},
	},
	stress: {
		id: "stress",
		name: "Breathing Balance",
		theme: "Stress",
		description:
			"Regain control through rhythm. Learn to stay calm by controlling your breathing.",
		levels: {
			calm: {
				id: "calm",
				label: "Calm",
				description: "Gentle breathing rhythm with a slow, steady pace.",
				inhaleTime: 4000,
				exhaleTime: 4000,
				holdTime: 2000,
				rounds: 5,
				speedVariation: 0,
			},
			balanced: {
				id: "balanced",
				label: "Balanced",
				description: "Moderate rhythm with slight variations in pace.",
				inhaleTime: 3500,
				exhaleTime: 3500,
				holdTime: 1500,
				rounds: 5,
				speedVariation: 0.2,
			},
			intense: {
				id: "intense",
				label: "Intense",
				description: "Fast and unpredictable rhythm with sudden changes.",
				inhaleTime: 3000,
				exhaleTime: 3000,
				holdTime: 1000,
				rounds: 5,
				speedVariation: 0.4,
			},
		},
	},
	motivation: {
		id: "motivation",
		name: "Resist",
		theme: "Motivation",
		levels: {
			starter: {
				id: "starter",
				label: "Starter",
				description: "Build your motivation foundation.",
				targetScore: 100,
				obstacles: 2,
				rounds: 5,
			},
			driven: {
				id: "driven",
				label: "Driven",
				description: "Maintain focus despite distractions.",
				targetScore: 200,
				obstacles: 3,
				rounds: 5,
			},
			unstoppable: {
				id: "unstoppable",
				label: "Unstoppable",
				description: "Master-level motivation challenges.",
				targetScore: 300,
				obstacles: 4,
				rounds: 5,
			},
		},
	},
};

export function getExerciceLevels(exerciceId) {
	return EXERCICE_LEVELS[exerciceId] || null;
}

export function getLevelConfig(exerciceId, levelId) {
	const exercice = EXERCICE_LEVELS[exerciceId];
	if (!exercice) return null;
	return exercice.levels[levelId] || null;
}

export function getAllExercices() {
	return Object.values(EXERCICE_LEVELS);
}

export function getExerciceLevelIds(exerciceId) {
	const exercice = EXERCICE_LEVELS[exerciceId];
	if (!exercice) return [];
	return Object.keys(exercice.levels);
}

export default EXERCICE_LEVELS;
