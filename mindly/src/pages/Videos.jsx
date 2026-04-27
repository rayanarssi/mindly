import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/footer";
import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Image,
	Container,
} from "@chakra-ui/react";
import bgHome from "../assets/Homepage/BG_Home.png";
import Beige from "../assets/Homepage/Beige_home.svg";
import WhiteHome from "../assets/Homepage/White_home.svg";
import ClockHome from "../assets/Homepage/clock_home.svg";
import StressPlay from "../assets/Homepage/Stress_play_home.svg";
import FocusPlay from "../assets/Homepage/Focus_play_home.svg";
import MotivationPlay from "../assets/Homepage/Motivation_play_home.svg";
import "../ui/home.css";
import "../ui/videos.css";
import { useVideos } from "../hooks/useVideos";
import { useState } from "react";

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
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");

	const filteredVideos = videos.filter((video) => {
		const matchesSearch = video.title
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesFilter = filter === "all" || video.theme === filter;
		return matchesSearch && matchesFilter;
	});

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
			</Box>
			<Footer />
		</Box>
	);
}

export default Videos;
