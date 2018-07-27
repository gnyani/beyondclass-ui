import React,{Component} from 'react'

class ListDataComponent extends Component{

  renderProps = () => {
    var buffer = []
    for(var i=0; i< this.props.attribute.length; i++){
      buffer.push(
        <tr key={i}>
          <td><b>{this.props.attribute[i]}</b></td>
          <td>{this.props.value[i]}</td>
        </tr>
      )
    }
    return buffer
  }
  render(){
    return(
      <table>
      <tbody>
        {this.renderProps()}
        </tbody>
      </table>
    )
  }
}

export default ListDataComponent
