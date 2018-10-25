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
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.props.onEditorStateChange.bind(this,this.props.questionNumber)}
          onContentStateChange={this.props.onContentStateChange.bind(this,this.props.questionNumber)}
          toolbar={{
            options: ['inline', 'list','blockType','link','embedded','fontSize', 'fontFamily','emoji','colorPicker','history'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
        }}
        />
      </div>
    );
  }
}

export default RichTextEditorToolBarOnFocus
