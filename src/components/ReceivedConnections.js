import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
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
      <Col style={{ width: '100%' }}>
        <Row>
          {this.props.receivedConnectionList.map(connection => {
            return <Connection key={connection.id} connection={connection} isSended={false}></Connection> 
          })}
        </Row>
      </Col>
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