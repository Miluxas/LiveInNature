import React, { Component } from 'react';
import { Container } from 'react-bootstrap'
import '../style.css';


class RightSideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
        this.getList = this.getList.bind(this)
    }

    getList() {

       /* let tmpArr = []
        firestore.collection('advertisements').get().then(
            (snapshot) => {
                snapshot.forEach(doc => {
                    tmpArr.push({ item: doc.data(), id: doc.id });
                });
                this.setState({ list: tmpArr })
            })*/

    }
    componentDidMount() {
        this.getList();
    }

    render() {
        //var t= DOMParser(item.item.content);
        return (
            <Container >
                <Container style={{ position: 'fixed', right: '0px', maxWidth: '300px', top: '0px', bottom: '0px' ,padding:'15px 0'}}>
                    <div className="banner-gallery__TemplatePreview__templatePreview" style={{width: '270px', height: '225px'}}>
                        <iframe title="Preview template" src="//dge4uaysoh8oy.cloudfront.net/banners/bcp0xqy2j/embed/index.html" scrolling="no" style={{opacity: 1}} alt="Women Activewear Sports Banner Template Medium Rectangle 300x250" width="300" height="250" frameBorder="0">
                        </iframe>
                    </div>
                </Container>
            </Container>
        )
    }
}

export default RightSideBar;