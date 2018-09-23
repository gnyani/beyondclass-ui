import React,{Component} from 'react'
import {Card, CardHeader, CardActions} from 'material-ui/Card'
import {Grid,Row,Col} from 'react-flexbox-grid'
import CircularProgressbar from 'react-circular-progressbar'

class ReportStats extends Component{
  render(){
    return(
      <div>
      <Grid fluid >
      <Row around="xs">
      <Col xs={11} sm={11} md={12} lg={12} >
      <Card>
      <CardHeader
          title="ASSIGNMENT INSIGHTS"
          actAsExpander={true}
          showExpandableButton={true}
          titleStyle = {{fontFamily: "'Roboto', sans-serif",fontSize: "2vmin",fontStyle: "bold",
                                      fontWeight: "200",letterSpacing: "0.04vmin",color: "black"}}
          style={{backgroundColor: "#d6d6d6",textAlign: "center"}}
        />
      <CardActions expandable={true}>
      <Grid fluid>
      <Row around="xs">
      <Col xs={10} sm={10} md={7} lg={5}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.props.percentdaysCompleted} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Days Left</span><br />
       <span className="stat">{this.props.numberOfDaysLeft}/{this.props.totalNumberOfDays} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      <Col xs={10} sm={10} md={7} lg={5}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.props.percentStudentsSubmitted} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Submissions</span><br />
       <span className="stat">{this.props.numberOfStudentsSubmitted}/{this.props.totalEligibleNumberOfStudents} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      <Col xs={10} sm={10} md={7} lg={5}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.props.percentOfEvaluationsDone} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Evaluations Done</span><br />
       <span className="stat">{this.props.evaluationsDone}/{this.props.numberOfStudentsSubmitted} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      <Col xs={10} sm={10} md={7} lg={5}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.props.percentOfStudentsWorked} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Students Started Working</span><br />
       <span className="stat">{this.props.studentsWorked}/{this.props.totalEligibleNumberOfStudents} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      </Row>
      </Grid>
      <br />
      </CardActions>
      </Card>
      </Col>
      </Row>
      </Grid>
      </div>
    )
  }
}

export default ReportStats
