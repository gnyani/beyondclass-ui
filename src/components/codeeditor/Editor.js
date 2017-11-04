import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import RenderEditor from './RenderEditor'
import Checkbox from 'material-ui/Checkbox'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import Compile from 'material-ui/svg-icons/file/cloud-upload'
import {HelloWorldTemplates} from './HelloWorldTemplates'
import {editorModes,hackerRankLangNotation} from './Utils'

var properties = require('../properties.json')


const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

const defaultValue =
`console.log("Welcome to Beyond Class");`;


class Editor extends Component{

constructor(){
  super();
  this.state={
    hackerRankCodes: '',
    value: defaultValue,
    languageValue: 'javascript',
    testcases: '',
    language: 'Javascript',
    theme: 'textmate',
    mode: 'javascript',
    fontSize: 14,
    showGutter: true,
    showPrintMargin: false,
    highlightActiveLine: true,
    checked: false,
  }
  this.setTheme = this.setTheme.bind(this);
  this.setMode = this.setMode.bind(this);
  this.onChange = this.onChange.bind(this);
  this.submitRequest = this.submitRequest.bind(this);
  this.updateCheck = this.updateCheck.bind(this);
  this.changeTestCases = this.changeTestCases.bind(this);
}

changeTestCases(event){
  this.setState({
    testcases: event.target.value,
  })
}

onChange(newValue) {
  this.setState({
    value: newValue
  })
}

updateCheck() {
  this.setState((oldState) => {
    return {
      checked: !oldState.checked,
    };
  });
}

setTheme = (e,index,value) => {
  this.setState({
    theme: value
  })
}
setMode = (e,index,value) => {
  var map = new Map(Object.entries(HelloWorldTemplates))
  var editorModesMap = new Map(Object.entries(editorModes))
  var hackerRankLangNotationMap=new Map(Object.entries(hackerRankLangNotation))
  this.setState({
    languageValue: hackerRankLangNotationMap.get(value),
    language: value,
    mode: editorModesMap.get(value),
    value: map.get(value)
  })
}
submitRequest(){
  var codeslist = this.state.hackerRankCodes
  var langcode = codeslist[this.state.languageValue]

  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/submit', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.state.value,
         lang: langcode,
         testcases: this.state.testcases,
      })
    }).then(response => {
      return response.json()
    }).then(response =>{
      var xyz = response[0]
      console.log("response  is" + JSON.stringify({xyz}))
    })
}

componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/languages', {
          credentials: 'include',
           method: 'GET',
        }).then(response => {
          if(response.status === 200)
          return response.json()
        }).then(response => {
          this.setState({
            hackerRankCodes: response.languages.codes
          })
        })
}
showInputTextArea(){
  var buffer = []
  if(this.state.checked)
  buffer.push(<textarea placeholder="Give your input seperated by a space or use new line" rows="10" cols="40"
  className="testcases" onChange={this.changeTestCases} autoComplete='off'/>)
  return buffer
}


  render(){
    return(
      <StayVisible
      {...this.props}
      >
      <div className="Editor">
      <p className="paragraph">Online Compiler !!!</p>
      <Divider />
      <RenderEditor value={this.state.value} theme={this.state.theme} mode={this.state.mode} fontSize={this.state.fontSize}
                   showGutter={this.state.showGutter} showPrintMargin={this.state.showPrintMargin} highlightActiveLine={this.state.highlightActiveLine}
                   setTheme={this.setTheme} setMode={this.setMode} language={this.state.language}  onChange={this.onChange}/>
      <br />
      <Grid fluid>
      <Row center="xs">
      <Col xs={11} sm={11} md={8} lg={8}>
      <Checkbox
        label="Test Againt Custom Input"
        checked={this.state.checked}
        onCheck={this.updateCheck}
        style={{maxWidth: 250 }}
      />
            {this.showInputTextArea()}
      </Col>
      <Col xs={11} sm={11} md={3} lg={3}>
      <RaisedButton label = "Compile & Run" primary={true} icon={<Compile />} onClick={this.submitRequest}/>
      </Col>
      </Row>
      </Grid>

      <br /><br />
     </div>


    </StayVisible>)
  }
}

export default Editor
