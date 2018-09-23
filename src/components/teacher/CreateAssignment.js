import React,{Component} from 'react'
import ListAssignments from './ListAssignments'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {Grid,Row,Col} from 'react-flexbox-grid'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import {Link} from 'react-router-dom'
import MenuItem from 'material-ui/MenuItem'
import Add from 'material-ui/svg-icons/content/add'


class CreateAssignment extends Component{
  render(){
    return(<div>
      <br />
      <ListAssignments batches={this.props.batches} class={this.props.class} email={this.props.email}  branch={this.props.branch}/>
        <Grid flex>
          <Row around='xs'>
            <Col xs={12} sm={12} md={12} lg={12} className="fab-btn">
            <IconMenu iconButtonElement={
                    <IconButton
                      touch={true}
                      tooltip="New Assignment"
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
      </div>)
  }
}
CreateAssignment.contextTypes = {
    router: PropTypes.object
};


export default withRouter(CreateAssignment)
