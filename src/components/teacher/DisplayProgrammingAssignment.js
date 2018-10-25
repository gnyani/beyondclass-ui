import React,{Component} from 'react'
import {Card, CardText,CardHeader} from 'material-ui/Card'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import {Grid,Row,Col} from 'react-flexbox-grid'
import { EditorState,convertFromRaw } from 'draft-js'
import AceEditor from 'react-ace'
import Divider from 'material-ui/Divider'

class DisplayProgrammingAssignment extends Component{

  constructor(){
    super();
    this.state={
      expanded: false,
    }
  }

  convertToEditorState = (object) => {
  const contentState = convertFromRaw(object)
  const editorState = EditorState.createWithContent(contentState)
  return editorState
  }
  handleExpand = () => {
     this.setState({expanded: !this.state.expanded});
   };

renderRows = () => {
  var buffer = []
  for(var i=0; i< this.props.inputs.length;i++)
  {
  buffer.push(

        <tr key={i}>
          <td>{this.props.inputs[i]}</td>
          <td>{this.props.outputs[i]}</td>
        </tr>

  )
}
  return buffer;
}
   renderInputs = () => {
     var buffer = []
     buffer.push(
       <div key={1} className="table">
          <table >
           <tbody>
            <tr>
              <th>Inputs</th>
              <th>Outputs</th>
           </tr>
           {this.renderRows()}
         </tbody>
       </table>
       </div>)

   return buffer

   }



  render(){
    return(
      <Grid fluid key={1}>
      <Row around="xs">
      <Col xs={11} sm={11} md={9} lg={8}>
      <Card>
      <CardHeader
        title = "Question"
        style={{backgroundColor: "#d6d6d6",textAlign: "center",fontFamily: "'Roboto', sans-serif"}}
        titleStyle = {{fontWeight: "bold", fontSize : "1.5em"}}
        showExpandableButton={true}
        actAsExpander={true}
        >
      </CardHeader>
     <CardText className="displayQuestions" expandable={true}>
       <RichTextEditorReadOnly editorState={this.convertToEditorState(this.props.question)} />
      </CardText>
     <CardText expandable={true}>
      <hr></hr>
     <h3>TestCases:</h3>
     {this.renderInputs()}
     </CardText>
     <Divider />
     <CardText  >
         <br />
     <AceEditor
     mode={this.props.mode}
     theme='textmate'
     name="My_editor"
     style={{width:'90%',marginLeft: '5%'}}
     value={this.props.source}
     readOnly={true}
     highlightActiveLine={false}
       />
     </CardText>
     </Card>
     <br /><br />
     </Col>
     </Row>
     </Grid>
    )
  }
}
export default DisplayProgrammingAssignment
