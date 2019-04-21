import React, { Component } from 'react';
import { Container, Form, Button, Row, Col, Image , Modal} from 'react-bootstrap'
import { auth, firestore ,storage} from '../firebase';
import MapContainer  from './MapContainer';

class AddNewPost extends Component {
    newUid=null;
    constructor(props) {
        super(props)

        this.state = {
            content: '',
            imageId: '',
            image: null,
            file: null,
            location:null,
            show:false
        }
        this.addPost = this.addPost.bind(this)
        this.onSelectLocation=this.onSelectLocation.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleShow = this.handleShow.bind(this)

    }
    
    addPost() {
        if(this.state.content)
        {
            if(this.state.image)
            { 
                var storageRef = storage.ref();
                var mountainsRef = storageRef.child(`posts-images/${this.state.image.name}`);

                mountainsRef.put(this.state.image,{contentType: 'image/jpeg'}).then((finish)=>{
                    finish.ref.getDownloadURL().then((downloadURL)=>{
                        firestore.collection('posts').add({
                            owner_uid: auth.currentUser.uid,// firebase.firestore.DocumentReference(`users/${auth.currentUser.uid}`),
                            content: this.state.content,
                            imageUrl:downloadURL,
                            createAt:new Date(),
                            location:this.state.location,
                            commentCount:0
                        })
                    })
                })
            }else
            {
                firestore.collection('posts').add({
                owner_uid: auth.currentUser.uid,// firebase.firestore.DocumentReference(`users/${auth.currentUser.uid}`),
                content: this.state.content,
                createAt:new Date(),
                location:this.state.location,
                commentCount:0
                })
            }
            this.props.closeModal();
        }
    }
    handleClose() {
        this.setState({ show: false });
      }
    
      handleShow() {
        this.setState({ show: true });
      }
    onSelectLocation(loc){
        this.setState({location:loc})
    }

    render() {
        return (
            <Container fluid="true">
                <Row>
                    <Col>
                        <Form>
                            <Image src={this.state.file} width="500" height="500" />
                            <Form.Group>
                                <Form.Control onChange={(evt) => {
                                    this.setState({
                                        image: evt.target.files[0],
                                        file: URL.createObjectURL(evt.target.files[0])
                                    })
                                }} type="file" />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control onChange={(evt) => { this.setState({ content: evt.target.value }) }} type="text" placeholder="Enter content" />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" onClick={this.handleShow} style={{marginRight:15,marginLeft:15}}>
                            Select Location
                            </Button>

                            <Modal show={this.state.show} onHide={this.handleClose}
                                 size="lg"
                                 aria-labelledby="example-modal-sizes-title-lg"
                                centered>
                            <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg">
                                Select Location
                            </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Container>
                                    <MapContainer onSelectLocation={this.onSelectLocation}></MapContainer>
                                </Container>
                            </Modal.Body>
                            </Modal>
    
                            <Button onClick={this.addPost}>
                                Add
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>)
    }
}
export default (AddNewPost);