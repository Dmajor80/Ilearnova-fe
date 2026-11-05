import { useCallback } from "react";
import { getParentChildren } from "@/api/parent";
import { getParentChildrenList } from "./parentApiUtils";
import useParentQuery from "./useParentQuery";

export default function useParentChildren() {
  const query = useCallback(() => getParentChildren(), []);
  const result = useParentQuery({
    action: "fetch_parent_children",
    initialData: [],
    label: "Children",
    query,
    select: getParentChildrenList
  });

  return { ...result, children: result.data };
}
