import React, { Component } from 'react';
import { connect } from "react-redux";

import { auth } from '../firebase';
import { Container, Modal,ListGroup } from 'react-bootstrap'
import '../style.css';
import AddNewPost from './AddNewPost'
import { getVal, firestoreConnect } from 'react-redux-firebase'
import { compose } from 'recompose'
import UserProfileUpdate from './UserProfileUpdate';

class UserSideBar extends Component {
  constructor(props) {

    super(props)
    this.state = {
      user: null,
      userProfileModalShow: false
    }
    this.closeModal = this.closeModal.bind(this)
    this.closeUserProfileModal = this.closeUserProfileModal.bind(this)
  }
  componentWillReceiveProps(props) {
    this.setState({ user: props.user })
  }
  closeModal() {
    this.setState({ lgShow: false })
  }
  closeUserProfileModal() {
    this.setState({ userProfileModalShow: false })
  }

  buttonStyle={padding:'3px'}

  render() {
    let lgClose = () => this.setState({ lgShow: false });

    if (this.state.user == null)
      return <div></div>
    //console.log(auth.currentUser)
    return (
      <Container className="sidebar-nav" style={{overflowY: 'auto',overflowX:'hidden',height:'100%',background:'#009cff4d'}}>
        <div style={{ height: '30' }}>
        <img src='liveInNature.png' alt='Live In Nature Logo'></img>
        </div>
        <Container style={{ borderRadius: 10 }}>
          <img src={this.state.user.imageUrl} alt={this.state.user.username} className="img-circle" width="200" height="200" />
          <h2 className="text-center hidden-xs">{this.state.user.username ? this.state.user.username : this.state.user.email}</h2>
          <p className="text-center user-description hidden-xs">
            <i>{this.state.user.description}</i>
          </p>

        <ListGroup>
          <ListGroup.Item action style={this.buttonStyle} onClick={() => this.setState({ lgShow: true })}>New Post</ListGroup.Item>
          <ListGroup.Item action style={this.buttonStyle} onClick={()=>{ this.props.changePage('PostContainer')}}>Main Wall</ListGroup.Item>
          <ListGroup.Item action style={this.buttonStyle} onClick={()=>{ this.props.changePage('MyWall')}}>My Wall</ListGroup.Item>
          <ListGroup.Item action style={this.buttonStyle} onClick={()=>{ this.props.changePage('Connection')}}>Connections</ListGroup.Item>
          <ListGroup.Item action style={this.buttonStyle} onClick={() => { this.setState({ userProfileModalShow: true }) }}>Profile</ListGroup.Item>
          <ListGroup.Item action style={this.buttonStyle}>Setting</ListGroup.Item>
          <ListGroup.Item action style={this.buttonStyle} onClick={this.props.logout}>Logout</ListGroup.Item>
        </ListGroup>

        </Container>

        <Modal
          size="lg"
          show={this.state.lgShow}
          onHide={lgClose}
          aria-labelledby="example-modal-sizes-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title">
              Add New Post
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><AddNewPost closeModal={lgClose}></AddNewPost></Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={this.state.userProfileModalShow}
          onHide={this.closeUserProfileModal}
          aria-labelledby="example-modal-sizes-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title">
              User Profile
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><UserProfileUpdate user={this.state.user} onCloseUserProfileModal={this.closeUserProfileModal}></UserProfileUpdate></Modal.Body>
        </Modal>
      </Container>
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
