import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Divider from 'material-ui/Divider'

class DisplayAssignmentQuestions extends Component{

constructor(){
  super();
  this.displayQuestions = this.displayQuestions.bind(this);
  //git this.renderTextArea = this.renderTextArea.bind(this);
}

// renderTextArea(i){
//   var buffer = []
//   if(this.props.answers)
//     buffer.push(<textarea key={i} className="answerArea" value={this.props.answers[i]} onChange={this.props.handleAnswerChange.bind(this,i)}  />)
//   else {
//     buffer.push(<textarea key={i} className="answerArea" onChange={this.props.handleAnswerChange.bind(this,i)}  />)
//   }
//   return buffer
// }
displayQuestions(){
  var buffer =[]
  for(let i=0 ; i < this.props.questions.length ;i++){
    buffer.push(<div key={i}>
      <Grid fluid>
      <Row start="xs">
      <Col xs>
      <li className="list" >{this.props.questions[i]}</li>
      <br />
      </Col>
      </Row>
      <Row start="xs">
      <Col xs={11} sm={11} md={10} lg={10}>
    <textarea key={i} className="answerArea" value={this.props.answers[i]} onChange={this.props.handleAnswerChange.bind(this,i)}  />
      <br /> <br />
      <Divider />
      </Col>
      </Row>
      </Grid>
      <br />
      </div>)
  }
  return buffer
}

  render(){
    return(
    <div className="DisplayAssignmentQuestions">
    <ol> {this.displayQuestions()}</ol>
    </div>
    )
  }
}

export default DisplayAssignmentQuestions
