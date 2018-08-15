import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import {Grid, Row, Col} from 'react-flexbox-grid'

class ListComments extends Component{

  displayComments = () => {
    var buffer = []
    for(var i=0; i< this.props.comments.length; i++){
        var date = new Date(this.props.comments[i].date)
      buffer.push(<Grid fluid key={i}>
                 <Row around="xs">
                  <Col xs>
                  <ListItem
                    className="listComments"
                    disabled={true}
                    primaryText={this.props.comments[i].username}
                    secondaryText={<p style={{fontWeight: 'lighter'}}>
                      <span style={{color: "black"}}>{this.props.comments[i].commentContent}</span><br />
                      Posted On {date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()}
                    </p>}
                    secondaryTextLines={2}
                    >
                  </ListItem>
                  </Col>
                 </Row>
                </Grid>
      )
    }
    return buffer;
  }

  render(){
    return(
       <div className="TeacherNetwork">
        <List>
         {this.displayComments()}
       </List>
       </div>
    )
  }
}
export default ListComments
