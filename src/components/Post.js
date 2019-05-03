import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getVal } from 'react-redux-firebase'
import { compose } from 'recompose'
import firebase, { auth, firestore } from '../firebase';
import UserLogo from './UserLogo';
import MapContainer from './MapContainer'
import { Input,Icon,Modal, Button,Row,List, Col} from 'antd';

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            show:false,
            likeState:false
        }
        this.addComment = this.addComment.bind(this)
        this.getComments = this.getComments.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.pressLike = this.pressLike.bind(this)
        this.getLikeState = this.getLikeState.bind(this)
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    addComment() {
        let value=document.getElementById('newCommentId').value
        if (value === '') return;
        //document.getElementById('newCommentId').value=''
        firestore.collection('posts').doc(this.props.item.id).collection('comments').add({
            user: firebase.firestore().doc(`users/${auth.currentUser.uid}`),// firebase.firestore.DocumentReference(`users/${auth.currentUser.uid}`),
            content: value,
            createAt: new Date()
        }).then(() => {
            this.getComments()
            firestore.collection('posts').doc(this.props.item.id).update({
                "commentCount": this.props.item.commentCount + 1,
            })
            
        })
        document.getElementById('newCommentId').value=''
    }

    pressLike() {
        firestore.collection('posts').doc(this.props.item.id).collection('likes').where('userId','==',`${auth.currentUser.uid}`).get().then((snapshot)=>{
            //console.log(snapshot.docs.length>0)
            if(snapshot.docs.length>0){
                snapshot.forEach(doc => {
                    firestore.collection('posts').doc(this.props.item.id).collection('likes').doc(doc.id).delete().then(()=>{
                        firestore.collection('posts').doc(this.props.item.id).update({
                            "postLikeCount": this.props.item.postLikeCount - 1,
                        })
                        this.setState({likeState:false})
                        //postLikeCount
                    })
                });
                //firestore.collection('posts').doc(this.props.item.id).collection('likes').doc(auth.currentUser.uid).delete()
            }else{
                firestore.collection('posts').doc(this.props.item.id).collection('likes').add({userId:auth.currentUser.uid}).then(()=>{
                    firestore.collection('posts').doc(this.props.item.id).update({
                        "postLikeCount": this.props.item.postLikeCount + 1,
                    })
                    this.setState({likeState:true})
                    //postLikeCount
                })
            }
        })
    }

    getLikeState() {
        firestore.collection('posts').doc(this.props.item.id).collection('likes').where('userId','==',`${auth.currentUser.uid}`).get().then((snapshot)=>{
            //console.log(snapshot.docs.length>0)
            if(snapshot.docs.length>0){
                this.setState({likeState:true})
            }else{
                this.setState({likeState:false})
            }
        })
    }

    getComments() {

        let tmpArr = []
        firestore.collection('posts').doc(`${this.props.item.id}`).collection('comments').orderBy('createAt', 'desc').limit(5).get().then(
            (snapshot) => {
                snapshot.forEach(doc => {
                    tmpArr.push({ item: doc.data(), id: doc.id });
                });
                this.setState({ comments: tmpArr })
            })
    }

    componentWillReceiveProps() {
        this.getComments();
    }

    componentDidMount() {
        this.getLikeState();
        this.getComments();
    }

    render() {

        return (
            <Row style={{margin:'5px',borderRadius:'5px',background: '#fff'}}>
                <Col  xs={4} sm={4} md={3} lg={2} xl={2} style={{background: '#fff',borderRadius:'5px',paddingTop:'10px'}}>
                    <UserLogo userId={this.props.item.owner_uid} size={50}></UserLogo>
                </Col>
                <Col  xs={20} sm={20} md={21} lg={22} xl={22} style={{ background: '#fff',borderRadius:'5px',padding:'5px' }}>
                    <p style={{ display: 'None' }}>{this.props.item.commentCount}</p>
                    <img src={this.props.item.imageUrl} alt={this.props.item.userFullname} style={{borderRadius:'5px'}} width='100%'/>

                    <p>{this.props.item.content}</p>
                    <div className="reaction"> 	
                        {this.state.likeState?<Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" onClick={this.pressLike}/>:
                        <Icon type="heart" onClick={this.pressLike}/>}
                        {this.props.item.postLikeCount}

                        {this.props.item.location ?
                            <Icon type="environment" theme="twoTone"  onClick={this.handleShow}/> : ""}
                        <Modal
                            title="Location"
                            centered
                            visible={this.state.show}
                            onOk={this.handleClose}
                            onCancel={this.handleClose}
                            footer={[]}
                            >
                                <MapContainer location={this.props.item.location} onSelectLocation={this.onSelectLocation}></MapContainer>
                        </Modal>

                    </div>
                        <div className="comments">
                        <Input.Group compact>
                            <Input.TextArea
                                autosize={{ minRows: 1, maxRows: 6 }}
                                id="newCommentId"
                                placeholder="Comment"
                                style={{ width: '90%' }} />
                            <Button onClick={value=>{
                                this.addComment('df')
                            }}>Add</Button>
                        </Input.Group>
                        <List
                            size="small"
                            dataSource={this.state.comments}
                            renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                avatar={<UserLogo userId={item.item.user.id} size={25}></UserLogo>}
                                title={item.item.content}
                                />
                                <div></div>
                            </List.Item>
                            )}
                        > {/*this.state.loading && this.state.hasMore && <Spin className="demo-loading" />*/}
                        </List>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default compose(
    connect(({ firestore }, props) => ({
        post: getVal(firestore, `data/posts/${props.item.id}`), // lodash's get can also be used
    })),
)(Post)