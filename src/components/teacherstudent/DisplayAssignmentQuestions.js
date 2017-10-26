import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'

class DisplayAssignmentQuestions extends Component{

constructor(){
  super();
  this.displayQuestions = this.displayQuestions.bind(this);
}

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
      <div className="paper">
      <div className="paper-content">
    <textarea key={i} placeholder="Start Typing Your Answer" value={this.props.answers[i]}
    onDrag={(event)=>{event.preventDefault()}} onDrop={(event)=>{event.preventDefault()}}
    onCut={(event)=>{event.preventDefault()}} onCopy={(event)=>{event.preventDefault()}}
    onPaste={(event)=>{event.preventDefault()}} onChange={this.props.handleAnswerChange.bind(this,i)}
    autoComplete='off' />
    </div></div>
      <br /> 
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
