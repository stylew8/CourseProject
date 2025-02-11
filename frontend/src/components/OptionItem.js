import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'react-bootstrap-icons';

const OptionItem = ({ index, moveOption, children }) => {
    const ref = useRef(null);
    const dragHandleRef = useRef(null);

    const [, drop] = useDrop({
        accept: 'option',
        hover(item, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveOption(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'option',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(dragHandleRef);
    drop(ref);

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
        >
            <span ref={dragHandleRef} style={{ cursor: 'grab', marginRight: '8px' }}>
                <GripVertical style={{ fontSize: '18px' }} />
            </span>
            {children}
        </div>
    );
};

export default OptionItem;
