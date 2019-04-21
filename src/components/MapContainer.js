import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
  
  const MyMapComponent = compose(
    withProps({
        googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyDajZ_oP45E1eXC-Nr2eL1ObMzbd3248bI&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) =>
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat:props.lat?props.lat: -34.397, lng: props.lng?props.lng: 150.644 }} 
      onDblClick={props.onDoubleClick} 
      onClick={props.onClick} 
    >
      {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.lng }}/>}
    </GoogleMap>
  )
  
export class MapContainer extends Component {
    constructor(params){
        super(params)
        this.onDoubleClick=this.onDoubleClick.bind(this)
        if(params.location)
        {
          this.state = {
            isMarkerShown: true,
            lat:params.location.lat,
            lng:params.location.lng,
            isLock:true
          }
        }
        else
        {
          this.state = {
            isMarkerShown: false,
            lat:null,
            lng:null,
            isLock:false
          }
        }
    }

    
      onClick = () => {
        //this.setState({ isMarkerShown: false })
        //this.delayedShowMarker()
      }
    
      onDoubleClick(param){
        if(!this.state.isLock){
          this.setState({
            isMarkerShown: true,
              lng:param.latLng.lng(),
              lat:param.latLng.lat()
          })
          this.props.onSelectLocation({lat:this.state.lat,lng:this.state.lng})
        }
      }

      render() {
        return (
          <MyMapComponent
            isMarkerShown={this.state.isMarkerShown}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
            lat={this.state.lat}
            lng={this.state.lng}
          />
        )
      }


}

export default (MapContainer);