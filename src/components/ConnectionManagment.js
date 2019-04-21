import React, { Component } from 'react'
import {Col,Tabs,Tab} from 'react-bootstrap'
import SendedConnections from './SendedConnections';
import ReceivedConnections from './ReceivedConnections';
import SearchUser from './SearchUser';


class ConnectionManagment extends Component {

  render() {
    return (
        <Col>
        <Tabs>
            <Tab eventKey="sendedConnections" title="Sended Connections">
                <SendedConnections></SendedConnections>
            </Tab>
            <Tab eventKey="receivedConnections" title="Received Connections">
                <ReceivedConnections></ReceivedConnections>
            </Tab>
            <Tab eventKey="searchUser" title="Search Users">
               <SearchUser></SearchUser>
            </Tab>
        </Tabs>
        </Col>
    )}
}

export default ConnectionManagment