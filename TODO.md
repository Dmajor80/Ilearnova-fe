# TODO: Remove Error Message from Teacher Dashboard

## Task Overview
Remove the "Failed to load courses. Please try again." error message display from the teacher dashboard pages. The error will still be logged in the console, but not shown to users.

## Steps
- [x] Edit `src/features/teacher/components/CourseComponents.jsx` to remove the error display block (lines ~108-120).
- [x] Remove profile section from teacher dashboard sidebar navigation.
- [ ] Verify that the error is no longer displayed on teacher dashboard pages.
- [ ] Test that the component still functions correctly (loading and success states).

## Notes
- The error state is still set and logged in console.error for debugging.
- This affects all teacher dashboard pages that use CoursesComponent.
