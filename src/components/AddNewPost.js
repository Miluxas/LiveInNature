import React, { Component } from 'react';
import { Upload, Form, Button, Icon , Modal,Input} from 'antd'
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
        this.showLocationSelector = this.showLocationSelector.bind(this)

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
                            commentCount:0,
                            postLikeCount:0
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
                commentCount:0,
                postLikeCount:0
                })
            }
            this.props.closeModal();
        }
    }
    handleClose() {
        this.setState({ show: false });
      }
    
    showLocationSelector() {
        this.setState({ show: true });
      }
    onSelectLocation(loc){
        this.setState({location:loc})
    }

    render() {
        return (
            <Form>
                <img src={this.state.file} alt='' width='100%' />
                <Form.Item
                label="Upload"
                >
                    <Upload name="logo" action={(file) => {
                        this.setState({
                            image: file,
                            file: URL.createObjectURL(file)
                        })
                    }} listType="picture">
                    <Button>
                        <Icon type="upload" /> Upload
                    </Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Input.TextArea placeholder="Content" autosize  onChange={(evt) => { this.setState({ content: evt.target.value }) }}/>
                </Form.Item>
                <Modal
                title="Select Location"
                width={'80%'}
                centered
                visible={this.state.show}
                onOk={() => this.handleClose()}
                onCancel={() => this.handleClose()}
                >
                    <MapContainer onSelectLocation={this.onSelectLocation}></MapContainer>
                </Modal>
            </Form>

            )
    }
}
export default (AddNewPost);