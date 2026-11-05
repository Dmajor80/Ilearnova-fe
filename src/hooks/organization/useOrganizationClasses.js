import useClassesData from "./useClassesData";

export default function useOrganizationClasses(options) {
  const classData = useClassesData(options);

  return {
    ...classData,
    availableClasses: classData.classes
  };
}
