import React, { Component } from 'react'
import { Col } from 'react-bootstrap'
import '../style.css'
import Post from './Post'
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'

class PostContainer extends Component {
  render() {
    if (!isLoaded(this.props.posts)) {
      return <div>Loading...</div>
    }
    if (isEmpty(this.props.posts)) {
      return <div>Post List Is Empty</div>
    }

    return (
      <Col>
        {this.props.posts.map(item => {
          return <Post
            key={item.id}
            item={item}
          ></Post>
        })}
      </Col>

    )


  }
}


export default compose(
  firestoreConnect(() => [
    {
      collection: 'posts',
      orderBy:['createAt','desc'],
      //doc: auth.currentUser.id,
      /*subcollections: [
        {
          collection: 'comments',
        },
      ],*/
      // storeAs: 'myRegistration', // not nessesary, but can prevent needing id in connect
      //where: ['user.uid', '==', auth.currentUser.id],
    },

    //`users/${auth.currentUser.id}/posts/`
  ]), // or { collection: 'todos' }
  connect((state, props) => ({
    posts: state.firestore.ordered.posts
  }))
)(PostContainer)