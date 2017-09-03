import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-flexbox-grid';


const styles = {
  radioButton: {
    marginTop: 16,
  },
};

/**
 * Dialog content can be scrollable.
 */
export default class NewQuestionDialogue extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  componentWillMount(){
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={()=>{this.props.handleSubmit();
        this.handleClose();}}
      />,
    ];

    const radios = [];
    for (let i = 0; i < 30; i++) {
      radios.push(
        <RadioButton
          key={i}
          value={`value${i + 1}`}
          label={`Option ${i + 1}`}
          style={styles.radioButton}
        />
      );
    }

    return (
      <div>
      <br />
        <Grid fluid className="question">
          <Row center="xs">
            <Col xs>
              <RaisedButton label="ASK QUESTION" onClick={this.handleOpen} />
            </Col>
          </Row>
        </Grid>
        <Dialog
          title="Ask a Question"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Grid fluid className="question">
          <Row >
            <Col xs={12} sm={12} md={10} lg={9}>
              <TextField
                 hintText="What is your question"
                 fullWidth={true}
                 floatingLabelText="QUESTION"
                 multiLine={true}
                 rows={3}
                 onChange={this.props.questionChange}
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
                  onChange={this.props.answerChange}
                />
              </Col>
            </Row>
          </Grid>
        </Dialog>
      </div>
    );
  }
}
