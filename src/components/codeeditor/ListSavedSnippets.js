import React,{Component} from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import View from 'material-ui/svg-icons/action/view-list'
import FlatButton from 'material-ui/FlatButton'
import AceEditor from 'react-ace'
import Dialog from 'material-ui/Dialog'
import Delete from 'material-ui/svg-icons/action/delete'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

var properties = require('../properties.json');

class ListSavedSnippets extends Component{

constructor(){
  super()
  this.state={
    response: '',
    isDataLoaded: false,
    expanded: [],
    confirmDelete: false,
    deleteid: '',
    responseStatus : ''
  }
}

handleExpand = (index) =>{
  var newExpanded = this.state.expanded.slice()
  newExpanded[index] = !this.state.expanded[index]
  this.setState({
    expanded: newExpanded,
  })
}

handleConfirmDelete = (snippetid) => {
this.setState({
  confirmDelete: true,
  deleteid: snippetid,
 })
}

getList = () => {
  fetch('http://'+properties.getHostName+':8080/assignments/codeeditor/savedlist', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body:this.props.loggedinuser,
     }).then(response => {
       this.setState({
         responseStatus: response.status,
       })
       if(response.status === 200)
       return response.json()
       else if(response.status === 500){
         notify.show("Sorry something went wrong","error")
       }
     }).then(response => {
       this.setState({
         response: response,
         isDataLoaded: true,
       })
     })
}

componentDidMount(){
this.getList()
}

renderChips = (tags) => {
  var buffer = []
  for(var i=0; i<tags.length;i++){
    buffer.push(
      <div style={styles.wrapper} key={i}>
      <Chip
        style={styles.chip}
      >
      {tags[i]}
      </Chip>
      </div>
    )
  }
  return buffer
}
deleteCodeSnippet = () => {
  fetch('http://'+properties.getHostName+':8080/assignments/codeeditor/snippet/delete', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: this.state.deleteid
    }).then(response => {
      if(response.status === 200){
        notify.show("Deleted successfully","success")
        this.getList()
      }
      else if(response.status === 500)
      notify.show("Sorry cannot delete this snippet try again later","error")
    }).catch(response => {
      notify.show("Please login before deleting the snippet","error")
      this.context.router.history.push('/');
    })
    this.handleClose()
}

renderSnippets = () => {
  var buffer = []
  var response = this.state.response
  if( response && response.length > 0){
  for(var i=0;i<response.length;i++)
  {
  var date = new Date(response[i].date)
    buffer.push(
      <div key={i}>
       <Card
         onExpandChange={this.handleConfirmDelete.bind(this,response[i].snippetid)}
         expanded={this.state.expanded[i]}>
           <CardHeader
             title={'Language '+response[i].language}
             subtitle={'Saved on '+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
             titleStyle={{fontStyle: "bold", fontSize: "2.5vmin", fontWeight: "5",textTransform: 'capitalize'}}
             showExpandableButton={true}
             openIcon={<Delete color="red"/>}
             closeIcon={<Delete color="red"/>}
           />
           <CardText>
           <Grid fluid>
            <Row center="xs">
           <p><b> Comments: </b>{response[i].description}</p>
            </Row>
           <Row center="xs">
                <p><b>Tags</b></p>
           </Row>
           <Row center="xs">
            {this.renderChips(response[i].tags)}
          </Row>
          </Grid>
           </CardText>
           <CardActions>
           <Grid fluid>
           <Row center="xs">
           <Col xs>
            <RaisedButton label="View Code" primary={true} icon={<View />} onClick={this.handleExpand.bind(this,i)}/>
            </Col>
            </Row>
            </Grid>
            </CardActions>
            <CardText expandable={true}>
                <AceEditor
                mode={response[i].language}
                theme='textmate'
                name="My_editor"
                style={{width:'90%',marginLeft: '5%'}}
                value={response[i].source}
                readOnly={true}
                highlightActiveLine={false}
                  />
            </CardText>
         </Card>
        <br />
      </div> )
      }
  }else if(typeof response === 'undefined' && this.state.isDataLoaded === true){
    buffer.push(<p className="paragraph">You dont have anything saved yet </p>)
  }else{
    buffer.push(<Grid fluid className="RefreshIndicator" key={1}>
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
  return buffer
}
handleClose = () => {
  this.setState({
    confirmDelete: false,
  })
}
  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.deleteCodeSnippet}
      />]
    return(
      <div className="SavedSnippets">
      <br />
      <Grid fluid>
      <Row center="xs">
      <Col xs={11} sm={11} md={8} lg={8}>
      {this.renderSnippets()}
      </Col>
      </Row>
      </Grid>
      <br />
      <Dialog
            title="Are you sure you want to delete this snippet"
            modal={false}
            actions={actions}
            open={this.state.confirmDelete}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      </div>
    )
  }
}
ListSavedSnippets.contextTypes = {
    router: PropTypes.object
};


export default withRouter(ListSavedSnippets)
