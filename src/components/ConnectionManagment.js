import React, { Component } from 'react'
import SendedConnections from './SendedConnections';
import ReceivedConnections from './ReceivedConnections';
import SearchUser from './SearchUser';
import { Tabs } from 'antd';


class ConnectionManagment extends Component {

  render() {
    return (
        <Tabs defaultActiveKey="1" size='small'>
            <Tabs.TabPane tab="Sended Connections" key="1"><SendedConnections/></Tabs.TabPane>
            <Tabs.TabPane tab="Received Connections" key="2"><ReceivedConnections/></Tabs.TabPane>
            <Tabs.TabPane tab="Search Users" key="3"><SearchUser/></Tabs.TabPane>
        </Tabs>
    )}
}

export default ConnectionManagment