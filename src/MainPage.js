import React, { Component } from 'react'
import {Container,Row,Col,OverlayTrigger,Button} from 'react-bootstrap'
import './style.css'
import UserSideBar from './components/UserSideBar'
import RightSideBar from './components/RightSideBar'
import PostContainer from './components/PostContainer'
import { auth ,provider} from './firebase'
import LoginForm from './components/LoginForm'
import ConnectionManagment from './components/ConnectionManagment'
import MyWall from './components/MyWall';
import UserLogo from './components/UserLogo';

class MainPage extends Component {
    constructor(props){
      super(props)
      this.state={  searchText:'',
                    logedIn:null,
                    page:'PostContainer',
                    loginModalShow:false,
                    width:window.innerWidth
                  }
      this.login=this.login.bind(this);
      this.logout=this.logout.bind(this);
    }
    login(){
      //auth.signInWithPopup('miluxas@yahoo.com','Qaz123')
      auth.signInWithPopup(provider)
     .then((result) => {
        if(result.user)
          this.setState({logedIn:true})
         //this.props.onAuthStateChanged(result.user)
         this.render();
     });
  }

  logout(){
      auth.signOut() 
      .then(() => {
        this.setState({logedIn:false})
      });
  }
  componentWillMount(){

  }
  componentDidMount() {
    
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({logedIn:true})
      }else
    {
      this.setState({logedIn:false})
    }})
  }

  
 updateDimensions() {
  this.setState({width:window.innerWidth})
 }


 /**
  * Remove event listener
  */
 componentWillUnmount() {
   window.removeEventListener("resize", this.updateDimensions.bind(this));
 }

  render() { 
    let intou=null;
    switch(this.state.page)
    {
      case 'PostContainer':
      intou= <PostContainer></PostContainer>;
      break
      case 'MyWall':
      intou= <MyWall></MyWall>;
      break
      /*case 'PersonalProfile':
      intou= <PersonalProfile></PersonalProfile>
      break*/
      case 'Connection':
      intou= <ConnectionManagment searchText={this.props.searchText}></ConnectionManagment>;
      break
      default :
      intou= <PostContainer></PostContainer>;
    };


    if(this.state.logedIn===null)
    {return (
      <Container fluid="true" style={{height:"100%" }}>
      <div style={{height:'50%'}}></div>
      <img src='loading.gif' align="middle" alt='Loading'
        style={{
          width:'100px',height:'100px',
          margin: '-50px auto 20px',
          display: 'block'
        }}></img>
        
      </Container>
      )}

    if(this.state.logedIn===true)
    {
      return (
          
    <Container fluid="true" style={{height:"100%" ,padding:'0'}}>
      <Row>
      </Row>
        <Container fluid="true" >
        <Row>
          {(this.state.width<900)?
            <Col style={{padding:'0px', position:'fixed', zIndex:10000 }}> 
            <OverlayTrigger
              trigger="click"
              key='right'
              placement={'right'}
              overlay={
                /*<Popover
                    id={`popover-positioned-right`}
                    title={`Popover`}
                  >*/
                    <UserSideBar 
                        logout={this.logout} 
                        logedIn={this.state.logedIn}
                        changePage={page=>{
                          this.setState({page:page})
                        }}    
                    ></UserSideBar>
                  //</Popover>
                }
              >
              <Button style={{padding:'0'}}>
              <UserLogo userId={auth.currentUser.uid} size={20}></UserLogo>
              </Button>
            </OverlayTrigger>
             
             </Col>
             :
          
            <Col style={{padding: 0,width:200,maxWidth:200}}> 
              <UserSideBar 
                  logout={this.logout} 
                  logedIn={this.state.logedIn}
                  changePage={page=>{
                    this.setState({page:page})
                  }}    
              ></UserSideBar>
            </Col>}
          
          <Col> 
            <Container fluid="true" style={{padding:'10px 0px 10px 0px'}} > 
              <Row>
                {intou}
                <Col className="d-none d-lg-block" style={{width:'20%',maxWidth:300,padding:0,}}>
                    <RightSideBar></RightSideBar>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Container>
    )}
    else if(this.state.logedIn===false)
    {return (
      <Container fluid="true" style={{height:"100%" }}>
        <Row style={{height:'30%'}} ></Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <LoginForm setLoginState={(st)=>{this.setState({logedIn:st})}}></LoginForm>
          </Col>
          </Row>
      </Container>
      )}

   }
}

export default MainPage;