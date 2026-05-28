import { useState, useEffect } from "react";
import {
	Box,
	Flex,
	VStack,
	Text,
	Spinner,
	Container,
	Tabs,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../library/supabase/AuthContext";
import { supabase } from "../library/supabase/supabaseClient";
import { useVideoFavorites } from "../hooks/useVideoFavorites";
import ProfileHeader from "../components/profile/ProfileHeader";
import VideoRow from "../components/profile/VideoRow";
import PostCard from "../components/profile/PostCard";
import backArrow from "../assets/Login/back_arrow.svg";
import "../components/profile/profile.css";

function Profile() {
	const navigate = useNavigate();
	const { user, userProfile, loading: authLoading, signOut } = useAuth();

	const [favorites, setFavorites] = useState([]);
	const [expertVideos, setExpertVideos] = useState([]);
	const [posts, setPosts] = useState([]);
	const [loadingFavorites, setLoadingFavorites] = useState(false);
	const [loadingVideos, setLoadingVideos] = useState(false);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [dominantTheme, setDominantTheme] = useState(null);

	const isExpert = userProfile?.role === "expert";

	const favoriteIds = favorites.map((f) => f.id);
	const { toggleFavorite } = useVideoFavorites(favoriteIds);

	const handleToggleFavorite = async (videoId) => {
		await toggleFavorite(videoId);
		setFavorites((prev) => prev.filter((v) => v.id !== videoId));
	};

	useEffect(() => {
		if (!authLoading && !user) {
			navigate("/");
		}
	}, [user, authLoading, navigate]);

	useEffect(() => {
		if (!user) return;

		const fetchCheckin = async () => {
			const storedMainIssue = localStorage.getItem(
				`mindly_main_issue_${user.id}`,
			);

			const { data } = await supabase
				.from("checkins")
				.select("stress_score, focus_score, motivation_score")
				.eq("user_id", user.id)
				.order("id", { ascending: false })
				.limit(1)
				.maybeSingle();

			if (data) {
				const scores = [
					{ theme: "stress", score: data.stress_score },
					{ theme: "focus", score: data.focus_score },
					{ theme: "motivation", score: data.motivation_score },
				];
				scores.sort((a, b) => b.score - a.score);
				setDominantTheme(scores[0].theme);
			} else if (storedMainIssue) {
				setDominantTheme(storedMainIssue);
			}
		};

		const fetchFavorites = async () => {
			setLoadingFavorites(true);
			const { data: favRows, error: favError } = await supabase
				.from("videos_favorites")
				.select("video_id")
				.eq("user_id", user.id);

			if (favError || !favRows?.length) {
				setFavorites([]);
				setLoadingFavorites(false);
				return;
			}

			const videoIds = favRows.map((f) => f.video_id);
			const { data: videosData } = await supabase
				.from("videos")
				.select("id, title, created_by, theme")
				.in("id", videoIds);

			if (!videosData?.length) {
				setFavorites([]);
				setLoadingFavorites(false);
				return;
			}

			const creatorIds = [
				...new Set(videosData.map((v) => v.created_by).filter(Boolean)),
			];

			if (creatorIds.length > 0) {
				const { data: profiles } = await supabase
					.from("profiles")
					.select("id, name")
					.in("id", creatorIds);

				const profileMap = {};
				profiles?.forEach((p) => {
					profileMap[p.id] = p.name;
				});

				setFavorites(
					videosData.map((v) => ({
						...v,
						creator_name: profileMap[v.created_by] || "Unknown",
					})),
				);
			} else {
				setFavorites(
					videosData.map((v) => ({ ...v, creator_name: "Unknown" })),
				);
			}
			setLoadingFavorites(false);
		};

		const fetchExpertVideos = async () => {
			if (!isExpert) return;
			setLoadingVideos(true);
			const { data: videosData, error: videosError } = await supabase
				.from("videos")
				.select("id, title, created_by, theme")
				.eq("created_by", user.id);

			if (videosError || !videosData?.length) {
				setExpertVideos([]);
				setLoadingVideos(false);
				return;
			}

			const creatorIds = [
				...new Set(videosData.map((v) => v.created_by).filter(Boolean)),
			];

			if (creatorIds.length > 0) {
				const { data: profiles } = await supabase
					.from("profiles")
					.select("id, name")
					.in("id", creatorIds);

				const profileMap = {};
				profiles?.forEach((p) => {
					profileMap[p.id] = p.name;
				});

				setExpertVideos(
					videosData.map((v) => ({
						...v,
						creator_name: profileMap[v.created_by] || "Unknown",
					})),
				);
			} else {
				setExpertVideos(
					videosData.map((v) => ({ ...v, creator_name: "Unknown" })),
				);
			}
			setLoadingVideos(false);
		};

		const fetchPosts = async () => {
			setLoadingPosts(true);
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) {
				setPosts([]);
			} else {
				setPosts(data || []);
			}
			setLoadingPosts(false);
		};

		fetchCheckin();
		fetchFavorites();
		fetchExpertVideos();
		fetchPosts();
	}, [user, isExpert]);

	const handleSignOut = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error("Sign out failed:", error);
		}
	};

	if (authLoading) {
		return (
			<Flex className="profile-loading">
				<Spinner size="xl" />
			</Flex>
		);
	}

	if (!user) return null;

	const userTab = isExpert ? "my-videos" : "my-favorites";

	return (
		<Box className="profile-page">
			<Box
				as="button"
				onClick={() => navigate("/")}
				className="back-arrow"
			>
				<Box as="img" src={backArrow} alt="Back" />
			</Box>
			<Box className="profile-container">
				<ProfileHeader
					user={user}
					userProfile={userProfile}
					onSignOut={handleSignOut}
					dominantTheme={dominantTheme}
				/>

				<Box className="profile-tabs-wrapper">
					<Tabs.Root defaultValue={userTab}>
						<Tabs.List className="profile-tab-list">
							{isExpert ? (
								<Tabs.Trigger value="my-videos" className="profile-tab-trigger">
									My Videos
								</Tabs.Trigger>
							) : (
								<Tabs.Trigger
									value="my-favorites"
									className="profile-tab-trigger"
								>
									My Favorites
								</Tabs.Trigger>
							)}
							<Tabs.Trigger value="my-posts" className="profile-tab-trigger">
								My Posts
							</Tabs.Trigger>
						</Tabs.List>

						{isExpert ? (
							<Tabs.Content value="my-videos" className="profile-tab-content">
								{loadingVideos ? (
									<Flex className="profile-loading-content profile-loading-videos">
										<Spinner size="lg" />
									</Flex>
								) : expertVideos.length === 0 ? (
									<Text className="profile-empty-text">
										No videos uploaded yet
									</Text>
								) : (
									<VStack className="profile-video-list">
										{expertVideos.map((video) => (
											<VideoRow
												key={video.id}
												video={video}
												showHeart={false}
												showCreator={false}
											/>
										))}
									</VStack>
								)}
							</Tabs.Content>
						) : (
							<Tabs.Content
								value="my-favorites"
								className="profile-tab-content"
							>
								{loadingFavorites ? (
									<Flex className="profile-loading-content">
										<Spinner size="lg" />
									</Flex>
								) : favorites.length === 0 ? (
									<Text className="profile-empty-text">
										No favorite videos yet
									</Text>
								) : (
									<VStack className="profile-video-list">
										{favorites.map((video) => (
											<VideoRow
												key={video.id}
												video={video}
												onToggleFavorite={handleToggleFavorite}
											/>
										))}
									</VStack>
								)}
							</Tabs.Content>
						)}

						<Tabs.Content value="my-posts" className="profile-tab-content">
							{loadingPosts ? (
								<Flex className="profile-loading-content">
									<Spinner size="lg" />
								</Flex>
							) : posts.length === 0 ? (
								<Text className="profile-empty-text">No posts created yet</Text>
							) : (
								<VStack className="profile-video-list">
									{posts.map((post) => (
										<PostCard key={post.id} post={post} />
									))}
								</VStack>
							)}
						</Tabs.Content>
					</Tabs.Root>
				</Box>
			</Box>
		</Box>
	);
}

export default Profile;
