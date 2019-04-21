import React, { Component } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button , Modal} from 'react-bootstrap'
import '../style.css';
import { connect } from 'react-redux'
import { getVal } from 'react-redux-firebase'
import { compose } from 'recompose'
import firebase, { auth, firestore } from '../firebase';
import UserLogo from './UserLogo';
import MapContainer from './MapContainer'


class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newComment: '',
            comments: [],
            show:false
        }
        this.addComment = this.addComment.bind(this)
        this.getComments = this.getComments.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleShow = this.handleShow.bind(this)
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    addComment() {
        if (this.state.newComment === '') return;
        firestore.collection('posts').doc(this.props.item.id).collection('comments').add({
            user: firebase.firestore().doc(`users/${auth.currentUser.uid}`),// firebase.firestore.DocumentReference(`users/${auth.currentUser.uid}`),
            content: this.state.newComment,
            createAt: new Date()
        }).then(() => {
            this.setState({ newComment: '' })
            this.getComments()
            firestore.collection('posts').doc(this.props.item.id).update({
                "commentCount": this.props.item.commentCount + 1,
            })

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
        this.getComments();
    }

    render() {

        return (
            <Container className="card-post" style={{ borderRadius: '5px', backgroundColor: '#ffffff80' }}>
                <Row>
                    <Col xs={12} sm={3} lg={2}>
                        <UserLogo userId={this.props.item.owner_uid} size={80}></UserLogo>

                    </Col>
                    <Col xs={12} sm={9} lg={10}>
                        <p style={{ display: 'None' }}>{this.props.item.commentCount}</p>
                        <img src={this.props.item.imageUrl} alt={this.props.item.userFullname} />

                        <p>{this.props.item.content}</p>
                        <div className="reaction">
                            <img draggable="false" className="emoji" alt="❤" src="https://twemoji.maxcdn.com/16x16/2764.png"
                            /> {this.props.item.postLikeCount}

                            {this.props.item.location ?
                                <i className="fas fa-map-marker-alt" style={{ fontSize: "15px", color: 'Green' }} onClick={this.handleShow} ></i> : ""}
                            <Modal show={this.state.show} onHide={this.handleClose}
                                size="lg"
                                aria-labelledby="example-modal-sizes-title-lg"
                                centered>
                                <Modal.Header closeButton>
                                    <Modal.Title id="example-modal-sizes-title-lg">
                                        Location
                            </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                        <MapContainer location={this.props.item.location} onSelectLocation={this.onSelectLocation}></MapContainer>
                                    </Container>
                                </Modal.Body>
                            </Modal>

                        </div>
                        <div className="comments">
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Comment"
                                    aria-label="Comment"
                                    aria-describedby="Comment"
                                    value={this.state.newComment}
                                    onChange={(evt) => { this.setState({ newComment: evt.target.value }) }}
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={() => this.addComment()}>Add</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            <ul>
                                {

                                    this.state.comments.map(item => {
                                        return <li key={item.id}><UserLogo userId={item.item.user.id} size={25}></UserLogo>   {' :  '}{item.item.content}</li>
                                    })
                                }

                            </ul>

                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default compose(
    connect(({ firestore }, props) => ({

        post: getVal(firestore, `data/posts/${props.item.id}`), // lodash's get can also be used
    })),
)(Post)