import React, { Component } from 'react'
import { Row } from 'antd'
import Connection from './Connection'
import { auth } from '../firebase'
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'


class SendedConnections extends Component {
  render() {
    if (!isLoaded(this.props.sendedConnectionList)) {
      return <div>Loading...</div>
    }
    if (isEmpty(this.props.sendedConnectionList)) {
      return <div>connections List Is Empty</div>
    }

    return (

      <Row type="flex" justify="start">
        {this.props.sendedConnectionList.map(connection => {
          return <Connection key={connection.id} connection={connection} isSended={true}></Connection> //<div key={connection.id} >{connection.user.id}</div>
        })}
      </Row>
    )
  }
}

export default compose(
  firestoreConnect(() => [
    {
      collection: `users/${auth.currentUser.uid}/sendedConnections`,
      //doc: auth.currentUser.id,
      storeAs: 'sendedConnectionList', // not nessesary, but can prevent needing id in connect
      //where: ['user.uid', '==', auth.currentUser.id],
    },
  ]),
  connect((state, props) => ({
    sendedConnectionList: state.firestore.ordered.sendedConnectionList
  }))
)(SendedConnections)