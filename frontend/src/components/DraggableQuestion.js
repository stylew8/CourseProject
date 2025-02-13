import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import QuestionCard from './QuestionCard';

const DraggableQuestion = ({ question, index, moveQuestion, ...props }) => {
    const ref = useRef(null);
    const dragHandleRef = useRef(null);

    const [, drop] = useDrop({
        accept: 'question',
        hover(item, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveQuestion(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'question',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(dragHandleRef);
    drop(ref);

    return (
        <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <QuestionCard
                question={question}
                index={index}
                dragHandleRef={dragHandleRef}
                {...props}
            />
        </div>
    );
};

export default DraggableQuestion;
