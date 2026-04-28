import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/footer";
import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Image,
	Container,
	Input,
	Button,
	VStack,
	Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import Beige from "../assets/Homepage/Beige_home.svg";
import WhiteHome from "../assets/Homepage/White_home.svg";
import ClockHome from "../assets/Homepage/clock_home.svg";
import StressPlay from "../assets/Homepage/Stress_play_home.svg";
import FocusPlay from "../assets/Homepage/Focus_play_home.svg";
import MotivationPlay from "../assets/Homepage/Motivation_play_home.svg";
import "../ui/home.css";
import "../ui/videos.css";
import { useVideos } from "../hooks/useVideos";
import { useAuth } from "../library/supabase/AuthContext";
import { supabase } from "../library/supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

const themeColors = {
	stress: "#C27A6B",
	focus: "#6E8F85",
	motivation: "#0C4767",
};

const themeIcons = {
	stress: StressPlay,
	focus: FocusPlay,
	motivation: MotivationPlay,
};

const filterOptions = [
	{ value: "all", label: "All" },
	{ value: "focus", label: "Focus" },
	{ value: "stress", label: "Stress" },
	{ value: "motivation", label: "Motivation" },
];

function Videos() {
	const { videos, loading, error } = useVideos(50);
	const { userProfile, user } = useAuth();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");

	const [newVideo, setNewVideo] = useState({
		title: "",
		description: "",
		theme: "stress",
		video_time: "",
		video_url: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isExpert = userProfile?.role === "expert";

	const filteredVideos = videos.filter((video) => {
		const matchesSearch = video.title
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesFilter = filter === "all" || video.theme === filter;
		return matchesSearch && matchesFilter;
	});

	const handleAddVideo = async (e) => {
		e.preventDefault();
		setSubmitError("");

		if (!newVideo.title || !newVideo.video_url || !newVideo.video_time) {
			setSubmitError("Please fill in all required fields");
			return;
		}

		setSubmitting(true);

		try {
			const { error: insertError } = await supabase.from("videos").insert({
				title: newVideo.title,
				video_url: newVideo.video_url,
				video_time: parseInt(newVideo.video_time),
				theme: newVideo.theme,
				description: newVideo.description,
				created_by: user.id,
			});

			if (insertError) throw insertError;

			setIsModalOpen(false);
			setNewVideo({
				title: "",
				description: "",
				theme: "stress",
				video_time: "",
				video_url: "",
			});
			alert("Video added successfully!");
		} catch (err) {
			setSubmitError(err.message || "Failed to add video. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Box>
			<Navbar />

			<Box
				className="videos-section"
				style={{ backgroundImage: `url(${Beige})` }}
			>
				<Container className="videos-container">
					<Heading className="videos-section-heading">Expert Videos</Heading>

					<Box className="videos-controls">
						<Box className="videos-controls-left">
							<Box className="videos-search">
								<input
									type="text"
									placeholder="Search videos..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</Box>
							<Box className="videos-filters">
								{filterOptions.map((option) => (
									<button
										key={option.value}
										className={`filter-btn ${filter === option.value ? `active ${option.value}` : ""}`}
										onClick={() => setFilter(option.value)}
									>
										{option.label}
									</button>
								))}
							</Box>
						</Box>
						{isExpert && (
							<button
								className="add-video-btn"
								onClick={() => setIsModalOpen(true)}
							>
								+ Add Video
							</button>
						)}
					</Box>

					{loading ? (
						<Text className="videos-loading">Loading videos...</Text>
					) : error ? (
						<Text className="videos-error">Error loading videos</Text>
					) : filteredVideos.length === 0 ? (
						<Text className="videos-empty">No videos found.</Text>
					) : (
						<SimpleGrid columns={3} className="videos-grid">
							{filteredVideos.map((video) => {
								const themeColor =
									themeColors[video.theme] || themeColors.stress;
								const ThemeIcon = themeIcons[video.theme] || themeIcons.stress;
								return (
									<Box
										key={video.id}
										bg="white"
										borderRadius="1vw"
										overflow="hidden"
										boxShadow="lg"
										position="relative"
									>
										<Box
											className="video_thumbnail"
											bg={themeColor}
											position="relative"
											zIndex={0}
										>
											<Image
												src={video.video_url}
												alt={video.title}
												w="100%"
												h="100%"
												objectFit="cover"
											/>
											<Box className="theme_icon" zIndex={1}>
												<Image src={ThemeIcon} alt="Play" w="80px" h="80px" />
											</Box>
											<Box
												className="video_minute"
												zIndex={2}
												display="flex"
												alignItems="center"
												gap={1}
											>
												<Image src={ClockHome} alt="Clock" w="18px" h="18px" />
												{video.video_time} min
											</Box>

											<Box
												position="absolute"
												bottom={-4}
												left={0}
												right={0}
												display="flex"
												justifyContent="center"
												zIndex={1}
											>
												<Image
													src={WhiteHome}
													alt="White Home"
													w="100%"
													maxW="425px"
													h="80px"
													mb={-55}
												/>
											</Box>
										</Box>
										<Box p={5} position="relative" zIndex={2}>
											<Box
												className="theme_videos"
												bg={themeColor}
												px={3}
												py={1}
												fontSize="sm"
												mb={2}
											>
												{video.theme.charAt(0).toUpperCase() +
													video.theme.slice(1)}
											</Box>
											<Text color="#472c1b" fontWeight="bold" mb={1}>
												{video.title}
											</Text>
											<Text color="#472c1b" fontSize="sm">
												{video.creator_name}
											</Text>
										</Box>
									</Box>
								);
							})}
						</SimpleGrid>
					)}
				</Container>

				{/* Custom Modal for Add Video */}
				{isModalOpen && (
					<Box
						position="fixed"
						top="0"
						left="0"
						right="0"
						bottom="0"
						bg="rgba(0,0,0,0.5)"
						display="flex"
						alignItems="center"
						justifyContent="center"
						zIndex="9999"
					>
						<Box
							bg="white"
							p={6}
							borderRadius="md"
							maxW="500px"
							width="90%"
							maxH="90vh"
							overflowY="auto"
						>
							<Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
								<Heading size="md">Add New Video</Heading>
								<Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
									✕
								</Button>
							</Box>
							{submitError && (
								<Text color="red.500" mb={4} fontSize="sm">
									{submitError}
								</Text>
							)}
							<form onSubmit={handleAddVideo}>
								<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
									<div>
										<Text className="input-label">Video Title *</Text>
										<Input
											type="text"
											placeholder="Enter video title"
											value={newVideo.title}
											onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
											required
										/>
									</div>
									<div>
										<Text className="input-label">Description</Text>
										<Textarea
											placeholder="Enter video description"
											value={newVideo.description}
											onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
											rows={3}
										/>
									</div>
									<div style={{ display: "flex", gap: "12px" }}>
										<div style={{ flex: "1" }}>
											<Text className="input-label">Theme</Text>
											<select
												value={newVideo.theme}
												onChange={(e) => setNewVideo({ ...newVideo, theme: e.target.value })}
												style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
											>
												<option value="stress">Stress</option>
												<option value="focus">Focus</option>
												<option value="motivation">Motivation</option>
											</select>
										</div>
										<div style={{ flex: "1" }}>
											<Text className="input-label">Video Duration (minutes) *</Text>
											<Input
												type="number"
												placeholder="Enter duration"
												value={newVideo.video_time}
												onChange={(e) => setNewVideo({ ...newVideo, video_time: e.target.value })}
												required
											/>
										</div>
									</div>
									<div>
										<Text className="input-label">Video URL *</Text>
										<Input
											type="url"
											placeholder="Enter video URL (image link)"
											value={newVideo.video_url}
											onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
											required
										/>
									</div>
									<Button type="submit" className="add-video-btn" disabled={submitting}>
										{submitting ? "Adding..." : "Add Video"}
									</Button>
								</div>
							</form>
						</Box>
					</Box>
				)}
			</Box>
			<Footer />
		</Box>
	);
}

export default Videos;
