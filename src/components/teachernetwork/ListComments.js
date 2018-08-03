import React, {Component} from 'react'

class ListComments extends Component{

  displayComments = () => {
    var buffer = []
    for(var i=0; i< this.props.comments.length; i++){
      buffer.push(
        <p key={i}>{this.props.comments[i].username}: {this.props.comments[i].commentContent}</p>
      )
    }
    return buffer;
  }

  render(){
    return(
       <div>{this.displayComments()}</div>
    )
  }
}
export default ListComments
