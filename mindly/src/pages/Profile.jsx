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
import ProfileHeader from "../components/profile/ProfileHeader";
import VideoRow from "../components/profile/VideoRow";
import PostCard from "../components/profile/PostCard";
import backArrow from "../assets/Login/back_arrow.svg";

function Profile() {
	const navigate = useNavigate();
	const { user, userProfile, loading: authLoading, signOut } = useAuth();

	const [favorites, setFavorites] = useState([]);
	const [expertVideos, setExpertVideos] = useState([]);
	const [posts, setPosts] = useState([]);
	const [loadingFavorites, setLoadingFavorites] = useState(false);
	const [loadingVideos, setLoadingVideos] = useState(false);
	const [loadingPosts, setLoadingPosts] = useState(false);

	const isExpert = userProfile?.role === "expert";

	useEffect(() => {
		if (!authLoading && !user) {
			navigate("/");
		}
	}, [user, authLoading, navigate]);

	useEffect(() => {
		if (!user) return;

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
			<Flex minH="100vh" bg="#fefae0" align="center" justify="center">
				<Spinner size="xl" color="#dda15e" />
			</Flex>
		);
	}

	if (!user) return null;

	const userTab = isExpert ? "my-videos" : "my-favorites";

	return (
		<Box minH="100vh" bg="#fefae0" py={10}>
			<Box maxW="90vw" mx="auto">
				<Box as="button" onClick={() => navigate("/")} mb={4}>
					<Box as="img" src={backArrow} alt="Back" />
				</Box>
				<ProfileHeader
					user={user}
					userProfile={userProfile}
					onSignOut={handleSignOut}
				/>

				<Box mt={8}>
					<Tabs.Root defaultValue={userTab}>
						<Tabs.List
							borderBottom="2px solid"
							borderColor="#e2d5c0"
						>
							{isExpert ? (
								<Tabs.Trigger
									value="my-videos"
									css={{
										py: "3",
										px: "1",
										mr: "6",
										fontWeight: "medium",
										color: "gray.500",
										marginBottom: "-2px",
										borderBottom: "2px solid transparent",
										"&[data-selected]": {
											color: "#283618",
											borderBottomColor: "#dda15e",
										},
									}}
								>
									My Videos
								</Tabs.Trigger>
							) : (
								<Tabs.Trigger
									value="my-favorites"
									css={{
										py: "3",
										px: "1",
										mr: "6",
										fontWeight: "medium",
										color: "gray.500",
										marginBottom: "-2px",
										borderBottom: "2px solid transparent",
										"&[data-selected]": {
											color: "#283618",
											borderBottomColor: "#dda15e",
										},
									}}
								>
									My Favorites
								</Tabs.Trigger>
							)}
							<Tabs.Trigger
								value="my-posts"
								css={{
									py: "3",
									px: "1",
									fontWeight: "medium",
									color: "gray.500",
									marginBottom: "-2px",
									borderBottom: "2px solid transparent",
									"&[data-selected]": {
										color: "#283618",
										borderBottomColor: "#dda15e",
									},
								}}
							>
								My Posts
							</Tabs.Trigger>
						</Tabs.List>

						{isExpert ? (
							<Tabs.Content value="my-videos" pt={6}>
								{loadingVideos ? (
									<Flex justify="center" py={10}>
										<Spinner size="lg" color="#dda15e" />
									</Flex>
								) : expertVideos.length === 0 ? (
									<Text color="gray.400" textAlign="center" py={10} fontSize="sm">
										No videos uploaded yet
									</Text>
								) : (
									<VStack gap={3} align="stretch">
										{expertVideos.map((video) => (
											<VideoRow key={video.id} video={video} showHeart={false} showCreator={false} />
										))}
									</VStack>
								)}
							</Tabs.Content>
						) : (
							<Tabs.Content value="my-favorites" pt={6}>
								{loadingFavorites ? (
									<Flex justify="center" py={10}>
										<Spinner size="lg" color="#dda15e" />
									</Flex>
								) : favorites.length === 0 ? (
									<Text color="gray.400" textAlign="center" py={10} fontSize="sm">
										No favorite videos yet
									</Text>
								) : (
									<VStack gap={3} align="stretch">
										{favorites.map((video) => (
											<VideoRow key={video.id} video={video} />
										))}
									</VStack>
								)}
							</Tabs.Content>
						)}

						<Tabs.Content value="my-posts" pt={6}>
							{loadingPosts ? (
								<Flex justify="center" py={10}>
									<Spinner size="lg" color="#dda15e" />
								</Flex>
							) : posts.length === 0 ? (
								<Text color="gray.400" textAlign="center" py={10} fontSize="sm">
									No posts created yet
								</Text>
							) : (
								<VStack gap={3} align="stretch">
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
