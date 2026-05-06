import { useState, useEffect, useCallback } from "react";
import { supabase } from "../library/supabase/supabaseClient";
import { useAuth } from "../library/supabase/AuthContext";

export function useLikes(postIds = []) {
  const { user } = useAuth();
  const [userLikes, setUserLikes] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !postIds.length) {
      setUserLikes(new Set());
      return;
    }

    const fetchUserLikes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      if (!error && data) {
        setUserLikes(new Set(data.map((like) => like.post_id)));
      }
      setLoading(false);
    };

    fetchUserLikes();
  }, [user, postIds.join(",")]);

  const toggleLike = useCallback(
    async (postId) => {
      if (!user) return { error: new Error("Must be logged in to like") };

      try {
        const { data, error } = await supabase
          .rpc('toggle_like', { post_id_param: postId });

        if (error) return { error };

        if (data && data.action) {
          if (data.action === 'liked') {
            setUserLikes((prev) => new Set([...prev, postId]));
          } else {
            setUserLikes((prev) => {
              const next = new Set(prev);
              next.delete(postId);
              return next;
            });
          }
          return { error: null, action: data.action, likes_count: data.likes_count };
        }
        return { error: null };
      } catch (err) {
        return { error: err };
      }
    },
    [user],
  );

  return { userLikes, toggleLike, loading };
}
