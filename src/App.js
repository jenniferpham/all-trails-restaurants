import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, InputGroup } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { IoSearchSharp } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import './App.css';
import { RestaurantList } from './components/restaurant-list/restaurant-list.component';
import { ListItem } from './components/list-item/list-item.component';
import Map from './components/map/map.component'
import logo from './assets/logo.svg';


// https://developers.google.com/maps/documentation/javascript/react-map
// Google recommends installing this library https://www.npmjs.com/package/@react-google-maps/api for React app
// Docs: https://react-google-maps-api-docs.netlify.app/ 

const libraries = ['places'];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayScreen, setDisplayScreen] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [sortRatings, setSortRatings] = useState(null);
  const [ selected, setSelected ] = useState({});
  const [ currentPosition, setCurrentPosition ] = useState(null);
  const [ service, setService ] = useState(null);
  const [ infoWindow, setInfoWindow ] = useState(null);
  const mapRef = useRef(null);
  const [ mapCenter, setMapCenter ] = useState(null);
  const [ map, setMap ] = useState()
  const [ locations, setLocations ] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-places-script',
    googleMapsApiKey: "AIzaSyDue_S6t9ybh_NqaeOJDkr1KC9a2ycUYuE",
    libraries
  })

  const onMarkerSelection = (place, map) => {
    updateSelected(place);
    console.log('selected this place on marker click', place)
    // const infoWindow = new window.google.maps.InfoWindow();
    // infoWindow.setContent(place.name);
    // infoWindow.open(map, this);

    // infoWindow.setContent(marker.getTitle());
    // infoWindow.open(marker.getMap(), marker);
  }

  const mapStyles = {        
    height: '526px',
    width: "100%",
    padding: '0px'
  };

  const getCurrentPosition = () => {
     // get user current position and save state
     navigator.geolocation.getCurrentPosition(position => {
      const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      setCurrentPosition(currentPosition);
      setMapCenter(currentPosition)
    });
  }

  const getRestaurantsByQuery = (currentPosition, service, query) => {
    let request = {
      location: currentPosition,
      radius: "2000", // meters
      type: 'restaurant', 
      query
    };
    service.textSearch(request, (results, status) => {
       if (status === "OK" && results) {
        setLocations(results);
        console.log('result[0]', results[0])
        // map is centered at first result
        setMapCenter(results[0].geometry.location);
      }
    });

  }

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    // initialize map, service, infoWindow
    if (mapRef.current && !map) {
      const m = new window.google.maps.Map(mapRef.current, {});
      setMap(m);
      if(!service) setService(new window.google.maps.places.PlacesService(m));
      if(!infoWindow) setInfoWindow(new window.google.maps.InfoWindow());
    }
  }, [mapRef, map]);

  useEffect(() => {
    if(currentPosition && service) {
      getRestaurantsByQuery(currentPosition, service, '')
    }
  }, [currentPosition, service])

  useEffect(() => {
    // set map, service, infoWindow to null on unmount
    return () => {
      setMap(null);
      setService(null);
      setInfoWindow(null);
    };
  }, [])


  const toggleModal = () => setShowModal(!showModal);


  const onSearch = (term) =>  {
    setSearchTerm(term);
  };

  useEffect(() => {
    if(!service) return;
    // debounce so query is sent after some time (.6s)
    const delayDebounceFn = setTimeout(() => {
      getRestaurantsByQuery(currentPosition, service, searchTerm)
    }, 600)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // ability to change screens on mobile only
  const onChangeScreen = (screenNumber) => {
    setDisplayScreen(screenNumber);
  }

  const updateSelected = (restaurant) => {
    console.log('update selected restaurant', restaurant);
    setSelected(restaurant);
    if(restaurant) {
      setMapCenter(restaurant.geometry.location);
    }
  }

  const resetSelected = () => {
    setSelected({});
    setActiveMarker(null);
  }

  const onSortRating = (event) => {
    event.preventDefault();
    const form = event;
    console.log('form', form);

    const val = "";
    
    setLocations((items) => {
      if(val === 'asc') {
        return items.sort((a, b) => a.rating - b.rating);
      } else if(val === 'desc') {
        return items.sort((a, b) => b.rating - a.rating);
      } else {
        return items
      }
    })
    toggleModal();
  }
  return (
    <Container className="app-container">
      <Row className="search-header">
        <Col xs={12} md={6}>
          <div className="site-info">
            <img src={logo} className="app-logo" alt="logo" />
            <span className="app-title"><span className="visually-hidden">AllTrails</span>  at Lunch</span>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="search-filter-container">
              {/* TODO: Button filters */}
              <Button variant="outline-secondary"className="filter-btn" onClick={toggleModal}>Filter</Button>
              <Modal show={showModal} onHide={toggleModal} size="sm">
                  <Form onSubmit={onSortRating}>
                    <div key={`default-radio`} className="mb-3">
                      <Form.Check 
                        type="radio"
                        id="ratings-high-low"
                        label="Ratings high to low"
                        name="sort-ratings"
                        aria-label="sort ratings high to low"
                      />

                      <Form.Check
                        type="radio"
                        label="Ratings low to high"
                        id="ratings-low-high"
                        name="sort-ratings"
                        aria-label="sort ratings low to high"
                      />
                    </div>
                    <Button variant="primary" type="submit">
                    Apply
                  </Button>
                </Form>
                 
              </Modal>
              {/* TODO: Icon in search bar */}
                      <Form.Label htmlFor="search-form" className="visually-hidden">Search for a restaurant</Form.Label>
                        <InputGroup>

                            <Form.Control
                              type="search"
                              id="search-form"
                              placeholder="Search for a restaurant"
                              value={searchTerm}
                              onChange={(e) => onSearch(e.target.value)}
                            />
                            <IoSearchSharp size="16px" color="#428815" />

                        </InputGroup>
     
            </div> 
        </Col>
      </Row>
      <Row>
        {/* TODO: Map Button and List button on mobile */}
        <Col xs={12} lg={4} className="px-0">
          <RestaurantList
            className={(displayScreen === 1) && 'd-xs-none'}
            locations={locations}
            onItemHoverIn={updateSelected}
            onItemHoverOut={resetSelected}
          >

          </RestaurantList>
        </Col>
        <Col xs={12} lg={8} className="px-0">
          {isLoaded && 
            <div className='map-container'>
              <GoogleMap
                className={(displayScreen === 0) && 'd-xs-none'}
                mapContainerStyle={mapStyles}
                zoom={13}
                center={mapCenter || currentPosition}
                ref={mapRef}
              >
                  {  
                    locations.map((item) => {
                      return (
                        <Marker 
                          key={item.place_id} 
                          position={{
                            lat: item.geometry.location.lat(),
                            lng: item.geometry.location.lng()
                          }}
                          onClick={(props, marker) => {
                            console.log('item on click', )
                            setSelected(item)
                            setActiveMarker(marker);
                          }}
                          onMouseOver={() => setSelected(item)}
                          onMouseOut={() => resetSelected()}
                          clickable={true}
                          visible={true}
                        />
                      )
                    })
                  }
                  {
                      selected.geometry && 
                      (
                        <InfoWindow
                          position={selected.geometry.location}
                          marker={activeMarker}
                          clickable={true}
                          onCloseClick={resetSelected}
                        >
                          <ListItem item={selected}></ListItem>
                        </InfoWindow>
                      )
                  }
              </GoogleMap>
          </div>
          } 
          </Col>
      </Row>
      <Button className="d-sm-none" onClick={() => onChangeScreen(1)}>Map</Button>
      <Button className="d-sm-none"onClick={() => onChangeScreen(0)}>List</Button>
    </Container>
 
  );
}

export default App;
