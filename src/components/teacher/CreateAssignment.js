import React,{Component} from 'react'
import FlatButton from 'material-ui/FlatButton'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Add from 'material-ui/svg-icons/content/add'
import Divider from 'material-ui/Divider'
import ListAssignments from './ListAssignments'
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import { white, transparent } from 'material-ui/styles/colors'


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
      <Grid flex>
      <Row around='xs'>
        <Col xs={12} sm={12} md={12} lg={12} className="fab-btn">
        <IconMenu iconButtonElement={
                <IconButton
                  touch={true}
                  tooltip="Create Assignments"
                  tooltipPosition="top-left"
                  className="fab-icon-btn"
                >
                  <Add className="whitecol"/>
                </IconButton>
               }>
          <Link style={{textDecoration: 'none'}} to={'/teacher/'+this.props.class+'/create'} >
            <MenuItem >
            Theory Assignment
            </MenuItem>
          </Link>
          <Link style={{textDecoration: 'none'}} to={'/teacher/'+this.props.class+'/createobjectiveassignment'} >
            <MenuItem >
            Objective Assignment
            </MenuItem>
          </Link>
          <Link style={{textDecoration: 'none'}} to={'/teacher/'+this.props.class+'/createpa'} >
            <MenuItem >
            Programming Assignment
            </MenuItem>
          </Link>
        </IconMenu>
        </Col>
      </Row>
    </Grid>
      <ListAssignments batches={this.props.batches} class={this.props.class} email={this.props.email}  branch={this.props.branch}/>
      </div>)
  }
}
CreateAssignment.contextTypes = {
    router: PropTypes.object
};


export default withRouter(CreateAssignment)
