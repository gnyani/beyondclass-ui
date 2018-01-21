import React,{Component} from 'react'
import {Card, CardTitle, CardText,CardActions} from 'material-ui/Card'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import View from 'material-ui/svg-icons/action/view-list'
import { EditorState,convertFromRaw } from 'draft-js'
import AceEditor from 'react-ace'

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
     buffer.push(<table key={1}>
           <tbody>
            <tr>
              <th>Inputs</th>
              <th>Outputs</th>
           </tr>
           {this.renderRows()}
         </tbody>
       </table>)

   return buffer

   }



  render(){
    return(
      <Grid fluid key={1}>
      <Row around="xs">
      <Col xs={11} sm={11} md={9} lg={8}>
      <Card
      expanded = {this.state.expanded}
      >
     <CardTitle className="displayQuestions" title={<RichTextEditorReadOnly editorState={this.convertToEditorState(this.props.questions[0])} />} />
     <CardText>
     <h3>TestCases:</h3>
     {this.renderInputs()}
     </CardText>
     <CardText expandable={true} >
     <AceEditor
     mode={this.props.mode}
     theme='textmate'
     name="My_editor"
     style={{width:'90%',marginLeft: '5%'}}
     value={this.props.source[0]}
     readOnly={true}
     highlightActiveLine={false}
       />
     </CardText>
     <CardActions>
     <Grid fluid>
     <Row center="xs">
     <Col xs>
      <RaisedButton label="View Code" primary={true} icon={<View />} onClick={this.handleExpand.bind(this)}/>
      </Col>
      </Row>
      </Grid>
      </CardActions>
     </Card>
     <br /><br />
     </Col>
     </Row>
     </Grid>
    )
  }
}
export default DisplayProgrammingAssignment
