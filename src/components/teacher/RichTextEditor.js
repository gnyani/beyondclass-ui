import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class RichTextEditor extends Component {

  render() {
    const { editorState,placeholder } = this.props;
    return (
      <div>
        <Editor
          placeholder={placeholder}
          editorState={editorState}  editorStyle={{borderStyle: 'solid',borderWidth: '0.1px',fontSize: '24'}}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.props.onEditorStateChange}
          onContentStateChange={this.props.onContentStateChange}
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

export default RichTextEditor
