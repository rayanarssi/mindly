import { useState, useCallback } from "react";
import { supabase } from "../library/supabase/supabaseClient";

export function useReplies(postId) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReplies = useCallback(async (overridePostId) => {
    const id = overridePostId || postId;
    if (!id) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("replies")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      const creatorIds = [...new Set(data.map((r) => r.user_id).filter(Boolean))];
      let profileMap = {};

      if (creatorIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, name")
          .in("id", creatorIds);

        if (!profileError && profiles) {
          profiles.forEach((p) => {
            profileMap[p.id] = p.name;
          });
        }
      }

      const formatted = (data || []).map((reply) => ({
        ...reply,
        creator_name: reply.is_anonymous
          ? "Anonymous"
          : profileMap[reply.user_id] || "Anonymous",
      }));

      setReplies(formatted);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addReply = useCallback(
    async ({ body, is_anonymous }) => {
      if (!postId || !body?.trim()) return { error: new Error("Reply body is required") };

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: new Error("Must be logged in") };

      try {
        const { error: insertError } = await supabase
          .from("replies")
          .insert({
            post_id: postId,
            user_id: user.id,
            body: body.trim(),
            is_anonymous,
          });

        if (insertError) throw insertError;

        const { count, error: countError } = await supabase
          .from("replies")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        if (!countError) {
          await supabase
            .from("posts")
            .update({ replies_count: count })
            .eq("id", postId);
        }

        await fetchReplies();
        return { error: null };
      } catch (err) {
        return { error: err };
      }
    },
    [postId, fetchReplies],
  );

  return { replies, loading, error, fetchReplies, addReply };
}
