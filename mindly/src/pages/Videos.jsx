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
import { useNavigate, Link } from "react-router-dom";

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

const themeOptions = [
	{ value: "stress", label: "Stress" },
	{ value: "focus", label: "Focus" },
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
	});
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(false);
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

		if (!newVideo.title || !selectedFile || !newVideo.video_time) {
			setSubmitError(
				"Please fill in all required fields and select a video file",
			);
			return;
		}

		// Validate file type
		const allowedTypes = ["video/mp4", "video/webm"];
		if (!allowedTypes.includes(selectedFile.type)) {
			setSubmitError("Please upload only .mp4 or .webm files");
			return;
		}

		// Validate file size (max ~500MB)
		const maxSize = 500 * 1024 * 1024;
		if (selectedFile.size > maxSize) {
			setSubmitError("Video file must be less than 500MB");
			return;
		}

		setUploadProgress(true);

		try {
			// Upload video to Supabase storage
			const fileExt = selectedFile.name.split(".").pop();
			const fileName = `${user.id}_${Date.now()}.${fileExt}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("videos")
				.upload(fileName, selectedFile);

			if (uploadError) throw uploadError;

			// Get public URL
			const { data: urlData } = supabase.storage
				.from("videos")
				.getPublicUrl(fileName);

			const videoUrl = urlData.publicUrl;

			// Save video metadata to database
			const { error: insertError } = await supabase.from("videos").insert({
				title: newVideo.title,
				video_url: videoUrl,
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
			});
			setSelectedFile(null);
			alert("Video added successfully!");
		} catch (err) {
			setSubmitError(err.message || "Failed to add video. Please try again.");
		} finally {
			setUploadProgress(false);
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
									<Link
										to={`/video/${video.id}`}
										key={video.id}
										style={{ textDecoration: "none" }}
									>
										<Box
											bg="white"
											borderRadius="1vw"
											overflow="hidden"
											boxShadow="lg"
											position="relative"
											_hover={{ transform: "scale(1.02)", transition: "0.2s" }}
										>
											<Box
												className="video_thumbnail"
												bg={themeColor}
												position="relative"
												zIndex={0}
												h="250px"
												display="flex"
												alignItems="center"
												justifyContent="center"
											>
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
													<Image
														src={ClockHome}
														alt="Clock"
														w="18px"
														h="18px"
													/>
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
									</Link>
								);
							})}
						</SimpleGrid>
					)}
				</Container>

				{/* Add Video Panel */}
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
							bg="beige"
							p={6}
							borderRadius="md"
							maxW="500px"
							width="90%"
							maxH="90vh"
							overflowY="auto"
						>
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								mb={4}
							>
								<Heading size="md" className="heading-add-video">
									Add New Video
								</Heading>
								<Button
									className="close-panel-btn"
									size="sm"
									onClick={() => setIsModalOpen(false)}
								>
									✕
								</Button>
							</Box>
							{submitError && (
								<Text color="red.500" mb={4} fontSize="sm">
									{submitError}
								</Text>
							)}
							<form onSubmit={handleAddVideo}>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "16px",
									}}
								>
									<div>
										<Text className="input-label">Video Title *</Text>
										<Input
											className="input-field"
											type="text"
											placeholder="Enter video title"
											value={newVideo.title}
											onChange={(e) =>
												setNewVideo({ ...newVideo, title: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<Text className="input-label">Description</Text>
										<Textarea
											className="input-field"
											placeholder="Enter video description"
											value={newVideo.description}
											onChange={(e) =>
												setNewVideo({
													...newVideo,
													description: e.target.value,
												})
											}
											rows={3}
										/>
									</div>
									<div style={{ display: "flex", gap: "12px" }}>
										<div style={{ flex: "1" }}>
											<Text className="input-label">Theme</Text>
											<select
												value={newVideo.theme}
												onChange={(e) =>
													setNewVideo({ ...newVideo, theme: e.target.value })
												}
												style={{
													width: "100%",
													padding: "8px",
													borderRadius: "4px",
													border: "1px solid #472c1b",
													backgroundColor: "#fefae0",
													color: "#472c1b",
												}}
											>
												<option value="stress">Stress</option>
												<option value="focus">Focus</option>
												<option value="motivation">Motivation</option>
											</select>
										</div>
										<div style={{ flex: "1" }}>
											<Text className="input-label">
												Video Duration (minutes) *
											</Text>
											<Input
												className="input-field"
												type="number"
												placeholder="Enter duration"
												value={newVideo.video_time}
												onChange={(e) =>
													setNewVideo({
														...newVideo,
														video_time: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div>
										<Text className="input-label">
											Video File * (.mp4 or .webm)
										</Text>
										<Input
											className="input-field"
											type="file"
											accept=".mp4,.webm,video/mp4,video/webm"
											onChange={(e) => setSelectedFile(e.target.files[0])}
											required
										/>
										{selectedFile && (
											<Text fontSize="sm" color="gray.600" mt={1}>
												Selected: {selectedFile.name} (
												{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
											</Text>
										)}
									</div>
									<Button
										type="submit"
										className="add-video-btn"
										disabled={submitting || uploadProgress}
									>
										{submitting || uploadProgress
											? "Uploading..."
											: "Add Video"}
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
