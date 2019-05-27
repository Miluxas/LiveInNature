import React, { Component } from 'react'
import { Icon } from 'antd'
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
    firestore.collection(`users/${this.props.connection.userUid}/receivedConnections`).doc(`${this.props.connection.reverseConnectionId}`).delete();
    firestore.collection(`users/${auth.currentUser.uid}/sendedConnections`).doc(`${this.props.connection.id}`).delete();
  }


  removeReceivedConnection() {
    firestore.collection(`users/${this.props.connection.userUid}/sendedConnections`).doc(`${this.props.connection.reverseConnectionId}`).delete();
    firestore.collection(`users/${auth.currentUser.uid}/receivedConnections`).doc(`${this.props.connection.id}`).delete();
  }

  acceptConnection() {
    firestore.collection(`users/${this.props.connection.userUid}/sendedConnections`).doc(`${this.props.connection.reverseConnectionId}`).update({ status: 1 });
    firestore.collection(`users/${auth.currentUser.uid}/receivedConnections`).doc(`${this.props.connection.id}`).update({ status: 1 });
  }

  render() {
    return (
      <div style={{
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
        <div style={{ height: '165px' }}>
          <UserLogo key={this.props.connection.id} userId={this.props.connection.userUid} size={110}></UserLogo>
        </div>
        {(this.props.isSended) ?
          <div height='18' style={{ padding: '0px' }}>
            <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" onClick={() => this.removeSendedConnection()} style={{ fontSize: '20px' }} />
            {(this.props.connection.status === 1) ?
              <Icon type="check-circle" style={{ fontSize: '20px' }} /> :
              <Icon type="clock-circle" style={{ fontSize: '20px' }} />
            }
          </div>
          :
          <div height='18' style={{ padding: '0px' }}>
            <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" onClick={() => this.removeReceivedConnection()} style={{ fontSize: '20px' }} />
            {(this.props.connection.status === 1) ?
              <Icon type="check-circle" style={{ fontSize: '20px' }} /> :
              <Icon type="check-circle" theme="twoTone" onClick={() => this.acceptConnection()} style={{ fontSize: '20px' }} />
            }
          </div>
        }
      </div>
    )
  }
}

export default Connection;