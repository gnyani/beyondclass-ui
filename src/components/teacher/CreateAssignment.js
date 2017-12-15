import React,{Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Add from 'material-ui/svg-icons/content/add'
import Divider from 'material-ui/Divider'
import ListAssignments from './ListAssignments'
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'


class CreateAssignment extends Component{
  render(){
    return(<div>
      <Grid fluid>
      <Row center='xs'>
      <Col xs>
      <br />
      <RaisedButton label="Theory Assignment" primary={true} icon={<Add />}  containerElement={<Link to={'/teacher/'+this.props.class+'/create'}/>}/>
      <br /> <br />
      </Col>
      <Col xs>
      <br />
      <RaisedButton label="Programming Assignment" primary={true} icon={<Add />}  containerElement={<Link to={'/teacher/'+this.props.class+'/createpa'}/>}/>
      <br /> <br />
      </Col>
      </Row>
      </Grid>
      <Divider />
      <br />
      <ListAssignments class={this.props.class} email={this.props.email}  branch={this.props.branch}/>
      </div>)
  }
}
CreateAssignment.contextTypes = {
    router: PropTypes.object
};


export default withRouter(CreateAssignment)
