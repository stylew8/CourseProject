import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableQuestion from './DraggableQuestion';
import React from 'react';

export const QuestionsSection = React.memo(({ 
    questions, 
    moveQuestion, 
    handleQuestionChange, 
    removeQuestion, 
    handleOptionChange, 
    addOptionToQuestion 
}) => (
    <DndProvider backend={HTML5Backend}>
        {questions.map((question, index) => (
            <DraggableQuestion
                key={question.id}
                index={index}
                question={question}
                moveQuestion={moveQuestion}
                handleQuestionChange={handleQuestionChange}
                removeQuestion={removeQuestion}
                handleOptionChange={handleOptionChange}
                addOptionToQuestion={addOptionToQuestion}
            />
        ))}
    </DndProvider>
));