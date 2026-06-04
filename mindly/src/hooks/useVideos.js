import { useState, useEffect } from "react";
import { supabase } from "../library/supabase/supabaseClient";

export function useVideos(limit = 3) {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshKey, setRefreshKey] = useState(0);

	const refresh = () => setRefreshKey((k) => k + 1);

	useEffect(() => {
		const fetchVideos = async () => {
			setLoading(true);
			const { data: videosData, error: videosError } = await supabase
				.from("videos")
				.select("id, title, created_by, video_url, theme, video_time")
				.limit(limit);

			if (videosError) {
				setError(videosError);
				setLoading(false);
				return;
			}

			const creatorIds = [
				...new Set(videosData.map((v) => v.created_by).filter(Boolean)),
			];

			if (creatorIds.length > 0) {
				const { data: profilesData, error: profilesError } = await supabase
					.from("profiles")
					.select("id, name")
					.in("id", creatorIds);

				if (profilesError) {
					setError(profilesError);
					setLoading(false);
					return;
				}

				const profileMap = {};
				profilesData?.forEach((p) => {
					profileMap[p.id] = p.name;
				});

				const formattedData = videosData.map((video) => ({
					...video,
					creator_name: profileMap[video.created_by] || "Unknown",
				}));
				setVideos(formattedData);
			} else {
				setVideos(videosData);
			}

			setLoading(false);
		};

		fetchVideos();
	}, [limit, refreshKey]);

	return { videos, loading, error, refresh };
}

export function useVideo(id) {
	const [video, setVideo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!id) return;
		const fetchVideo = async () => {
			const { data: videoData, error: videoError } = await supabase
				.from("videos")
				.select("id, title, created_by, video_url, theme, description")
				.eq("id", id)
				.single();

			if (videoError) {
				setError(videoError);
				setLoading(false);
				return;
			}

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, name")
				.eq("id", videoData.created_by)
				.single();

			if (profileError) {
				setError(profileError);
				setLoading(false);
				return;
			}

			setVideo({
				...videoData,
				creator_name: profileData?.name || "Unknown",
			});
			setLoading(false);
		};

		fetchVideo();
	}, [id]);

	return { video, loading, error };
}

export function useVideosByTheme() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshKey, setRefreshKey] = useState(0);

	const refresh = () => setRefreshKey((k) => k + 1);

	useEffect(() => {
		const fetchVideos = async () => {
			setLoading(true);
			const themes = ["stress", "focus", "motivation"];
			const results = await Promise.all(
				themes.map((theme) =>
					supabase
						.from("videos")
						.select("id, title, created_by, video_url, theme, video_time")
						.eq("theme", theme)
						.limit(1)
				)
			);

			const allVideos = results
				.filter((r) => !r.error && r.data.length > 0)
				.map((r) => r.data[0]);

			const creatorIds = [
				...new Set(allVideos.map((v) => v.created_by).filter(Boolean)),
			];

			if (creatorIds.length > 0) {
				const { data: profilesData } = await supabase
					.from("profiles")
					.select("id, name")
					.in("id", creatorIds);

				const profileMap = {};
				profilesData?.forEach((p) => {
					profileMap[p.id] = p.name;
				});

				const formattedData = allVideos.map((video) => ({
					...video,
					creator_name: profileMap[video.created_by] || "Unknown",
				}));
				setVideos(formattedData);
			} else {
				setVideos(allVideos);
			}

			setLoading(false);
		};

		fetchVideos();
	}, [refreshKey]);

	return { videos, loading, error, refresh };
}

export function useRelatedVideos(theme, currentVideoId, limit = 3) {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!theme) return;
		const fetchRelated = async () => {
			const { data, error } = await supabase
				.from("videos")
				.select("id, title, created_by, video_url, video_time, theme")
				.eq("theme", theme)
				.neq("id", currentVideoId)
				.limit(limit);

			if (error) {
				setLoading(false);
				return;
			}

			const creatorIds = [
				...new Set(data.map((v) => v.created_by).filter(Boolean)),
			];

			if (creatorIds.length > 0) {
				const { data: profilesData } = await supabase
					.from("profiles")
					.select("id, name")
					.in("id", creatorIds);

				const profileMap = {};
				profilesData?.forEach((p) => {
					profileMap[p.id] = p.name;
				});

				const formattedData = data.map((video) => ({
					...video,
					creator_name: profileMap[video.created_by] || "Unknown",
				}));
				setVideos(formattedData);
			} else {
				setVideos(data);
			}

			setLoading(false);
		};

		fetchRelated();
	}, [theme, currentVideoId, limit]);

	return { videos, loading };
}
