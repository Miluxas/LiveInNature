import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import '../style.css'
import UserLogo from './UserLogo';
import { auth, firestore } from '../firebase';

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
      <Container style={{ 
        margin: 5, 
        padding: 5, 
        border:'whitesmoke',
        borderStyle:'solid' ,
        borderRadius: 10, 
        backgroundColor: 'rgba(125, 122, 122, 0.47)', 
        borderWidth:'2px' , 
        width: '124px', 
        height: '200px' }}>
        <UserLogo key={this.props.user.id} userId={this.props.user.id}></UserLogo>
        <Container height='18' style={{ marginTop: '24px',padding:'0px'}}>
          {this.props.sendCon.length === 0 ?
            <i className="fas fa-user-plus" style={{ fontSize: "15px", color: 'blue' }} onClick={() => this.addConnection()}></i>
            :
            <i className="fas fa-user-times" style={{ fontSize: "15px", color: 'red' }} onClick={() => this.removeConnection()}></i>
          }

        </Container>
      </Container>
    )
  }
}

export default FindedUser;