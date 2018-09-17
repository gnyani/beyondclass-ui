import React,{Component} from 'react'
import Divider from 'material-ui/Divider'
import ListAssignments from './ListAssignments'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'


class CreateAssignment extends Component{
  render(){
    return(<div>
      {/* <Grid fluid>
      <Row center='xs'>
      <Col xs>
      <br />
      <FlatButton label="Theory Assignment" style={{verticalAlign: 'middle',border: "0.08em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
         icon={<Add />}  containerElement={<Link to={'/teacher/'+this.props.class+'/create'}/>}/>
      <br /> <br />
      </Col>
      <Col xs>
      <br />
      <FlatButton label="Objective Assignment"  style={{verticalAlign: 'middle',border: "0.08em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
      icon={<Add />}  containerElement={<Link to={'/teacher/'+this.props.class+'/createobjectiveassignment'}/>}/>
      <br /> <br />
      </Col>
      <Col xs>
      <br />
      <FlatButton label="Programming Assignment" icon={<Add />} style={{verticalAlign: 'middle',border: "0.08em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
       containerElement={<Link to={'/teacher/'+this.props.class+'/createpa'}/>}/>
      <br /> <br />
      </Col>
      </Row>
      </Grid> */}
      <Divider />
      <br />
      <ListAssignments batches={this.props.batches} class={this.props.class} email={this.props.email}  branch={this.props.branch}/>
      </div>)
  }
}
CreateAssignment.contextTypes = {
    router: PropTypes.object
};


export default withRouter(CreateAssignment)
