import React, { Component } from 'react'
import Post from './Post'
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { Row } from 'antd';
import {auth} from '../firebase'

class PostContainer extends Component {
  render() {
    if (!isLoaded(this.props.posts)) {
      return <div>Loading...</div>
    }
    if (isEmpty(this.props.posts)) {
      return <div>Post List Is Empty</div>
    }

    return (
      <div>
        <Row>
          {
            this.props.posts.map(item => {
            var fres=this.props.sendedConnectionList.filter(function(cone) {
              return (cone.status===1 && cone.userUid === item.owner_uid) || auth.currentUser.uid === item.owner_uid ;
            })
            if(fres.length>0)
            return <Post
              key={item.id}
              item={item}
            ></Post>
            return ''
          })}
        </Row>
      </div>
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
      select:'userUid'
    },
    {
      collection: 'posts',
      orderBy: ['createAt', 'desc'],
      //where: ['sendedConnectionList', 'array-contains','owner_uid'],
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
    posts: state.firestore.ordered.posts,
    sendedConnectionList:state.firestore.ordered.sendedConnectionList
  }))
)(PostContainer)