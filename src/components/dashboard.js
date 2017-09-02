import React,{Component} from 'react'
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import '../styles/student-adda.css'
import {Media} from './utils/Media'
var properties = require('./properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`
class Dashboard extends Component{
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      drawerwidth: props.width
    };
    this.getUser = this.getUser.bind(this);
  }

componentWillMount(){
  this.getUser()
}

getUser(){
  fetch('http://'+properties.getHostName+':8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          return response.json()
        }).then(response => {
          this.setState({
              username: response.firstName
          })
        })
}
render(){
    return(
    <StayVisible
    {...this.props}
    >
      <div >
        <h2 className="headings">Welcome User {this.state.username} </h2>
      </div>
    </StayVisible>
    )
  }
}
Dashboard.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Dashboard)
