import React, { Component } from 'react'
import Post from './Post'
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import {auth} from '../firebase'
import { Row} from 'antd'

class MyWall extends Component {
  render() {
    if (!isLoaded(this.props.myPosts)) {
      return <div>Loading...</div>
    }
    if (isEmpty(this.props.myPosts)) {
      return <div>Post List Is Empty</div>
    }
    return (
      <div>
        <Row>
          {this.props.myPosts.map(item => {
            return <Post
              key={item.id}
              item={item}
            ></Post>
          })}
        </Row>
      </div>
    )
  }
}


export default compose(
  firestoreConnect(() => [
    {
      collection: 'posts',
      orderBy:['createAt','desc'],
      storeAs: 'myPosts', 
      where: ['owner_uid', '==',auth.currentUser.uid],
    },
  ]), 
  connect((state, props) => ({
    myPosts: state.firestore.ordered.myPosts
  }))
)(MyWall)