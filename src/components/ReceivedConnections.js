import React, { Component } from 'react'
import { Row } from 'antd'
import Connection from './Connection';
import { auth } from '../firebase';
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'


class ReceivedConnections extends Component {
  render() {
    if (!isLoaded(this.props.receivedConnectionList)) {
      return <div>Loading...</div>
    }
    if (isEmpty(this.props.receivedConnectionList)) {
      return <div>connections List Is Empty</div>
    }

    return (
      <Row type="flex" justify="start">
          {this.props.receivedConnectionList.map(connection => {
            return <Connection key={connection.id} connection={connection} isSended={false}></Connection> 
          })}
      </Row>

    )
  }
}

export default compose(
  firestoreConnect(() => [
    {
      collection: `users/${auth.currentUser.uid}/receivedConnections`,
      storeAs: 'receivedConnectionList',
    },
  ]),
  connect((state, props) => ({
    receivedConnectionList: state.firestore.ordered.receivedConnectionList
  }))
)(ReceivedConnections)