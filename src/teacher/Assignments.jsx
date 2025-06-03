import React from "react";
import CoursesComponent from "./components/CourseComponents";
import WorksheetContainer from './components/WorksheetContainer';
import Instructions from './components/Instructions';
import QuestionBox from './components/QuestionBox';
import NavigationButtons from './components/NavigationButtons';

const Assignments = () => {
  return (
    <>
      <CoursesComponent page="Assignments" />
      <div className="min-h-screen bg-gray-100 p-6">

        <WorksheetContainer>
          <Instructions />
          <QuestionBox
            number={1}
            question="Describe the process of photosynthesis in plants."
          />
          <NavigationButtons />
        </WorksheetContainer>    </div>

    </>
  );
};

export default Assignments;
