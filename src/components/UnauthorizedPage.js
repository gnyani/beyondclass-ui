import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {NavigationArrowBack} from '../styledcomponents/SvgIcons.js';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import '../styles/student-adda.css';

class UnauthorizedPage extends Component{
  render(){
    return(
      <div className="Unauthorized"><img src={require('../styledcomponents/images/error-img.png')} title="error" alt="loading"/>
    				<p>You Requested the page that is no longer There.</p>
            <br /> <br />
            <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading" icon={<NavigationArrowBack color="white"/>}
                       className="backHome" onClick={()=>{this.context.router.history.goBack()}} /></div>
    )
  }
}
UnauthorizedPage.contextTypes = {
    router: PropTypes.object
};

export default withRouter(UnauthorizedPage);
