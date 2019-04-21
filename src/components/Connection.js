import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import '../style.css'
import UserLogo from './UserLogo';
import { auth, firestore } from '../firebase';

class Connection extends Component {
  constructor(props) {
    super(props)
    this.removeSendedConnection = this.removeSendedConnection.bind(this)
    this.removeReceivedConnection = this.removeReceivedConnection.bind(this)
    this.acceptConnection = this.acceptConnection.bind(this)
  }

  removeSendedConnection() {
    firestore.collection(`users/${this.props.connection.user.id}/receivedConnections`).doc(`${this.props.connection.reverseConnectionId}`).delete();
    firestore.collection(`users/${auth.currentUser.uid}/sendedConnections`).doc(`${this.props.connection.id}`).delete();
  }


  removeReceivedConnection() {
    firestore.collection(`users/${this.props.connection.user.id}/sendedConnections`).doc(`${this.props.connection.reverseConnectionId}`).delete();
    firestore.collection(`users/${auth.currentUser.uid}/receivedConnections`).doc(`${this.props.connection.id}`).delete();
  }

  acceptConnection() {
    firestore.collection(`users/${this.props.connection.user.id}/sendedConnections`).doc(`${this.props.connection.reverseConnectionId}`).update({status:1});
    firestore.collection(`users/${auth.currentUser.uid}/receivedConnections`).doc(`${this.props.connection.id}`).update({status:1});
  }

  render() {
    return (
      <Container style={{
        margin: 5,
        padding: 5,
        border: 'whitesmoke',
        borderStyle: 'solid',
        borderRadius: 10,
        backgroundColor: 'rgba(125, 122, 122, 0.47)',
        borderWidth: '2px',
        width: '124px',
        height: '200px'
      }}>
        <UserLogo key={this.props.connection.id} userId={this.props.connection.user.id}></UserLogo>
        {(this.props.isSended) ?
          <Container height='18' style={{ marginTop: '24px',padding:'0px'}}>
            <i className="fas fa-user-times" style={{ fontSize: "15px", color: 'red' }} onClick={() => this.removeSendedConnection()}></i>
            {(this.props.connection.status === 1) ?
              <label>Accepted</label> : <label>Pending</label>
            }
          </Container>
          :
          <Container height='18' style={{ marginTop: '24px',padding:'0px' }}>
            <i className="fas fa-user-times" style={{ fontSize: "15px", color: 'red' }} onClick={() => this.removeReceivedConnection()}></i>
            {(this.props.connection.status === 1) ?
              <label>Accepted</label> : <i className="fas fa-user-check" style={{ fontSize: "15px", color: 'orange' }} onClick={()=>this.acceptConnection()}></i>
            }
          </Container>
        }
      </Container>
    )
  }
}

export default Connection;