import React, { Component } from 'react'
import UserLogo from './UserLogo';
import { auth, firestore } from '../firebase';
import {Icon} from 'antd'

class FindedUser extends Component {
  constructor(props) {
    super(props)
    this.addConnection = this.addConnection.bind(this)
    this.removeConnection = this.removeConnection.bind(this)
  }


  addConnection() {
    // add connection to finded user receivedConnections collection
    firestore.collection(`users/${this.props.user.id}/receivedConnections`).add({
      status: 0,
      user: firestore.doc(`users/${auth.currentUser.uid}`),
    }).then((con) => {
      // add connection to current user sendedConnections collection
      firestore.collection(`users/${auth.currentUser.uid}/sendedConnections`).add({
        status: 0,
        user: firestore.doc(`users/${this.props.user.id}`),
        reverseConnectionId:con.id
      }).then((rCon)=>{
        firestore.collection(`users/${this.props.user.id}/receivedConnections`).doc(`${con.id}`).update({reverseConnectionId:rCon.id})
      })
    })
  }


  removeConnection() {
    firestore.collection(`users/${this.props.user.id}/receivedConnections`).doc(`${this.props.sendCon[0].reverseConnectionId}`).delete();
    firestore.collection(`users/${auth.currentUser.uid}/sendedConnections`).doc(`${this.props.sendCon[0].id}`).delete();
  }
  render() {
    return (
      <div style={{ 
        margin: 5, 
        padding: 5, 
        border:'whitesmoke',
        borderStyle:'solid' ,
        borderRadius: 10, 
        backgroundColor: 'rgba(125, 122, 122, 0.47)', 
        borderWidth:'2px' , 
        width: '124px', 
        height: '200px' }}>
        <div style={{height:'165px'}}>
        <UserLogo key={this.props.user.id} userId={this.props.user.id} size={110}></UserLogo>
        </div>
        <div height='18' style={{padding:'0px'}}>
          {this.props.sendCon.length === 0 ?
            <Icon type="plus-circle" theme="twoTone" onClick={() => this.addConnection()} style={{fontSize:'20px'}}/>
            :
            <Icon type="close-circle" theme="twoTone"  twoToneColor="#eb2f96" onClick={() => this.removeConnection()}  style={{fontSize:'20px'}}/>
          }

        </div>
      </div>
    )
  }
}

export default FindedUser;