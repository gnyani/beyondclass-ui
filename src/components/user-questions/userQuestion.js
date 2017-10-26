import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../../styles/student-adda.css';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import QuestionCard from './questionCard'
import NewQuestionDialogue from './newQuestionDialogue'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
var properties = require('../properties.json');

class Hello extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      question : '',
      answer: '',
      questions:[],
      answers:[],
      useremails:[],
      QuestionIds:[],
      users:[],
      dates:[],
      buttonDisabled:false
    }
    this.getQuestions = this.getQuestions.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.list = this.list.bind(this);
    this.Enter = this.Enter.bind(this);
  }
  list(buffer){
    var i=0;
    for (i=0;i<this.state.users.length;i++){
      buffer.push(
        <Col xs={12} sm={12} md={11} lg={10}>
          <QuestionCard
                question={this.state.questions[i]}
                answer={this.state.answers[i]}
                avatar={this.state.users[i].normalpicUrl||this.state.users[i].googlepicUrl}
                name={this.state.users[i].firstName}
                date={this.state.dates[i]}
                questionId={this.state.QuestionIds[i]}
                component={this.componentDidMount}
                 key={new Date()}/>
                 <br />
        </Col>
      )
    }
    return buffer;
  }
  getQuestions(){
    fetch('http://'+properties.getHostName+':8080/user/questions/getAllQuestions', {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
            if(response.status === 200)
            return response.json()
            else if(response.status === 302){
              this.context.router.history.push('/')
            }
          }).then(response => {
            var newquestions = []
            var newanswers = []
            var newusers = []
            var newuseremails = []
            var newQuestionIds = []
            var newDates =[]
            for(let i=0;i<response.length;i++)
             {
               var date = new Date(response[i].dateTime)
              //  var dateString =
               newDates.push(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes())
               newquestions.push(response[i].question)
               newanswers.push(response[i].answer)
               newusers.push(response[i].op)
               newuseremails.push(response[i].op.email)
               newQuestionIds.push(response[i].questionPaperId)
            }
             this.setState({
               dates: newDates,
               users: newusers,
               questions: newquestions,
               answers: newanswers,
               QuestionIds : newQuestionIds,
               useremails: newuseremails
           })
          })
  }

  componentDidMount(){
    this.getQuestions()
  }
  handleSubmit(){
     this.setState({
       buttonDisabled: true
     })
     var trimmedQuestion = this.state.question.replace(/\s/g,'')
     var answersList = [];
     answersList.push(this.state.answer)
     if(trimmedQuestion===''){
      notify.show("Question catnnot be null","error");
     }else{
    fetch('http://'+properties.getHostName+':8080/user/questions/ask', {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body: JSON.stringify({
           question: this.state.question,
           answer: answersList
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
         }else if(response.status === 302){
           this.context.router.history.push('/')
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
        //  this.componentDidMount()
         notify.show("Question uploaded successfully","success")
         this.componentDidMount();
       })}
  }
  handleQuestionChange(e){
    this.setState({question:e.target.value});
  }
  handleAnswerChange(e){
    this.setState({answer:e.target.value});
  }
  Enter(){
  }
  render(){
    var buffer = []
    return(
      <div>
        <div>
          <NewQuestionDialogue
            questionChange={this.handleQuestionChange}
            answerChange={this.handleAnswerChange}
            handleSubmit={this.handleSubmit}/>
        </div>
        <br />
        <Divider />
        <div>
          <h1 className="announcements">Previous Questions</h1>
          <Grid fluid className="question">
            <Row around="xs">
                {this.list(buffer)}
            </Row>
          </Grid>
        </div>
      </div>
    );
   }
}

Hello.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Hello)
