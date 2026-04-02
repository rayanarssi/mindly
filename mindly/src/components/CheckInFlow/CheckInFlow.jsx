import { useState, useEffect } from "react";
import { Box, Button, Text, Heading, Flex, Progress } from "@chakra-ui/react";
import { useAuth } from "../../library/supabase/AuthContext";
import { supabase } from "../../library/supabase/supabaseClient";
import "./checkin.css";

const questions = [
	{
		id: 1,
		category: "stress",
		text: "I feel overwhelmed by my responsibilities.",
	},
	{
		id: 2,
		category: "stress",
		text: "I feel stressed when thinking about deadlines or exams.",
	},
	{
		id: 3,
		category: "stress",
		text: "I have trouble relaxing, even during free time.",
	},
	{ id: 4, category: "stress", text: "I feel pressure to perform well." },
	{ id: 5, category: "stress", text: "I feel mentally exhausted." },
	{ id: 6, category: "focus", text: "I find it hard to concentrate on tasks." },
	{
		id: 7,
		category: "focus",
		text: "I get easily distracted while studying or working.",
	},
	{
		id: 8,
		category: "focus",
		text: "I struggle to stay focused for a long period of time.",
	},
	{
		id: 9,
		category: "focus",
		text: "My mind often wanders when I try to focus.",
	},
	{
		id: 10,
		category: "focus",
		text: "I have difficulty finishing tasks without losing attention.",
	},
	{
		id: 11,
		category: "motivation",
		text: "I struggle to start tasks, even when I know they are important.",
	},
	{
		id: 12,
		category: "motivation",
		text: "I feel unmotivated to study or work.",
	},
	{
		id: 13,
		category: "motivation",
		text: "I procrastinate more than I would like.",
	},
	{
		id: 14,
		category: "motivation",
		text: "I find it hard to stay consistent with my tasks.",
	},
	{
		id: 15,
		category: "motivation",
		text: "I lack energy to complete what I planned to do.",
	},
];

const answerOptions = [
	{ value: 1, label: "Rarely or never" },
	{ value: 2, label: "Sometimes" },
	{ value: 3, label: "Regularly" },
	{ value: 4, label: "Often or always" },
];

const categoryLabels = {
	stress: "Stress",
	focus: "Focus",
	motivation: "Motivation",
};

const categoryColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

const feedbackMessages = {
	stress:
		"It sounds like stress is taking a toll on you. Learning how to manage it can help you feel more in control.",
	focus:
		"It seems like staying focused is a challenge for you. Small changes to your environment and habits can make a big difference.",
	motivation:
		"It looks like motivation is the main hurdle. Let's find ways to get you moving again!",
};

