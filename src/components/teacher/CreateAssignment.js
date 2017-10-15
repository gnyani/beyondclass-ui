import React,{Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Add from 'material-ui/svg-icons/content/add'
import Divider from 'material-ui/Divider'

class CreateAssignment extends Component{
  render(){
    return(<div>
      <RaisedButton label="New Assignment" icon={<Add />} />
      <br />
      <Divider />
      </div>)
  }
}
