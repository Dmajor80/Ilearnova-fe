import { useCallback } from "react";
import { getParentAnnouncements } from "@/api/parent";
import useParentQuery from "./useParentQuery";

const selectList = (payload) => {
  const data = payload && "data" in payload ? payload.data : payload;
  return Array.isArray(data) ? data : [];
};

export default function useParentAnnouncements() {
  const query = useCallback(() => getParentAnnouncements(), []);
  const result = useParentQuery({
    action: "fetch_parent_announcements",
    initialData: [],
    label: "Announcements",
    query,
    select: selectList,
  });
  return { ...result, announcements: result.data };
}
