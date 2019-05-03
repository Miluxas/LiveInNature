import React, { Component } from 'react';
import { connect } from "react-redux";
import { auth } from '../firebase';
import AddNewPost from './AddNewPost'
import { getVal, firestoreConnect } from 'react-redux-firebase'
import { compose } from 'recompose'
import UserProfileUpdate from './UserProfileUpdate';
import { Layout, Menu, Icon, Avatar, Modal, Button } from 'antd';
import PostContainer from './PostContainer';
import MyWall from './MyWall';
import ConnectionManagment from './ConnectionManagment';
const { Sider } = Layout;

class UserSideBar extends Component {
  constructor(props) {

    super(props)
    this.state = {
      user: null,
      userProfileModalShow: false,
      menuDefaultSelectedKey: "2"
    }
    this.closeUserProfileModal = this.closeUserProfileModal.bind(this)
    this.mAddNewPost = this.mAddNewPost.bind(this)
    this.mShowLocationSellector = this.mShowLocationSellector.bind(this)
  }
  componentWillReceiveProps(props) {
    this.setState({ user: props.user })
  }

  closeUserProfileModal() {
    this.setState({ userProfileModalShow: false, menuDefaultSelectedKey: "2" })
  }
  mAddNewPost() {
    this.refs.addNewPost.addPost()
    this.setState({ menuDefaultSelectedKey: "2" })
  }
  mShowLocationSellector() {
    this.refs.addNewPost.showLocationSelector()
  }
  buttonStyle = { padding: '3px' }

  render() {
    if (this.state.user == null)
      return <div></div>
    //console.log(auth.currentUser)
    return (
      <Sider  
        //trigger={null}
        //collapsible
        //collapsed={this.state.collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => { console.log(broken); }}
        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        style={{ zIndex: 1200 }}
      >
        <Modal
          title="Add New Post"
          width={'60%'}
          centered
          visible={this.state.userProfileModalShow}
          onOk={() => this.closeUserProfileModal(false)}
          onCancel={() => this.closeUserProfileModal(false)}
          footer={[
            <Button key="addlocation" onClick={this.mShowLocationSellector}>Add Location</Button>,
            <Button key="add" type="primary" onClick={this.mAddNewPost}>Add</Button>,
          ]}
        >
          <AddNewPost ref="addNewPost" closeModal={this.closeUserProfileModal}></AddNewPost>
        </Modal>
        <div className="logo" />
        <Menu mode="inline" selectedKeys={[this.state.menuDefaultSelectedKey]} defaultSelectedKeys={["2"]} style={{ height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <img src='liveInNature.png' alt='Live In Nature Logo' width='140px'></img>
            <Avatar size={70} src={this.state.user.imageUrl} />
          </div>
          <Menu.Item key="1" onClick={() => {
            this.setState({ menuDefaultSelectedKey: "1" })
            this.setState({ userProfileModalShow: true })
          }}>
            <Icon type="form" />
            <span className="nav-text">Add New Post</span>
          </Menu.Item>

          <Menu.Item key="2" onClick={() => {
            this.setState({ menuDefaultSelectedKey: "2" })
            this.props.setPage(<PostContainer />)
          }}>
            <Icon type="home" />
            <span className="nav-text">Main Wall</span>
          </Menu.Item>

          <Menu.Item key="3" onClick={() => {
            this.setState({ menuDefaultSelectedKey: "3" })
            this.props.setPage(<MyWall />)
          }}>
            <Icon type="bars" />
            <span className="nav-text">My Wall</span>
          </Menu.Item>

          <Menu.Item key="4" onClick={() => {
            this.setState({ menuDefaultSelectedKey: "4" })
            this.props.setPage(<ConnectionManagment />)
          }}>
            <Icon type="usergroup-add" />
            <span className="nav-text">Connections</span>
          </Menu.Item>

          <Menu.Item key="5" onClick={() => {
            this.setState({ menuDefaultSelectedKey: "5" })
            this.props.setPage(<UserProfileUpdate user={this.state.user} />)
          }}>
            <Icon type="profile" />
            <span className="nav-text">Profile</span>
          </Menu.Item>

          <Menu.Item key="6" onClick={this.setPage}>
            <Icon type="setting" />
            <span className="nav-text">Setting</span>
          </Menu.Item>

          <Menu.Item key="7" onClick={this.props.logout}>
            <Icon type="logout" />
            <span className="nav-text">Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}


export default compose(
  firestoreConnect(
    (props) => {
      return [{ collection: 'users', doc: `${auth.currentUser.uid}` }]
    }),
  connect(({ firestore }, props) => ({
    user: getVal(firestore, `data/users/${auth.currentUser.uid}`), // lodash's get can also be used
  })),
  /*withHandlers({
    updateTodo: props => () => {
        console.log(props)
      return firebase.update(`post/${props.todoId}`, { done: !props.todo.isDone })
    }
  })*/
)(UserSideBar)
