import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, FileText, Plus, Edit, Trash2, Move, ChevronRight, ChevronDown } from 'lucide-react';

const SubjectOrganization = ({ curriculumId }) => {
  const [subjects, setSubjects] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for subject organization
  useEffect(() => {
    const mockSubjects = [
      {
        id: 1,
        name: 'Mathematics',
        description: 'Core mathematical concepts and skills',
        topics: [
          {
            id: 101,
            name: 'Numbers and Operations',
            description: 'Understanding number systems and basic operations',
            subtopics: [
              { id: 1001, name: 'Counting and Cardinality', type: 'concept' },
              { id: 1002, name: 'Addition and Subtraction', type: 'skill' },
              { id: 1003, name: 'Multiplication and Division', type: 'skill' }
            ]
          },
          {
            id: 102,
            name: 'Geometry',
            description: 'Shapes, spatial reasoning, and measurement',
            subtopics: [
              { id: 1004, name: 'Basic Shapes', type: 'concept' },
              { id: 1005, name: 'Area and Perimeter', type: 'skill' },
              { id: 1006, name: 'Volume', type: 'skill' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'English Language Arts',
        description: 'Reading, writing, speaking, and listening skills',
        topics: [
          {
            id: 201,
            name: 'Reading Comprehension',
            description: 'Understanding and analyzing written text',
            subtopics: [
              { id: 2001, name: 'Phonics and Word Recognition', type: 'skill' },
              { id: 2002, name: 'Vocabulary Development', type: 'concept' },
              { id: 2003, name: 'Reading Strategies', type: 'skill' }
            ]
          },
          {
            id: 202,
            name: 'Writing',
            description: 'Expressing ideas through written communication',
            subtopics: [
              { id: 2004, name: 'Grammar and Mechanics', type: 'concept' },
              { id: 2005, name: 'Creative Writing', type: 'skill' },
              { id: 2006, name: 'Research and Reporting', type: 'skill' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Science',
        description: 'Scientific inquiry, concepts, and applications',
        topics: [
          {
            id: 301,
            name: 'Life Science',
            description: 'Biology and living organisms',
            subtopics: [
              { id: 3001, name: 'Cells and Organisms', type: 'concept' },
              { id: 3002, name: 'Ecosystems', type: 'concept' },
              { id: 3003, name: 'Human Body Systems', type: 'concept' }
            ]
          }
        ]
      }
    ];

    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 1000);
  }, [curriculumId]);

  const toggleSubjectExpansion = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleTopicExpansion = (subjectId, topicId) => {
    const key = `${subjectId}-${topicId}`;
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubjects(newExpanded);
  };

  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSubjectId, targetTopicId = null) => {
    e.preventDefault();

    if (!draggedItem) return;

    const { item, type } = draggedItem;

    // Handle different drop scenarios
    if (type === 'topic' && targetSubjectId && !targetTopicId) {
      // Moving topic to different subject
      if (item.subjectId !== targetSubjectId) {
        moveTopic(item.id, targetSubjectId);
      }
    } else if (type === 'subtopic' && targetTopicId) {
      // Moving subtopic to different topic
      if (item.topicId !== targetTopicId) {
        moveSubtopic(item.id, targetTopicId);
      }
    }

    setDraggedItem(null);
  };

  const moveTopic = (topicId, newSubjectId) => {
    setSubjects(prevSubjects => {
      const newSubjects = [...prevSubjects];
      let topicToMove = null;

      // Find and remove topic from old subject
      newSubjects.forEach(subject => {
        const topicIndex = subject.topics.findIndex(t => t.id === topicId);
        if (topicIndex !== -1) {
          topicToMove = subject.topics[topicIndex];
          subject.topics.splice(topicIndex, 1);
        }
      });

      // Add topic to new subject
      if (topicToMove) {
        const targetSubject = newSubjects.find(s => s.id === newSubjectId);
        if (targetSubject) {
          targetSubject.topics.push(topicToMove);
        }
      }

      return newSubjects;
    });
  };

  const moveSubtopic = (subtopicId, newTopicId) => {
    setSubjects(prevSubjects => {
      const newSubjects = [...prevSubjects];
      let subtopicToMove = null;

      // Find and remove subtopic from old topic
      newSubjects.forEach(subject => {
        subject.topics.forEach(topic => {
          const subtopicIndex = topic.subtopics.findIndex(st => st.id === subtopicId);
          if (subtopicIndex !== -1) {
            subtopicToMove = topic.subtopics[subtopicIndex];
            topic.subtopics.splice(subtopicIndex, 1);
          }
        });
      });

      // Add subtopic to new topic
      if (subtopicToMove) {
        newSubjects.forEach(subject => {
          const targetTopic = subject.topics.find(t => t.id === newTopicId);
          if (targetTopic) {
            targetTopic.subtopics.push(subtopicToMove);
          }
        });
      }

      return newSubjects;
    });
  };

  const addSubject = () => {
    const newSubject = {
      id: Date.now(),
      name: 'New Subject',
      description: 'Subject description',
      topics: []
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const addTopic = (subjectId) => {
    const newTopic = {
      id: Date.now(),
      name: 'New Topic',
      description: 'Topic description',
      subtopics: []
    };

    setSubjects(prev => prev.map(subject =>
      subject.id === subjectId
        ? { ...subject, topics: [...subject.topics, newTopic] }
        : subject
    ));
  };

  const addSubtopic = (subjectId, topicId) => {
    const newSubtopic = {
      id: Date.now(),
      name: 'New Subtopic',
      type: 'concept'
    };

    setSubjects(prev => prev.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            topics: subject.topics.map(topic =>
              topic.id === topicId
                ? { ...topic, subtopics: [...topic.subtopics, newSubtopic] }
                : topic
            )
          }
        : subject
    ));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'concept': return 'bg-blue-100 text-blue-800';
      case 'skill': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Organization</h1>
          <p className="text-gray-600 mt-1">Organize curriculum content by subjects, topics, and subtopics</p>
        </div>
        <button
          onClick={addSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subject Tree */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Curriculum Structure</h2>
          <p className="text-gray-600 mt-1">Drag and drop to reorganize content</p>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="border border-gray-200 rounded-lg">
                {/* Subject Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleSubjectExpansion(subject.id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedSubjects.has(subject.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-600">{subject.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{subject.topics.length} topics</span>
                    <button className="p-1 text-gray-400 hover:text-blue-500">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subject Content */}
                {expandedSubjects.has(subject.id) && (
                  <div className="pl-8 pr-4 pb-4">
                    <div className="flex items-center justify-between py-2">
                      <h4 className="font-medium text-gray-700">Topics</h4>
                      <button
                        onClick={() => addTopic(subject.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Topic</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {subject.topics.map((topic) => (
                        <div key={topic.id} className="border border-gray-100 rounded">
                          {/* Topic Header */}
                          <div
                            className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                            onClick={() => toggleTopicExpansion(subject.id, topic.id)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, { ...topic, subjectId: subject.id }, 'topic')}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, subject.id)}
                          >
                            <div className="flex items-center space-x-3">
                              {expandedSubjects.has(`${subject.id}-${topic.id}`) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <FileText className="w-4 h-4 text-blue-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">{topic.name}</h4>
                                <p className="text-sm text-gray-600">{topic.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{topic.subtopics.length} subtopics</span>
                              <Move className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>

                          {/* Topic Content */}
                          {expandedSubjects.has(`${subject.id}-${topic.id}`) && (
                            <div className="pl-8 pr-3 pb-3">
                              <div className="flex items-center justify-between py-2">
                                <h5 className="font-medium text-gray-600 text-sm">Subtopics</h5>
                                <button
                                  onClick={() => addSubtopic(subject.id, topic.id)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Subtopic</span>
                                </button>
                              </div>

                              <div className="space-y-1">
                                {topic.subtopics.map((subtopic) => (
                                  <div
                                    key={subtopic.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, { ...subtopic, topicId: topic.id }, 'subtopic')}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, subject.id, topic.id)}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FileText className="w-3 h-3 text-gray-500" />
                                      <span className="text-sm text-gray-700">{subtopic.name}</span>
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(subtopic.type)}`}>
                                        {subtopic.type}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Move className="w-3 h-3 text-gray-400" />
                                      <button className="p-1 text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {subjects.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects added yet</h3>
              <p className="text-gray-600 mb-6">Start building your curriculum by adding subjects and organizing content.</p>
              <button
                onClick={addSubject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add Your First Subject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-blue-100 rounded-full"></span>
            <span className="text-sm text-gray-600">Concept - Foundational knowledge</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-100 rounded-full"></span>
            <span className="text-sm text-gray-600">Skill - Practical abilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
            <span className="text-sm text-gray-600">Activity - Hands-on learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectOrganization;
