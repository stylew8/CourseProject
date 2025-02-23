import React from 'react';
import showdown from 'showdown';

const MarkdownPreviewComponent = ({ markdownText }) => {
    const converter = new showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });
    const html = converter.makeHtml(markdownText);

    return (
        <div
            style={{
                maxWidth: '400px',
                maxHeight: '300px',
                overflow: 'auto', 
                padding: '10px',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default MarkdownPreviewComponent;
