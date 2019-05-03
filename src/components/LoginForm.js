import React, { Component } from 'react';
import { Form,Input,Icon,Button} from 'antd'
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
            <div style={{ height: "100%", width:'100%' }}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        onChange={(evt) => { this.setState({ uss: evt.target.value }) }} placeholder="Username" />
                    </Form.Item>
                    <Form.Item>
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" 
                         onChange={(evt) => {
                            this.setState({ uph: evt.target.value })
                        }}  />
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" className="login-form-button" onClick={()=>this.login(null)} style={{width: '100%'}}>
                        Log in
                    </Button>
                    <Button onClick={()=>{this.login(provider)}} style={{
                        width: '100%' , marginTop:20
                    }}>
                        Login with google account
                    </Button>
                    <Button onClick={()=>{
                        this.setState({ uss: 'test@test.com' ,uph:'testtest' })
                        this.login()}} style={{
                        width: '100%' , marginTop:20
                    }}>
                        Login with test user
                    </Button>
                    </Form.Item>
                </Form>   

            </div>
        )
    }
}
export default LoginForm;