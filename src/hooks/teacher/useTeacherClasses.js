import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTeacherClass,
  createTeacherClassMaterial,
  createTeacherClassSubject,
  createTeacherSubjectTopic,
  getTeacherClass,
  getTeacherClassMaterials,
  getTeacherClasses,
  getTeacherClassSubjects,
  getTeacherSubjectTopics
} from "@/api/teacher";
import useTeacherApi, { getTeacherList } from "./teacherApiUtils";

export default function useTeacherClasses() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [classes, setClasses] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const refreshData = useCallback(async (params = {}, resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherClasses",
        "fetch_teacher_classes",
        () => getTeacherClasses(params),
        { failureMessage: "Classes unavailable" }
      );
      if (result !== null) setClasses(getTeacherList(result, ["classes"]));
      return result;
    } catch {
      setClasses([]);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const fetchClass = useCallback(async (id) => {
    const result = await request(
      `teacherClass:${id}`,
      "fetch_teacher_class",
      () => getTeacherClass(id),
      { failureMessage: "Class unavailable" }
    );
    if (result !== null) setClassDetails(result);
    return result;
  }, [request]);

  const fetchMaterials = useCallback(async (classId) => {
    const result = await request(
      `teacherClassMaterials:${classId}`,
      "fetch_teacher_class_materials",
      () => getTeacherClassMaterials(classId),
      { failureMessage: "Course materials unavailable" }
    );
    if (result !== null) setMaterials(getTeacherList(result, ["materials"]));
    return result;
  }, [request]);

  const addMaterial = useCallback(async (classId, data) => {
    const result = await request(
      `teacherClassMaterials:${classId}`,
      "create_teacher_class_material",
      () => createTeacherClassMaterial(classId, data),
      { mutation: true, successMessage: "Course material added", failureMessage: "Failed to add course material" }
    );
    await fetchMaterials(classId);
    return result;
  }, [request, fetchMaterials]);

  const fetchSubjects = useCallback(async (classId) => {
    const result = await request(
      `teacherClassSubjects:${classId}`,
      "fetch_teacher_class_subjects",
      () => getTeacherClassSubjects(classId),
      { failureMessage: "Class subjects unavailable" }
    );
    if (result !== null) setSubjects(getTeacherList(result, ["subjects"]));
    return result;
  }, [request]);

  const addSubject = useCallback(async (classId, data) => {
    const result = await request(
      `teacherClassSubjects:${classId}`,
      "create_teacher_class_subject",
      () => createTeacherClassSubject(classId, data),
      { mutation: true, successMessage: "Subject added to class", failureMessage: "Failed to add subject" }
    );
    await fetchSubjects(classId);
    return result;
  }, [request, fetchSubjects]);

  const fetchTopics = useCallback(async (subjectId) => {
    const result = await request(
      `teacherSubjectTopics:${subjectId}`,
      "fetch_teacher_subject_topics",
      () => getTeacherSubjectTopics(subjectId),
      { failureMessage: "Subject topics unavailable" }
    );
    if (result !== null) setTopics(getTeacherList(result, ["topics"]));
    return result;
  }, [request]);

  const addTopic = useCallback(async (subjectId, data) => {
    const result = await request(
      `teacherSubjectTopics:${subjectId}`,
      "create_teacher_subject_topic",
      () => createTeacherSubjectTopic(subjectId, data),
      { mutation: true, successMessage: "Topic added successfully", failureMessage: "Failed to add topic" }
    );
    await fetchTopics(subjectId);
    return result;
  }, [request, fetchTopics]);

  const addClass = useCallback(async (data) => {
    const result = await request(
      "teacherClasses",
      "create_teacher_class",
      () => createTeacherClass(data),
      { mutation: true, successMessage: "Class created successfully", failureMessage: "Failed to create class" }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    classes,
    classDetails,
    materials,
    subjects,
    topics,
    loading,
    mutating,
    error,
    lastUpdated,
    refreshData,
    fetchClass,
    fetchMaterials,
    addMaterial,
    fetchSubjects,
    addSubject,
    fetchTopics,
    addTopic,
    addClass,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}
