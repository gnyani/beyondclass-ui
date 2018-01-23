import React,{Component} from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {Grid,Row,Col} from 'react-flexbox-grid'

class RenderCodingAssignmentResult extends Component{

  renderOuput = () => {
    var buffer = []
    if(this.props.assignmentStatus === 'SUCCESS')
    buffer.push(
          <div  className="positionSummary" key={1}>
          <fieldset>
          <legend >Summary</legend>
          <h4 className="summaryParagraph"> Time Spent : {this.props.timespent} </h4>
          <h4 className="summaryParagraph">All Test cases are passing</h4>
          </fieldset>
          </div>)
    else if(this.props.assignmentStatus === 'TESTS_FAILED')
    buffer.push(
      <div className="positionSummary" key={1}>
      <fieldset>
      <legend>Summary</legend>
      <h4 className="summaryParagraph"> Time Spent : {this.props.timespent} </h4>
      <h4 className="summaryParagraph">Some of the test cases are failing</h4>
      <h5 className="summaryParagraph">Expected :</h5><TextareaAutosize key={2} className="OutputTextInput" disabled={true} value={this.props.expected} />
      <h5 className="summaryParagraph">Actual :</h5> <TextareaAutosize key={3} className="OutputTextInput" disabled={true} value={this.props.actual} />
      <h5 className="summaryParagraph"> TotalPassedTests : {this.props.passCount} </h5>
      <h5 className="summaryParagraph"> TotalTestCases: {this.props.totalCount} </h5>
      <h5 className="summaryParagraph"> FailedCase: {this.props.failedCase}</h5>
      </fieldset>
      </div>)
    else if(this.props.assignmentStatus === 'COMPILER_ERROR')
    buffer.push(
      <div className="positionSummary" key={1}>
      <fieldset>
      <legend>Summary</legend>
      <h4 className="summaryParagraph"> Time Spent : {this.props.timespent} </h4>
      <h4 className="summaryParagraph">Compilation Failed</h4>
      <h5 className="summaryParagraph">Error :</h5><TextareaAutosize key={2} className="OutputTextInput" disabled={true} value={this.props.errorMessage} />
      </fieldset>
      </div>
    )
    else if(this.props.assignmentStatus === 'RUNTIME_ERROR')
    buffer.push(
      <div className="positionSummary" key={1}>
      <fieldset>
      <legend>Summary</legend>
      <h4 className="summaryParagraph"> Time Spent : {this.props.timespent} </h4>
      <h4 className="summaryParagraph">RunTime Exception</h4>
      <h5 className="summaryParagraph">Error :</h5><TextareaAutosize key={2} className="OutputTextInput" disabled={true} value={this.props.errorMessage} />
      </fieldset>
      </div>
    )
      return buffer
  }


  render(){
    return(
      <div className="renderCodingAssignment">
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      {this.renderOuput()}
      </Col>
      </Row>
      </Grid>
      </div>
    )
  }
}

export default RenderCodingAssignmentResult
