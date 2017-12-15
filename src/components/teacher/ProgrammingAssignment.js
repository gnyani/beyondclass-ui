import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import RichTextEditor from './RichTextEditor'
import DatePicker from 'material-ui/DatePicker'
import Add from 'material-ui/svg-icons/content/add'
import RaisedButton from 'material-ui/RaisedButton'
import {Grid,Row,Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import AddBox from 'material-ui/svg-icons/content/add-box'
import Delete from 'material-ui/svg-icons/action/delete'
import {EditorState} from 'draft-js'
import TestCases from './TestCases'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class ProgrammingAssignment extends Component{
  constructor(){
    super();
    this.state={
      editorState: EditorState.createEmpty(),
      minDate: new Date(),
      controlledDate: null,
      showTextFields: false,
      questionValue: '',
      input: '',
      output: '',
      inputs: [],
      outputs: [],
    }
    this.renderTestCaseTabs = this.renderTestCaseTabs.bind(this)
  }

  handleDateChange = (event, date) => {
    this.setState({
      controlledDate: date,
    });
  }

  changeInputs = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  changeOutputs = (event) => {
   this.setState({
     output: event.target.value
   })
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onContentStateChange: Function = (contentState) => {
    var text= ''
    var blocks=contentState.blocks
     for(var i=0;i<blocks.length;i++)
     {
       text = text + blocks[i].text
     }
     this.setState({
       contentState,
       questionValue: text,
     });
  };

  addTestCase = () => {
    var inputs=this.state.inputs.slice()
    var outputs=this.state.outputs.slice()
    inputs.push(this.state.input)
    outputs.push(this.state.output)
    this.setState({
      inputs: inputs,
      outputs: outputs,
      showTextFields: false,
    })
  }

  removeTestCase = (i) => {
    var newInputs = this.state.inputs.slice()
    newInputs.splice(i,1)
    var newOutputs = this.state.outputs.slice()
    newOutputs.splice(i,1)
    this.setState({
      inputs: newInputs,
      outputs: newOutputs,
    })
  }

  renderTestCases = () => {
    var buffer = []
    for(var i=0;i<this.state.inputs.length;i++)
    {
    buffer.push(
      <Grid fluid key={i}>
      <Row start="xs" middle="xs">
      <Col xs={9} sm={9} md={8} lg={8}>
      <p className="testcaseparagraph"> TestCase{i}: </p>
      <br />
      <textarea  value={this.state.inputs[i]} rows="4"
      className="testcasesDisplay" disabled={true}/>
      <br />
      <textarea  value={this.state.outputs[i]} rows="4"  className="testcasesDisplay"  disabled={true} />
      </Col>
      <Col xs={2} sm={2} md={2} lg={2} >
      <IconButton onClick={this.removeTestCase.bind(this,i)}><Delete viewBox='0 0 20 20' color="red"/></IconButton>
      </Col>
      </Row>
      </Grid>
    )
  }
    return buffer
  }

  renderTestCaseTabs(){
   var buffer=[]
   if(this.state.showTextFields){
     buffer.push(
       <Grid fluid key={1}>
       <Row around="xs" middle="xs">
       <Col xs={10} sm={10} md={10} lg={10}>
       <TestCases key={1} changeInputs = {this.changeInputs} changeOutputs={this.changeOutputs}/>
       </Col>
       <Col xs={2} sm={2} md={2} lg={2}>
       <IconButton onClick={this.addTestCase}><AddBox viewBox='0 0 20 20' color="green"/></IconButton>
       </Col>
       </Row>
       </Grid>
     )
   }
   return buffer;
  }

  handleShowTextFields = () => {
  this.setState({
    showTextFields: true,
  })
  }

  render(){
    return(
      <StayVisible
        {...this.props}
      >
      <div className="ProgrammingAssignment">
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      <br /><br />
      <DatePicker hintText="Last Date" minDate={this.state.minDate} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <br />
      <p className="paragraph"> Question </p>
      <RichTextEditor  editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange}
      onContentStateChange={this.onContentStateChange}
      placeholder='Please Type the question along with one Test Input and Test Output'/>
      <br />
      {this.renderTestCases()}
      <br />
      {this.renderTestCaseTabs()}
      <br />
      <RaisedButton label="Add TestCase" primary={true} icon={<Add />} onClick={this.handleShowTextFields} />
      </Col>
      </Row>
      </Grid>
      </div>
      </StayVisible>
    )
  }
}

export default ProgrammingAssignment
