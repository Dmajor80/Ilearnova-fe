# CBT prototype

The CBT feature is a frontend-only prototype. The teacher's **CBT Exams** sidebar view creates drafts or publishes exams to a demo class. A student opens **CBT Exams**, selects a demo student profile, and sees published exams for that profile's demo class. Answers, timer deadlines, submissions, scores, and focus warnings are stored in browser `localStorage`; this is for demonstrating the workflow, not a secure exam system.

## Question import

The importer uses the 1EdTech Question and Test Interoperability (QTI) XML interchange format. The current browser parser accepts one or more standalone QTI 2.x/3.x `assessmentItem` XML files. It supports:

- `choiceInteraction` with `simpleChoice` options, including single-choice and multiple-select items.
- `textEntryInteraction` with one expected answer.
- `responseDeclaration` and `correctResponse` answer keys.

The parser does not import QTI ZIP/content packages, assessment tests that reference separate item files, embedded media, advanced scoring, adaptive items, or other interaction types. Import individual item XML files instead. The builder's **Download sample** button provides a minimal QTI XML example.

Reference: [1EdTech QTI](https://www.1edtech.org/standards/qti) and [QTI 3.0 implementation guide](https://www.imsglobal.org/spec/qti/v3p0/impl).
