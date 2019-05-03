import React, { Component } from 'react';
import { auth, firestore, storage } from '../firebase';
import {
  Form, Button, Upload, Icon, Input,DatePicker
} from 'antd';
import moment from 'moment'

class UserProfileUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      description: props.user.description,
      username: props.user.username,
      imageId: '',
      birthDate: props.user.birthDate?props.user.birthDate:'2010/10/10',
      file: null,
      fileSrc: null
    }
    this.updateInfo = this.updateInfo.bind(this)
  }

  updateInfo() {
    if(this.state.file)
        { 
          //console.log(this.state.file)
      var storageRef = storage.ref();
      var mountainsRef = storageRef.child(`profile-images/${auth.currentUser.uid}`);
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
  }

  render() {
    const dateFormat = 'YYYY/MM/DD';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
        label="Image"
          style={{textAlign:'center'}}
        >              
        <img src={this.state.fileSrc?this.state.fileSrc: this.props.user.imageUrl} alt='' style={{borderRadius:'50%'}} width="200" height="200" />
        </Form.Item>
        <Form.Item
          label="Dragger"
        >
          <div className="dropbox">

              <Upload.Dragger name="files" action={(file) => {
                this.setState({
                  file: file,
                  fileSrc: URL.createObjectURL(file)
                })
              }}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
          </div>
        </Form.Item>

        <Form.Item
            label="Full Name"
            {...formItemLayout}
          >
          <Input placeholder="Full Name"  value={this.state.username} onChange={(evt) => { this.setState({ username: evt.target.value }) }} />
        </Form.Item>

        <Form.Item
            label="Description"
            {...formItemLayout}
          >
          <Input.TextArea placeholder="Description"  value={this.state.description} onChange={(evt) => { this.setState({ description: evt.target.value }) }} />
        </Form.Item>

        <Form.Item
            label="birthDate"
            {...formItemLayout}
          >
            <DatePicker placeholder="Birth Date" value={moment(this.state.birthDate, dateFormat)} format={dateFormat} onChange={(date, dateString) => {
              console.log(dateString )
              this.setState({ birthDate: dateString }) }} />
        </Form.Item>



        <Form.Item
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary"  onClick={this.updateInfo}>Save</Button>
        </Form.Item>

      </Form>

      
    )
  }
}

export default (UserProfileUpdate)  
/*<Row>
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
    </Form>
  </Col>
      </Row>*/