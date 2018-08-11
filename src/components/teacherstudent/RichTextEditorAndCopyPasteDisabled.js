import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'
import {notify} from 'react-notify-toast'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const {hasCommandModifier} = KeyBindingUtil;

class RichTextEditorAndCopyPasteDisabled extends Component {

constructor(props) {
    super(props);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

myKeyBindingFn = (event) => {
  if (event.keyCode === 67 /* `S` key */ && hasCommandModifier(event)) {
    return 'myeditor-copy';
  }
  if (event.keyCode === 86 /* `S` key */ && hasCommandModifier(event)) {
    return 'myeditor-paste';
  }
  if (event.keyCode === 88 /* `S` key */ && hasCommandModifier(event)) {
    return 'myeditor-cut';
  }
  return getDefaultKeyBinding(event);
}

handleKeyCommand(command: string): DraftHandleValue {
   if (command === 'myeditor-copy') {
     notify.show("Copy is disabled", "warning")
     return 'handled';
   }
   if (command === 'myeditor-paste') {
     notify.show("Paste is disabled","warning")
     return 'handled';
   }
   if (command === 'myeditor-cut') {
     notify.show("Cut is disabled","warning")
     return 'handled';
   }
   return 'not-handled';
 }

  render() {
    const { editorState,editorStyle } = this.props;
    return (
      <div>
        <Editor
          editorState={editorState} editorStyle={editorStyle}
          placeholder="Start typing your answer"
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.myKeyBindingFn}
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
        />
      </div>
    );
  }
}

export default RichTextEditorAndCopyPasteDisabled
