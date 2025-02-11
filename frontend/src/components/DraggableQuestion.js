import React from 'react';
import { useDrop } from 'react-dnd';
import QuestionCard from './QuestionCard';

const DraggableQuestion = ({ question, index, ...props }) => {
    const [, ref] = useDrop({
        accept: 'question',
    });

    return (
        <div ref={ref}>
            <QuestionCard
                question={question}
                index={index}
                {...props}
            />
        </div>
    );
};

export default DraggableQuestion;
