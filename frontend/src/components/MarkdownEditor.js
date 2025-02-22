// MarkdownEditor.js
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import ReactMde from 'react-mde';
import "react-mde/lib/styles/css/react-mde-all.css";
import showdown from 'showdown';

const MarkdownEditor = ({ value, onChange }) => {
    const [selectedTab, setSelectedTab] = useState("write");

    const converter = new showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });

    const handleChange = (newValue) => {
        onChange(newValue); 
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
                <span className="text-danger">*</span> Description 
            </Form.Label>
            <ReactMde
                value={value}
                onChange={handleChange}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={200}
                childProps={{
                    writeButton: {
                        tabIndex: -1,
                    },
                }}
            />
        </Form.Group>
    );
};

export default MarkdownEditor;