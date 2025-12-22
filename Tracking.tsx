// src/hooks/useTrackPlay.ts
import { useEffect } from "react";
import { supabase } from "./supabaseClient";

function getVisitorId() {
  try {
    let id = localStorage.getItem("visitorId");
    if (!id) {
      id = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("visitorId", id);
    }
    return id;
  } catch (e) {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export default function useTrackPlay() {
    const visitorId = getVisitorId();
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;

    (async () => {
        try {
        const { data, error } = await supabase.rpc("increment_play", {
            p_ip_hash: null,
            p_ua: ua,
            p_visitor_id: visitorId,
        });

        if (error) {
            // console.error("Failed to track play:", error);
        } else {
            // console.log("New play count:", data);
        }
        } catch (err) {
        // console.error("Tracking error:", err);
        }
    })();
}