function CheckInFlow() {
	const { user, userProfile } = useAuth();
	const [hasCompletedCheckIn, setHasCompletedCheckIn] = useState(null);
	const [screen, setScreen] = useState("intro");
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState({});
	const [activeTab, setActiveTab] = useState("stress");

	useEffect(() => {
		const checkExistingCheckIn = async () => {
			if (user && userProfile && userProfile.role === "user") {
				const localCompleted = localStorage.getItem(`mindly_checkin_${user.id}`);
				if (localCompleted) {
					setHasCompletedCheckIn(true);
					return;
				}

				const { data, error } = await supabase
					.from("checkins")
					.select("id")
					.eq("user_id", user.id)
					.single();

				if (error && error.code !== "PGRST116") {
					console.error("Error checking check-in:", error);
				}

				if (data) {
					localStorage.setItem(`mindly_checkin_${user.id}`, "true");
					setHasCompletedCheckIn(true);
				} else {
					setHasCompletedCheckIn(false);
				}
			} else {
				setHasCompletedCheckIn(true);
			}
		};

		checkExistingCheckIn();
	}, [user, userProfile]);

	const handleStart = () => {
		setScreen("questions");
	};

	const handleAnswer = (value) => {
		const questionId = questions[currentQuestionIndex].id;
		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));

		if (currentQuestionIndex < questions.length - 1) {
			setTimeout(() => {
				setCurrentQuestionIndex((prev) => prev + 1);
			}, 150);
		} else {
			setTimeout(() => {
				setScreen("results");
			}, 150);
		}
	};

	const handleClose = async () => {
		if (user) {
			const stressScore = calculateCategoryScore("stress");
			const focusScore = calculateCategoryScore("focus");
			const motivationScore = calculateCategoryScore("motivation");
			const mainIssue = getMainIssue();

			const { data, error } = await supabase.from("checkins").insert({
				user_id: user.id,
				stress_score: stressScore,
				focus_score: focusScore,
				motivation_score: motivationScore,
				dominant_theme: mainIssue,
				dominant_score: mainIssue === "stress" ? stressScore : mainIssue === "focus" ? focusScore : motivationScore,
			});

			if (error) {
				console.error("Error saving check-in:", error);
			} else {
				console.log("Check-in saved:", data);
			}

			localStorage.setItem(`mindly_checkin_${user.id}`, "true");
		}
		setScreen("closed");
	};

	const calculateCategoryScore = (category) => {
		const categoryQuestions = questions.filter((q) => q.category === category);
		let total = 0;
		let count = 0;
		categoryQuestions.forEach((q) => {
			if (answers[q.id] !== undefined) {
				total += answers[q.id];
				count++;
			}
		});
		return count > 0 ? Math.round((total / (count * 4)) * 100) : 0;
	};

	const getMainIssue = () => {
		const stressScore = calculateCategoryScore("stress");
		const focusScore = calculateCategoryScore("focus");
		const motivationScore = calculateCategoryScore("motivation");

		const scores = [
			{ category: "stress", score: stressScore },
			{ category: "focus", score: focusScore },
			{ category: "motivation", score: motivationScore },
		];

		scores.sort((a, b) => b.score - a.score);
		return scores[0].category;
	};

	const getScoreForTab = (category) => {
		return calculateCategoryScore(category);
	};

	if (
		hasCompletedCheckIn === null ||
		hasCompletedCheckIn ||
		screen === "closed"
	) {
		return null;
	}

	const currentQuestion = questions[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	return (
		<Box className="checkin-overlay">
			<Box className="checkin-container">
				{screen === "intro" && (
					<Box className="checkin-intro">
						<Text className="checkin-description">
							You will now answer a short questionnaire to help identify areas
							where you may need extra support or clarity.
						</Text>
						<Text className="checkin-time">
							This will take approximately 5 minutes. <br /> There are no right
							or wrong answers.
						</Text>
						<Button className="checkin-start-button" onClick={handleStart}>
							Start
						</Button>
					</Box>
				)}

				{screen === "questions" && (
					<Box className="checkin-questions">
						<Flex className="checkin-progress-container" align="center" gap={4}>
							<Text
								className="checkin-category-label"
								color={categoryColors[currentQuestion.category]}
							>
								{categoryLabels[currentQuestion.category]}
							</Text>
							<Box className="checkin-progress-bar">
								<Box
									className="checkin-progress-fill"
									style={{ width: `${progress}%` }}
									bg={categoryColors[currentQuestion.category]}
								/>
							</Box>
							<Text className="checkin-progress-text">
								{currentQuestionIndex + 1} / {questions.length}
							</Text>
						</Flex>

						<Heading className="checkin-question-text">
							{currentQuestion.text}
						</Heading>

						<Flex className="checkin-answers" direction="column" gap={3}>
							{answerOptions.map((option) => (
								<Button
									key={option.value}
									className="checkin-answer-button"
									onClick={() => handleAnswer(option.value)}
								>
									{option.label}
								</Button>
							))}
						</Flex>
					</Box>
				)}

				{screen === "results" && (
					<Box className="checkin-results">
						<Heading className="checkin-results-title">Your Results</Heading>
						<Text className="checkin-results-subtitle">
							Based on your answers, we have an idea of how you are doing. <br /> This
							is not a diagnosis, but a snapshot to help you.
						</Text>

						<Box className="checkin-tabs">
							<Button
								className={`checkin-tab ${activeTab === "stress" ? "active" : ""}`}
								onClick={() => setActiveTab("stress")}
							>
								Stress
							</Button>
							<Button
								className={`checkin-tab ${activeTab === "focus" ? "active" : ""}`}
								onClick={() => setActiveTab("focus")}
							>
								Focus
							</Button>
							<Button
								className={`checkin-tab ${activeTab === "motivation" ? "active" : ""}`}
								onClick={() => setActiveTab("motivation")}
							>
								Motivation
							</Button>
						</Box>

						<Box className="checkin-score-display">
							<Text className="checkin-score-value">
								{getScoreForTab(activeTab)}%
							</Text>
							<Box className="checkin-score-bar">
								<Box
									className="checkin-score-fill"
									style={{ width: `${getScoreForTab(activeTab)}%` }}
									bg={categoryColors[activeTab]}
								/>
							</Box>
						</Box>

						{getMainIssue() === activeTab && (
							<Box
								className="checkin-main-issue"
								bg={categoryColors[activeTab]}
							>
								<Text className="checkin-main-issue-text">
									This seems to be your main challenge right now
								</Text>
							</Box>
						)}

						<Text className="checkin-feedback">
							{feedbackMessages[getMainIssue()]}
						</Text>

						<Button className="checkin-cta-button" onClick={handleClose}>
							Watch videos about {getMainIssue()}
						</Button>
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default CheckInFlow;
