import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class RichTextEditorReadOnly extends Component {

  render() {
    const { editorState,editorStyle } = this.props;
    return (
      <div>
        <Editor
          defaultEditorState={editorState} editorStyle={editorStyle}
          readOnly
          toolbarOnFocus
          toolbar={{
            options: [],
        }}
        />
      </div>
    );
  }
}

export default RichTextEditorReadOnly
