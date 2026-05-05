import { useState, useEffect } from "react";
import { supabase } from "../library/supabase/supabaseClient";

export function useForumPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				console.log("Fetching posts...");
				const { data: postsData, error: postsError } = await supabase
					.from("posts")
					.select("*");

				console.log("Posts data:", postsData);
				console.log("Posts error:", postsError);

				if (postsError) {
					console.error("Supabase error:", postsError);
					setError(postsError);
					setLoading(false);
					return;
				}

				if (postsData && postsData.length > 0) {
					console.log("Processing posts:", postsData.length);
					const creatorIds = [
						...new Set(postsData.map((p) => p.user_id).filter(Boolean)),
					];

					console.log("Creator IDs:", creatorIds);

					if (creatorIds.length > 0) {
						const { data: profilesData, error: profilesError } = await supabase
							.from("profiles")
							.select("id, name")
							.in("id", creatorIds);

						console.log("Profiles data:", profilesData);
						console.log("Profiles error:", profilesError);

						if (profilesError) {
							setError(profilesError);
							setLoading(false);
							return;
						}

						const profileMap = {};
						profilesData?.forEach((p) => {
							profileMap[p.id] = p.name;
						});

						const formattedData = postsData.map((post) => ({
							...post,
							creator_name: post.is_anonymous ? "Anonymous" : (profileMap[post.user_id] || "Anonymous"),
						}));
						console.log("Formatted data:", formattedData);
						setPosts(formattedData);
					} else {
						setPosts(postsData.map(post => ({ ...post, creator_name: "Anonymous" })));
					}
				} else {
					console.log("No posts found or empty array");
					setPosts([]);
				}

				setLoading(false);
			} catch (err) {
				console.error("Catch error:", err);
				setError(err);
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	return { posts, loading, error };
}
