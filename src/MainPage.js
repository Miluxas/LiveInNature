import React, { Component } from 'react'
import PostContainer from './components/PostContainer'
import { auth, provider } from './firebase'
import { Layout, Row, Col } from 'antd'
import UserSideBar from './components/UserSideBar'
import LoginForm from './components/LoginForm'

const { Sider, Content } = Layout;

class MainPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      logedIn: null,
      loginModalShow: false,
      width: window.innerWidth,
      pageContent: <PostContainer></PostContainer>
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.setPage = this.setPage.bind(this)
  }
  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        if (result.user)
          this.setState({ logedIn: true })
        this.render();
      });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({ logedIn: false })
      });
  }
  componentWillMount() {

  }
  componentDidMount() {

    //this.updateDimensions();
    //window.addEventListener("resize", this.updateDimensions.bind(this));
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ logedIn: true })
      } else {
        this.setState({ logedIn: false })
      }
    })
  }

  setPage(eve) {
    this.setState({ pageContent: eve })
  }
  render() {
    if (this.state.logedIn === null) {
      return (
        <div style={{ height: "100%", width: "100%" }}>
          <div style={{ height: '50%' }}></div>
          <img src='loading.gif' align="middle" alt='Loading'
            style={{
              width: '100px', height: '100px',
              margin: '-50px auto 20px',
              display: 'block'
            }}></img>
        </div>
      )
    }

    if (this.state.logedIn === true) {
      return (
        <Layout style={{ height: '100%' }}>
          <UserSideBar setPage={this.setPage}
            logout={this.logout}></UserSideBar>
          <Layout style={{minWidth:'320px'}}>
            <Content style={{ margin: '10px' }}>
              {this.state.pageContent}
            </Content>
          </Layout>
          <Sider
            style={{ backgroundColor: 'white' }}
            breakpoint='md'
            width='200px'
            collapsedWidth="0"
            //onBreakpoint={(broken) => { console.log(broken); }}
            //onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          >
            <img width='100%' src='./img/hqdefault.jpg' alt=''></img>
            <img width='100%' src='./img/imageseer.jpg' alt=''></img>
            <img width='100%' src='./img/logo_large.png' alt=''></img>
          </Sider>
        </Layout>)
    }



    /*<Container fluid="true" style={{height:"100%" ,padding:'0'}}>
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
                    <UserSideBar 
                        logout={this.logout} 
                        logedIn={this.state.logedIn}
                        changePage={page=>{
                          this.setState({page:page})
                        }}    
                    ></UserSideBar>
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
    )}*/
    else if (this.state.logedIn === false) {
      return (
        <div style={{ height: "100%", width: '100%' }}>
          <Row style={{ height: '30%' }} ></Row>
          <Row>
            <Col md={{ span: 6, offset: 9 }}>
              <LoginForm setLoginState={(st) => { this.setState({ logedIn: st }) }}></LoginForm>
            </Col>
          </Row>
        </div>
      )
    }

  }
}

export default MainPage;