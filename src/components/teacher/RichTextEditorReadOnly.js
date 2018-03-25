import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class RichTextEditorToolBarOnFocus extends Component {

  render() {
    const { editorState,editorStyle } = this.props;
    return (
      <div>
        <Editor
          editorState={editorState} editorStyle={editorStyle}
          toolbarOnFocus
          readOnly
          toolbar={{
            options: [],
        }}
        />
      </div>
    );
  }
}

export default RichTextEditorToolBarOnFocus
