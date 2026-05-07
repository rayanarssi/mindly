import { useState, useEffect } from "react";
import { supabase } from "../library/supabase/supabaseClient";

export function useForumPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchPosts = async () => {
		try {
			const { data: postsData, error: postsError } = await supabase
				.from("posts")
				.select("*")
				.order("created_at", { ascending: false });

			if (postsError) {
				console.error("Supabase error:", postsError);
				setError(postsError);
				setLoading(false);
				return;
			}

			if (postsData && postsData.length > 0) {
				const creatorIds = [
					...new Set(postsData.map((p) => p.user_id).filter(Boolean)),
				];

				if (creatorIds.length > 0) {
					const { data: profilesData, error: profilesError } = await supabase
						.from("profiles")
						.select("id, name, role")
						.in("id", creatorIds);

					if (profilesError) {
						setError(profilesError);
						setLoading(false);
						return;
					}

					const profileMap = {};
					profilesData?.forEach((p) => {
						profileMap[p.id] = { name: p.name, role: p.role };
					});

					const formattedData = postsData.map((post) => {
						const profile = profileMap[post.user_id];
						return {
							...post,
							creator_name:
								post.is_anonymous || !profile
									? "Anonymous"
									: profile.name,
							creator_role: post.is_anonymous ? null : profile?.role || null,
						};
					});
					setPosts(formattedData);
				} else {
					setPosts(
						postsData.map((post) => ({ ...post, creator_name: "Anonymous" })),
					);
				}
			} else {
				setPosts([]);
			}

			setLoading(false);
		} catch (err) {
			console.error("Catch error:", err);
			setError(err);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return { posts, loading, error, refetch: fetchPosts };
}
