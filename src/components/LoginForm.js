import React, { Component } from 'react';
import { Container, Form, Button,Row } from 'react-bootstrap'
import '../style.css';

import { auth, provider, firestore} from '../firebase';

class LoginForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            uss: '',
            uph: '',
            message: ''
        }
        this.login = this.login.bind(this)
    }

    login(prov) {
        if (prov) {
            auth.signInWithPopup(provider)
                .then((result) => {
                    if (result.user)
                    {
                        this.checkUser(result.user)
                        this.props.setLoginState(true)
                    }
                });
        } else {
            auth.signInWithEmailAndPassword(this.state.uss, this.state.uph)
                .then((result) => {
                    if (result.user)
                    {
                        this.checkUser(result.user)
                        this.props.setLoginState(true)
                    }
                });
        }
    }

    checkUser(user){
        firestore.collection('users').doc(`${user.uid}`).get().then(doc=>{
            if(!doc.exists){
                firestore.collection('users').doc(`${user.uid}`)
                    .set({username:user.email,
                        imageUrl:user.photoURL,
                        description:''
                    })
            }
        })
    }



    render() {
        return (
            <Container fluid="true" style={{ height: "100%" }}>
                <Row>
                    <Form style={{width: '100%'}}>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={(evt) => { this.setState({ uss: evt.target.value }) }} type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(evt) => {
                                this.setState({ uph: evt.target.value })
                            }} />
                        </Form.Group>
                        <Button onClick={()=>this.login(null)} style={{width: '100%'}}>
                            Login
                        </Button>
                    </Form>
                    <h2>{this.state.message}</h2>
                </Row>
                <Row>
                    <Button onClick={()=>{this.login(provider)}} style={{
                        width: '100%' , marginTop:20
                    }}>
                        Login with google account
                    </Button>
                </Row>


            </Container>
        )
    }
}

export default LoginForm;