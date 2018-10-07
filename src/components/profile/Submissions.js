import React,{Component} from 'react'
import Divider from 'material-ui/Divider'
import styled from 'styled-components'
import {Media} from '../utils/Media'
import {Card,CardTitle,CardHeader,CardText} from 'material-ui/Card'
import {Grid,Row,Col} from 'react-flexbox-grid'
import ListSubmissions from './ListSubmissions'
import {notify} from 'react-notify-toast'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RefreshIndicator from 'material-ui/RefreshIndicator'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class Submissions extends Component{

constructor(){
  super();
  this.state={
    totalPoints: 0,
    totalCount: 0,
    pendingCount: 0,
    approved: 0,
    rejected: 0,
    submitAssignmentList: [],
    assignmentsList: [],
    isDataLoaded: false,
  }
}

componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/student/submission/stats', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: this.props.loggedinuser
     }).then(response => {
       if(response.status===200)
       return response.json()
       else {
         notify.show("Something went wrong","error")
       }
     }).then(response => {
       if(response)
       this.setState({
         totalCount: response.totalSubmissionsCount,
         pendingCount: response.pendingApprovalCount,
         approved: response.acceptedCount,
         rejected: response.rejectedCount,
         totalPoints: response.totalPoints,
         submitAssignmentList: response.submitAssignmentList,
         assignmentsList: response.assignmentsList,
         isDataLoaded: true,
       })
     }).catch(response => {
     notify.show("Please login before viewing your submissions","error");
     this.context.router.history.push('/');
    });
}

  render(){
    if(this.state.isDataLoaded)
    return(
      <StayVisible
      {... this.props}
      >
      <div>
      <br />
      <Grid fluid>
      <Row around = 'xs' center="xs" top="xs" className="Reports">
      <Col xs={8} sm={8} md={7} lg={7}>
      <p className="paragraph">Submissions Summary</p>
      </Col>
      </Row>
      <Row around = 'xs' center="xs" top="xs">
      <Col xs={8} sm={8} md={7} lg={7}>
      <Card >
      <CardText className="table">
      <table>
      <tbody>
          <tr style={{color: '#30b55b'}}>
            <th>Status</th>
            <th>Count</th>
          </tr>
          <tr>
            <td>PENDING_APPROVAL</td>
            <td>{this.state.pendingCount}</td>
          </tr>
          <tr>
            <td>APPROVED</td>
            <td>{this.state.approved}</td>
          </tr>
          <tr>
            <td>REJECTED</td>
            <td>{this.state.rejected}</td>
          </tr>
          <tr>
            <td>TOTAL ASSIGNMENTS SUBMITTED</td>
            <td>{this.state.totalCount}</td>
          </tr>
          <tr>
            <td>TOTAL POINTS</td>
            <td>{this.state.totalPoints}</td>
          </tr>
        </tbody>
          </table>
      </CardText>
      </Card>
      <br /><br />
      </Col>
      {/* <Col xs={8} sm={8} md={4} lg={3}>
      <Card >
      <CardHeader
      title="Total Assignments Submitted" style={{backgroundColor: 'lightgrey',fontWeight: 'bold'}}
      />
      <CardTitle title={this.state.totalCount} style={{textAlign:'center'}} />
      </Card>
      <br />
      </Col>
      <Col xs={8} sm={8} md={4} lg={3}>
      <Card >
      <CardHeader
      title="Total Points" style={{backgroundColor: 'lightgrey', fontWeight: 'bold'}}
      />
      <CardTitle title={this.state.totalPoints} style={{textAlign:'center'}} />
      </Card>
      <br /><br />
      </Col> */}
      </Row>
      </Grid>
      <Divider />
      <ListSubmissions submitAssignmentList={this.state.submitAssignmentList} assignmentsList={this.state.assignmentsList}/>
      </div>
      </StayVisible>
    )
else {
  return(<Grid fluid className="RefreshIndicator">
  <Row center="xs">
  <Col xs>
    <RefreshIndicator
       size={50}
       left={45}
       top={0}
       loadingColor="#FF9800"
       status="loading"
       className="refresh"
      />
  </Col>
  </Row>
  </Grid>)
}
  }
}
Submissions.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Submissions)
