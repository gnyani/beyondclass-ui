import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import { Grid, Row, Cell } from 'react-inline-grid';
import '../../styles/student-adda.css';

class userQuestion extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: 0, previous: 0 };
  }

  render(){
    return(
      <div className="userQuestion">
        <div className="question">
          <h1>hello world</h1>
        </div>
        <div className="answer">
          <h1>this is manoj</h1>
        </div>
      </div>
    );
   }
}
export default userQuestion
