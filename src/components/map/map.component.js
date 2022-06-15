import './map.component.css';
import React, { useState, useEffect, useCallback } from 'react'
import { GoogleMap, LoadScript, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';


// Google recommends installing this library https://www.npmjs.com/package/@react-google-maps/api for React app
// https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d
// https://react-google-maps-api-docs.netlify.app/

// TODO
/*
X-The web app will use the Google Places API for its data source
X- Get data to main page to distribute into 2 components
XThe web app should display the search results as a list
XSearch results on the list should include basic information about the restaurant 
XA search feature will be included that allows the user to search for restaurants
X-The web app should display the search results as pins on a map

X1. It'd be best to use the users current location for the initial load of the page and return a basic list of restaurants based on their longitude and latitude.
2. yes the restaurants should link to google's details page of the restaurant. 
3. Yes - when a user hovers over a card on the left pane, the card on the map should appear on the map at the correct location.
4. Hovering on the pins on the map should show the map card on the map
5. Debouncing on text search is best practice, I'd advise that it is added. 
X6. If you can just grab the logo off the website that would be great. 
*/

// provider keep track of current position
// keep track of selected restaurant + its current position

// TODO: markers on the map
const mapStyles = {        
  height: '526px',
  width: "100%",
  padding: '0px'
};

const defaultCenter = {
  lat: 41.3851, lng: 2.1734
}


function Map({mapCenter, currentPosition, locations}) {
  const [ selected, setSelected ] = useState({});
  
  const [zoom, setZoom] = React.useState(13); // initial zoom
  const [center, setCenter] = React.useState({
    lat: 0,
    lng: 0,
  });


  // const initMap = () => {
  //     // get user current position and save state
  //     navigator.geolocation.getCurrentPosition(success);
  // }
  
  // const getNearbyRestaurants = (currentPosition, map, query) => {
  //   let request = {
  //     location: currentPosition,
  //     radius: "2000", // meters
  //     type: 'restaurant', 
  //     query
  //   };

  //   const service = new window.google.maps.places.PlacesService(map);
  //   service.textSearch(request, (results, status) => {
  //      if (status === "OK" && results) {
  //       setLocations(results);
  //       console.log('result', results[0])
  //       //setMapCenter(results[0].geometry.location);
  //     }
  //   });

  // }

  // const searchRestaurantsByQuery = (currentPosition, map, query) => {
  //   let request = {
  //     location: currentPosition,
  //     radius: "2000", // meters
  //     type: 'restaurant', 
  //     query
  //   };

  //   const service = new window.google.maps.places.PlacesService(map);
  //   service.textSearch(request, (results, status) => {
  //      if (status === "OK" && results) {
  //       setLocations(results);
  //       console.log('result', results[0])
  //       //setMapCenter(results[0].geometry.location);
  //     }
  //   });

  // }

  const onMarkerClick = (place, map) => {
    setSelected(place);
    console.log('selected', place)
    // const infoWindow = new window.google.maps.InfoWindow();
    // infoWindow.setContent("Jennifer");
    // infoWindow.open(map);

    // infoWindow.setContent(marker.getTitle());
    // infoWindow.open(marker.getMap(), marker);
  }

  
  // const success = position => {
  //   const currentPosition = {
  //     lat: position.coords.latitude,
  //     lng: position.coords.longitude
  //   }
  //   setCurrentPosition(currentPosition);
  //   setMapCenter(currentPosition)
  // };

  useEffect(() => {
    // get user current position
    // navigator.geolocation.getCurrentPosition(success);
   // initMap()
  }, [])


// const onLoad = useCallback(function callback(map, currentPosition) {
//   setMap(map)
//   getNearbyRestaurants(currentPosition, map)
// }, [])

// const onUnmount = useCallback(function callback(map) {
//   setMap(null)
// }, [])

  return  (
    <div className='map-container'>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={mapCenter || currentPosition}
        // onLoad={(map) => onLoad(map, currentPosition)}
        // onUnmount={onUnmount}
      >
          {  
            locations.map((item, index) => {
              console.log('location', item)
              return (
                <Marker 
                  key={item.place_id} 
                  position={{
                    lat: item.geometry.location.lat(),
                    lng: item.geometry.location.lng()
                  }}
                  onClick={() => onMarkerClick(item)}
                  clickable={true}
                  visible={true}
                />
              )
            })
          }
          {
              selected.location && 
              (
                <InfoWindow
                  position={selected.location}
                  clickable={true}
                  onCloseClick={() => setSelected({})}
                >
                  <p>{selected.name}</p>
                </InfoWindow>
              )
          }
      </GoogleMap>
    </div>
  )
}

export default React.memo(Map)