import React from 'react';
import { Grid, Row, Cell } from 'react-inline-grid';
import '../../styles/student-adda.css';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {notify} from 'react-notify-toast';
import QuestionCard from './questionCard'
import NewQuestionDialogue from './newQuestionDialogue'
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
        <Cell is="8 tablet-4 phone-4">
          <QuestionCard
                question={this.state.questions[i]}
                answer={this.state.answers[i]}
                avatar={this.state.users[i].normalpicUrl||this.state.users[i].googlepicUrl}
                name={this.state.users[i].firstName}
                date={this.state.dates[i]}
                questionId={this.state.QuestionIds[i]}
                component={this.componentWillMount}
                 key={new Date()}/>
        </Cell>
      )
    }
    return buffer;
  }
  getQuestions(){
    fetch('http://'+properties.getHostName+':8080/user/questions/getAllQuestions', {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
            return response.json()
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

  componentWillMount(){
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
        //  this.componentWillMount()
         notify.show("Question uploaded successfully","success")
         this.componentWillMount();
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
        <Divider />
        <div>
          <h1 className="announcements">Previous Questions</h1>
          <Grid className="question">
            <Row is="center">
                {this.list(buffer)}
            </Row>
          </Grid>
        </div>
      </div>
    );
   }
}
export default Hello
