import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getVal, firestoreConnect } from 'react-redux-firebase'
import { compose } from 'recompose'
import { Avatar,Row} from 'antd';

class UserLogo extends Component {

    render() {
        if(this.props.user)
        {
            if(this.props.size<50)
            return (
                <Avatar src={this.props.user.imageUrl} size={this.props.size} />
                )
            return (
            <div style={{textAlign:'center'}}>
                <Row>
                    <Avatar src={this.props.user.imageUrl}  size={this.props.size} />
                </Row>   
                <Row>
                    <label style={{textAlign:'center', overFlowWrap: 'break-word',  wordWrap: 'break-word'}}>{this.props.user.username}</label>
                </Row>
            </div>
        )}
        return <div></div>
    }
}

export default compose(
    firestoreConnect(
        (props) => {
        return [{collection:'users',doc:`${props.userId}`}]
    }),
    connect(({ firestore }, props) => ({
        user: getVal(firestore, `data/users/${props.userId}`), // lodash's get can also be used
    })),
    /*withHandlers({
      updateTodo: props => () => {
          console.log(props)
        return firebase.update(`post/${props.todoId}`, { done: !props.todo.isDone })
      }
    })*/
)(UserLogo)