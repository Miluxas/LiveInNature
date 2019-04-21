import React, { Component } from 'react';
import '../style.css';
import { connect } from 'react-redux'
import { getVal, firestoreConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

class UserLogo extends Component {

    render() {
        if(this.props.user)
        {
            if(this.props.size<50)
            return (
                
                    <img src={this.props.user.imageUrl} alt={this.props.user.username} className="img-circle" style={{maxWidth:this.props.size,maxHeight:this.props.size}} />
                )
            return (
            <div>
                <img src={this.props.user.imageUrl} alt={this.props.user.username} className="img-circle" style={{width:this.props.size,height:this.props.size}}/>
                <h3>{this.props.user.username}</h3>
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