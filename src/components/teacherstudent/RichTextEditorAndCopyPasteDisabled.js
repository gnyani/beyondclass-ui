import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class RichTextEditorAndCopyPasteDisabled extends Component {

  render() {
    const { editorState,editorStyle } = this.props;
    return (
      <div>
        <Editor
          editorState={editorState} editorStyle={editorStyle}
          placeholder="Start typing your answer"
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.props.onEditorStateChange.bind(this,this.props.questionNumber)}
          onContentStateChange={this.props.onContentStateChange.bind(this,this.props.questionNumber)}
          toolbar={{
            options: ['inline', 'list','blockType','image','link','embedded','fontSize', 'fontFamily','emoji','colorPicker','history'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
        }}
        onDrag={(event)=>{event.preventDefault()}} onDrop={(event)=>{event.preventDefault()}}
        onCut={(event)=>{event.preventDefault()}} onCopy={(event)=>{event.preventDefault()}}
        onPaste={(event)=>{event.preventDefault()}}
        />
      </div>
    );
  }
}

export default RichTextEditorAndCopyPasteDisabled
