import { useState, useEffect } from "react";
import { supabase } from "../library/supabase/supabaseClient";

export function useVideos(limit = 3) {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVideos = async () => {
			const { data: videosData, error: videosError } = await supabase
				.from("videos")
				.select("id, title, created_by, video_url, theme, video_time")
				.limit(limit);

			if (videosError) {
				setError(videosError);
				setLoading(false);
				return;
			}

			const creatorIds = [...new Set(videosData.map(v => v.created_by).filter(Boolean))];
	
			if (creatorIds.length > 0) {
				const { data: allProfiles } = await supabase
					.from("profiles")
					.select("id, display_name");

				const { data: profilesData, error: profilesError } = await supabase
					.from("profiles")
					.select("id, display_name")
					.eq("id", creatorIds[0]);

				const profileMap = {};
				profilesData?.forEach(p => {
					profileMap[p.id] = p.display_name;
				});

				const formattedData = videosData.map(video => ({
					...video,
					creator_name: profileMap[video.created_by] || video.created_by
				}));
				setVideos(formattedData);
			} else {
				setVideos(videosData);
			}

			setLoading(false);
		};

		fetchVideos();
	}, [limit]);

	return { videos, loading, error };
}
