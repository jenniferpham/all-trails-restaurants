import './map.component.css';
import React, { useState, useEffect, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


// Google recommends installing this library https://www.npmjs.com/package/@react-google-maps/api for React app
// https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d

// TODO: markers on the map
const mapStyles = {        
  height: '526px',
  width: "100%",
  padding: '0px'
};

const defaultCenter = {
  lat: 41.3851, lng: 2.1734
}

const containerStyle = {
  // width: '675px',
  height: '526px',
  padding: '0px'
};

const defaultPosition = { 
  lat: 41.3954,
  lng: 2.162 
};

function Map({locations}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDue_S6t9ybh_NqaeOJDkr1KC9a2ycUYuE" // TODO - don't push to Github repo
  })

  const [map, setMap] = useState(null)

  const [ currentPosition, setCurrentPosition ] = useState({});
  
const success = position => {
  const currentPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  }
  setCurrentPosition(currentPosition);
};

useEffect(() => {
  navigator.geolocation.getCurrentPosition(success);
}, [])

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(defaultPosition);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <div className='map-container'>
       

      <LoadScript
        googleMapsApiKey="AIzaSyDue_S6t9ybh_NqaeOJDkr1KC9a2ycUYuE">
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={13}
            center={defaultCenter}
          >
            {
              locations.map(item => {
                return (
                <Marker key={item.name} position={item.location} clickable={true} visible={true}/>
                )
              })
          }
          </GoogleMap>
      </LoadScript>
    
      {/* <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultPosition}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {
            locations.map(item => {
              return (
              <Marker key={item.name} position={item.location} clickable={true} visible={true}/>
              )
            })
         }
      </GoogleMap> */}
    </div>
  ) : <></>
}

export default React.memo(Map)