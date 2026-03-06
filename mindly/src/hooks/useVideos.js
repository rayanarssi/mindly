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
			console.log("Videos:", videosData);
			console.log("Creator IDs:", creatorIds);
			
			if (creatorIds.length > 0) {
				const { data: allProfiles } = await supabase
					.from("profiles")
					.select("id, display_name");

				console.log("All profiles:", allProfiles);

				const { data: profilesData, error: profilesError } = await supabase
					.from("profiles")
					.select("id, display_name")
					.eq("id", creatorIds[0]);

				console.log("Profiles data:", profilesData);
				console.log("Profiles error:", profilesError);

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
