import { useState, useEffect, useCallback } from "react";
import { supabase } from "../library/supabase/supabaseClient";
import { useAuth } from "../library/supabase/AuthContext";

export function useVideoFavorites(videoIds = []) {
  const { user } = useAuth();
  const [favoritedVideos, setFavoritedVideos] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !videoIds.length) {
      setFavoritedVideos(new Set());
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("videos_favorites")
        .select("video_id")
        .eq("user_id", user.id)
        .in("video_id", videoIds);

      if (!error && data) {
        setFavoritedVideos(new Set(data.map((fav) => fav.video_id)));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user, videoIds.join(",")]);

  const toggleFavorite = useCallback(
    async (videoId) => {
      if (!user) return { error: new Error("Must be logged in to favorite") };

      const isFavorited = favoritedVideos.has(videoId);

      if (isFavorited) {
        const { error } = await supabase
          .from("videos_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId);

        if (error) return { error };

        setFavoritedVideos((prev) => {
          const next = new Set(prev);
          next.delete(videoId);
          return next;
        });
        return { error: null, action: "unfavorited" };
      } else {
        const { error } = await supabase
          .from("videos_favorites")
          .insert({ user_id: user.id, video_id: videoId });

        if (error) return { error };

        setFavoritedVideos((prev) => new Set([...prev, videoId]));
        return { error: null, action: "favorited" };
      }
    },
    [user, favoritedVideos],
  );

  return { favoritedVideos, toggleFavorite, loading };
}
