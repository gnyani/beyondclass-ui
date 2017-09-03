import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {notify} from 'react-notify-toast';
var properties = require('../properties.json');


export default class QuestionCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      answer: props.answer,
      question: props.question,
      avatar: props.avatar,
      firstName:props.name,
      questionId:props.questionId,
      component: props.component,
      open: false
    };
    this.addAnswer = this.addAnswer.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
  }
  handleQuestionChange(){
    notify.show("Question catnnot be changed","error");
  }
  addAnswer(){
     this.setState({
       buttonDisabled: true
     })
     var detailsMap = [];
     detailsMap.push(this.state.questionId);
     detailsMap.push(this.state.answer);
     var trimmedQuestion = this.state.question.replace(/\s/g,'')
     if(trimmedQuestion===''){
      notify.show("Question catnnot be null","error");
     }else{
    fetch('http://'+properties.getHostName+':8080/user/questions/addAnswer', {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body:
         JSON.stringify({
          detailsMap
        })
       }).then(response => {
         if(response.status === 200)
         {
           this.setState({
              buttonDisabled: false,
              question:'',
              answer:''
            })
            return response.text();
         }
         else{
           let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
           notify.show("sorry something went wrong","custom",5000,myColor)
         }
       }).then(response => {
         this.setState({
           response : response,
           number : 1,
           message: '',
         })
         notify.show("Question uploaded successfully","success")
       })}
  }

  handleAnswerChange(e){
    this.setState({answer:e.target.value});
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event) => {
    this.setState({expanded: true});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleReduce = () => {
    this.setState({expanded: false,
      open:true
    });
  };

  render() {
    var i=0;
    var answers =[];
    for (i=0;i<this.state.answer.length;i++){
      answers.push(
        <CardText expandable={true}>
        <p>{this.state.answer[i]}</p>
        </CardText>
      )
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={()=>{this.addAnswer();
          this.handleClose();
        }}
      />,
    ];
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={this.state.firstName}
          subtitle={this.props.date}
          avatar= {this.state.avatar}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
        <p onClick={this.handleExpand} className="question">{this.state.question}?</p>
        </CardText>
        {answers}
        <CardActions>
          <FlatButton label="Add Answer" onClick={this.handleReduce} />
          <Dialog
            title="Ask a Question"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
          <Grid fluid className="question">
            <Row>
              <Col xs={12} sm={12} md={10} lg={9}>
                <TextField
                   hintText="What is your question"
                   fullWidth={true}
                   floatingLabelText="QUESTION"
                   multiLine={true}
                   rows={3}
                   onChange={this.questionChange}
                   value={this.state.question}
                 />
               </Col>
             </Row>
           </Grid>
           <Grid fluid className="question">
             <Row >
               <Col xs={12} sm={12} md={10} lg={9}>
                 <TextField
                    hintText="Answer the Question"
                    fullWidth={true}
                    floatingLabelText="ANSWER"
                    multiLine={true}
                    rows={3}
                    onChange={this.handleAnswerChange}
                  />
                </Col>
              </Row>
            </Grid>
          </Dialog>
        </CardActions>
      </Card>
    );
  }
}
