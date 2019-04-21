import React, { Component } from 'react';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap'
import '../style.css';
import { auth, firestore, storage } from '../firebase';

class UserProfileUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      description: props.user.description,
      username: props.user.username,
      imageId: '',
      birthDate: props.user.birthDate?props.user.birthDate.substr(0, 10):'',
      file: null,
      fileSrc: null
    }
    this.updateInfo = this.updateInfo.bind(this)
  }

  updateInfo() {
    if(this.state.file)
        { 
      var storageRef = storage.ref();
      var mountainsRef = storageRef.child(`profile-images/${this.props.user.id}`);
      mountainsRef.put(this.state.file, { contentType: 'image/jpeg' }).then((finish) => {
        finish.ref.getDownloadURL().then((downloadURL) => {
          firestore.collection('users').doc(`${auth.currentUser.uid}`).update(
            {
              imageUrl: downloadURL,
              username: this.state.username,
              birthDate:this.state.birthDate,
              description:this.state.description
            }
          )
        })
      })
    }else{
      firestore.collection('users').doc(`${auth.currentUser.uid}`).update(
        {
          username: this.state.username,
          birthDate:this.state.birthDate,
          description:this.state.description
        }
      )
    }
    this.props.onCloseUserProfileModal()
  }



  render() {
    return (
      <Container>
        <Row>
          <Col md={{ span: 4 }}>
            <Form>
              <Image src={this.state.fileSrc?this.state.fileSrc: this.props.user.imageUrl} className="img-circle img-user" width="200" height="200" />
              <Form.Group>
                <Form.Control onChange={(evt) => {
                  this.setState({
                    file: evt.target.files[0],
                    fileSrc: URL.createObjectURL(evt.target.files[0])
                  })
                }} type="file" />
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Control value={this.state.username} onChange={(evt) => { this.setState({ username: evt.target.value }) }} type="text" placeholder="Enter full name" />
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Control value={this.state.description} onChange={(evt) => { this.setState({ description: evt.target.value }) }} type="text" placeholder="Enter description" />
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Control defaultValue={this.state.birthDate} onChange={(evt) => { this.setState({ birthDate: evt.target.value }) }} type="date" placeholder="Enter birth date" />
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>

              <Button onClick={this.updateInfo}>
                save
              </Button>
            </Form>
          </Col>
        </Row>

      </Container>
    )
  }
}

export default (UserProfileUpdate)