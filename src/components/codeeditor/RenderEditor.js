import React, { Component } from 'react'
import AceEditor from 'react-ace'
import {modes,themes} from './Utils'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Grid,Row,Col} from 'react-flexbox-grid'
import 'brace/mode/jsx'
/*eslint-disable no-alert, no-console */
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'


modes.forEach((mode) => {
  require(`brace/mode/${mode.value}`)
  require(`brace/snippets/${mode.value}`)
})

themes.forEach((theme) => {
  require(`brace/theme/${theme.name}`)
})




class RenderEditor extends Component {

  menuItems(modes) {
    return modes.map((mode) => (
      <MenuItem
        key={mode.key}
        value={mode.name}
        primaryText={mode.name}
      />
    ));
  }

  menuThemes(themes){
    return themes.map((theme) => (
      <MenuItem
        key={theme.value}
        value={theme.name}
        primaryText={theme.name}
      />
    ));
  }

  render() {
    return (
      <div >

       <Grid fluid>
       <Row center="xs" >
       <Col xs>
        <SelectField
         floatingLabelText="Language"
         value={this.props.language}
         onChange={this.props.setMode}
         style={{textAlign: 'left'}}
         underlineStyle={{borderColor: 'black'}}
         iconStyle={{fill:'black'}}
         autoWidth={true}
       >
       {this.menuItems(modes)}
        </SelectField>
        <br /> <br />
       </Col>
       <Col xs>
        <SelectField
        floatingLabelText="Theme"
         value={this.props.theme}
         onChange={this.props.setTheme}
         underlineStyle={{borderColor: 'black'}}
         style={{textAlign: 'left'}}
         iconStyle={{fill:'black'}}
         autoWidth={true}
       >
       {this.menuThemes(themes)}
      </SelectField>
      <br /> <br />
      </Col>
      </Row>
      </Grid>
        <Grid fluid>
        <Row around="xs">
        <Col xs>
          <AceEditor
          mode={this.props.mode}
          theme={this.props.theme}
          name="My_editor"
          style={{width:'90%',marginLeft: '5%'}}
          onChange={this.props.onChange}
          value={this.props.value}
          fontSize={this.props.fontSize}
          showPrintMargin={this.props.showPrintMargin}
          showGutter={this.props.showGutter}
          highlightActiveLine={this.props.highlightActiveLine}
          editorProps={{$blockScrolling: Infinity}}
          enableBasicAutocompletion= {true}
          enableLiveAutocompletion= {true}
          enableSnippets= {true}
          showLineNumbers= {true}
          tabSize= {2}
            />
      </Col>
      </Row>
      </Grid>
    </div>
    );
  }
}

export default RenderEditor
