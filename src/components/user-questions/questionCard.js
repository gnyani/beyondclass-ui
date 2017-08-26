import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import { Grid, Row, Cell } from 'react-inline-grid';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class QuestionCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      answer: props.answer,
      question: props.question,
      avatar: props.avatar,
      firstName:props.name,
      open: false
    };
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

  handleReduce = () => {
    this.setState({expanded: false,
      open:true
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleSubmit}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={()=>{this.handleSubmit();
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
        <CardText expandable={true}>
        <p>{this.state.answer}</p>
        </CardText>
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
          <Grid className="question">
            <Row is="center">
              <Cell is="8 tablet-4 phone-4">
                <TextField
                   hintText="What is your question"
                   fullWidth={true}
                   floatingLabelText="QUESTION"
                   multiLine={true}
                   rows={3}
                   onChange={this.props.questionChange}
                 />
               </Cell>
             </Row>
           </Grid>
           <Grid className="question">
             <Row is="center">
               <Cell is="8 tablet-4 phone-4">
                 <TextField
                    hintText="Answer the Question"
                    fullWidth={true}
                    floatingLabelText="ANSWER"
                    multiLine={true}
                    rows={3}
                    onChange={this.props.answerChange}
                  />
                </Cell>
              </Row>
            </Grid>
          </Dialog>
        </CardActions>
      </Card>
    );
  }
}
