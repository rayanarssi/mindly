const GAME_LEVELS = {
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
				description: "Increased speed and longer sequences. Sequences start with 3 colors.",
				startLength: 4, 
				speed: 600,
				rounds: 5,
			},
			expert: {
				id: "expert",
				label: "Expert",
				description: "Fast sequences with maximum length. Sequences start with 3 colors.",
				startLength: 5,
				speed: 550,
				rounds: 5,
			},
		},
	},
	stress: {
		id: "stress",
		name: "Pressure Balance",
		theme: "Stress",
		levels: {
			calm: {
				id: "calm",
				label: "Calm",
				description: "Gentle introduction to stress management.",
				difficulty: 1,
				timeLimit: 60,
				rounds: 5,
			},
			balanced: {
				id: "balanced",
				label: "Balanced",
				description: "Moderate challenges with timed responses.",
				difficulty: 2,
				timeLimit: 45,
				rounds: 5,
			},
			intense: {
				id: "intense",
				label: "Intense",
				description: "High-pressure scenarios requiring quick decisions.",
				difficulty: 3,
				timeLimit: 30,
				rounds: 5,
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

export function getGameLevels(gameId) {
	return GAME_LEVELS[gameId] || null;
}

export function getLevelConfig(gameId, levelId) {
	const game = GAME_LEVELS[gameId];
	if (!game) return null;
	return game.levels[levelId] || null;
}

export function getAllGames() {
	return Object.values(GAME_LEVELS);
}

export function getGameLevelIds(gameId) {
	const game = GAME_LEVELS[gameId];
	if (!game) return [];
	return Object.keys(game.levels);
}

export default GAME_LEVELS;
