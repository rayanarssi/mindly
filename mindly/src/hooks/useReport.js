import { useState } from "react";
import { supabase } from "../library/supabase/supabaseClient";

export function useReport() {
  const [submitting, setSubmitting] = useState(false);

  const submitReport = async ({ postId, reason, description }) => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to report");

      const { error } = await supabase.from("reports").insert({
        post_id: postId,
        reported_by: user.id,
        reason,
        description: description || null,
      });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err };
    } finally {
      setSubmitting(false);
    }
  };

  return { submitReport, submitting };
}
