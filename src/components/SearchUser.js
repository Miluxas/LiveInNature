import React, { Component } from 'react'
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap'
import { auth } from '../firebase';
import { connect } from "react-redux"
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import FindedUser from './FindedUser';


class SearchUser extends Component {
    constructor(props) {
        super(props)
        this.state = { searchStr: '' }
    }

    render() {


        let tmpD = ''
        if (!isLoaded(this.props.findedUserList)) {
            tmpD = <div>Loading...</div>
        } else {
            let newList = this.props.findedUserList.filter(object => {
                return object.username.includes(this.state.searchStr)&& object.id!==auth.currentUser.uid;
            });
            if (isEmpty(newList)) {
                tmpD = <div>Finded List Is Empty</div>
            } else {
               
                tmpD = <Row>
                    {newList.map(user => {
                        let sendCon=[];
                        if(this.props.sendedConnectionList)
                            sendCon=this.props.sendedConnectionList.filter(con=>(con.user.id===user.id))
                        return <FindedUser  key={user.id}
                                            user={user} 
                                            sendCon={sendCon}>
                                </FindedUser> //<div key={connection.id} >{connection.user.id}</div>
                    })}
                </Row>
            }
        }




        return (
            <Col>
                <Row>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Username or Email"
                            aria-label="Username or Email"
                            aria-describedby="basic-addon2"
                            onChange={(evt) => { this.setState({ searchStr: evt.target.value }) }}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={() => { this.props.setSearchString(this.state.searchStr) }}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Row>
                {tmpD}
            </Col>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSearchString: searchString => dispatch({ type: 'SET_SEARCH_STRING', searchString })
    }
}

export default compose(

    connect((state, props) => ({
        findedUserList: state.firestore.ordered.findedUserList,
        sendedConnectionList: state.firestore.ordered.sendedConnectionList,
        searchString: state.localState.searchString,
    }), mapDispatchToProps),
    firestoreConnect((props) => [
        {
            collection: `users`,
            storeAs: 'findedUserList',
            //where: [`users/${auth.currentUser.uid}/sendedConnections`, 'array-contains', 'uid'],
        },
    ]),

)(SearchUser)