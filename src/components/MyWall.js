import React, { Component } from 'react'
import { Col } from 'react-bootstrap'
import '../style.css'
import Post from './Post'
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import {auth} from '../firebase'

class MyWall extends Component {
  render() {
    if (!isLoaded(this.props.myPosts)) {
      return <div>Loading...</div>
    }
    if (isEmpty(this.props.myPosts)) {
      return <div>Post List Is Empty</div>
    }

    return (
      <Col>

        {this.props.myPosts.map(item => {
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
      storeAs: 'myPosts', // not nessesary, but can prevent needing id in connect
      where: ['owner_uid', '==',auth.currentUser.uid],
    },

    //`users/${auth.currentUser.id}/posts/`
  ]), // or { collection: 'todos' }
  connect((state, props) => ({
    myPosts: state.firestore.ordered.myPosts
  }))
)(MyWall)