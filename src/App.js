import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, InputGroup } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader, Marker, InfoWindowF } from '@react-google-maps/api';
import { IoSearchSharp, IoListOutline, IoLocationOutline } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import './App.css';
import { RestaurantList } from './components/restaurant-list/restaurant-list.component';
import { ListItem } from './components/list-item/list-item.component';
import logo from './assets/logo.svg';


// https://developers.google.com/maps/documentation/javascript/react-map
// Google recommends installing this library https://www.npmjs.com/package/@react-google-maps/api for React app
// Docs: https://react-google-maps-api-docs.netlify.app/ 

const libraries = ['places'];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayScreen, setDisplayScreen] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const [sortRatings, setSortRatings] = useState(null);
  const [ selected, setSelected ] = useState({});
  const [ currentPosition, setCurrentPosition ] = useState(null);
  const [ service, setService ] = useState(null);
  
  const mapRef = useRef(null);
  const sortAscRef = useRef(null);
  const sortDescRef = useRef(null);
  const [ mapCenter, setMapCenter ] = useState(null);
  const [ map, setMap ] = useState()
  const [ locations, setLocations ] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-places-script',
    googleMapsApiKey: "AIzaSyDue_S6t9ybh_NqaeOJDkr1KC9a2ycUYuE",
    libraries
  })

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
      query,
      fields: ['name', 'price_level', 'formatted_address', 'geometry', 'user_ratings_total', 'rating']
    };
    service.textSearch(request, (results, status) => {
       if (status === "OK" && results) {
        setLocations(results);
        // map is centered at first search result
        setMapCenter(results[0].geometry.location);
      }
    })
  }

  const goToDetailsUrl = (placeId) => {
    let request = {
      placeId,
      fields: ['url']
    };
    try {
      service.getDetails(request, (place, status) => {
        if (status === "OK" && place) {
          const {url} = place;
          if(url) window.open(url, '_blank');
        }
      })
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    // initialize map and service
    if (isLoaded && mapRef.current && !map) {
      const m = new window.google.maps.Map(mapRef.current, {});
      setMap(m);
      if(!service) setService(new window.google.maps.places.PlacesService(m));
    }
  }, [mapRef, map, isLoaded]);

  useEffect(() => {
    if(currentPosition && service) {
      getRestaurantsByQuery(currentPosition, service, '')
    }
  }, [currentPosition, service])

  useEffect(() => {
    // set map and service to null on unmount
    return () => {
      setMap(null);
      setService(null);
    };
  }, [])

  const toggleModal = () => setShowModal(!showModal);

  const onSearch = (term) =>  {
    setSearchTerm(term);
  };

  useEffect(() => {
    if(!service) return;
    // debounce so query is sent after some time (.6s) (reduces requests that are not intentional searches)
    const delayDebounceFn = setTimeout(() => {
      getRestaurantsByQuery(currentPosition, service, searchTerm)
    }, 600)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // toggle between map screen and list screen
  // ability to change screens on mobile only using buttons
  const onToggleScreen = () => {
    const newScreen = displayScreen === 0 ? 1 : 0;
    setDisplayScreen(newScreen);
  }

  const updateSelected = (restaurant) => {
    setSelected(restaurant);
    if(restaurant) {
      setMapCenter(restaurant.geometry.location);
    }
  }

  const resetSelected = () => {
    setSelected({});
  }

  const onSortRating = (event) => {
    const isDesc = event.target[0].checked;
    const isAsc = event.target[1].checked;
    event.preventDefault();

    if(isAsc) {
      setSortRatings("asc");
    } else if (isDesc) {
      setSortRatings("desc")
    }
    
    setLocations((items) => {
      if(isDesc) {
        return items.sort((a, b) => b.rating - a.rating);
      } else if(isAsc) {
        return items.sort((a, b) => a.rating - b.rating);
      } else {
        return items
      }
    })
    toggleModal();
  }

  return (
    <Container fluid className="app-container">
      <Row className="search-header">
        <Col xs={12} md={6}>
          <div className="site-info">
            <img src={logo} className="app-logo" alt="logo" />
            <span className="app-title"><span className="visually-hidden">AllTrails</span>  at Lunch</span>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="search-filter-container">
              {/* Filter button displays modal that sorts the restaurants by rating */}
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
                      ref={sortAscRef}
                      value={sortRatings === 'desc'}
                    />
                    <Form.Check
                      type="radio"
                      label="Ratings low to high"
                      id="ratings-low-high"
                      name="sort-ratings"
                      aria-label="sort ratings low to high"
                      ref={sortDescRef}
                      value={sortRatings === 'asc'}
                    />
                  </div>
                  <div class="align-right">
                    <Button variant="link" type="submit">
                      Apply
                    </Button>
                  </div>
                  
                </Form>
                 
              </Modal>
              {/* Searches restaurant results by search term */}
              <Form.Label htmlFor="search-form" className="visually-hidden">Search for a restaurant</Form.Label>
              <InputGroup  className="form-control search-input-group">
                  <Form.Control
                    className="no-borders"
                    type="search"
                    id="search-form"
                    placeholder="Search for a restaurant"
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                    <IoSearchSharp size="16px" color="#428815" className="search-icon" />
              </InputGroup>
            </div> 
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} lg={4} className="px-0">
          <div className={(displayScreen === 1) ? 'mobile-hide' : ''}>
            <RestaurantList
              locations={locations}
              onItemClick={goToDetailsUrl}
              onItemHoverIn={updateSelected}
              onItemHoverOut={resetSelected}
            >
          </RestaurantList>
          </div>
        </Col>
        <Col xs={12} md={6} lg={8} className="px-0">
          <div className={`map-container ${(displayScreen === 0) ? 'mobile-hide' : ''}`}>
            {isLoaded && 
              <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={mapCenter || currentPosition}
                ref={mapRef}
              >
                  {  
                    locations.map((item) => (
                        <Marker 
                          key={item.place_id} 
                          position={{
                            lat: item.geometry.location.lat(),
                            lng: item.geometry.location.lng()
                          }}
                          onMouseOver={() => {
                            setSelected(item);
                          }}
                          clickable={true}
                          visible={true}
                        >
                          {
                            selected.geometry && (selected.place_id === item.place_id) &&
                            (
                              <InfoWindowF
                                onCloseClick={resetSelected}
                                position={selected.geometry.location}
                              >
                                <ListItem item={selected} onClick={() => goToDetailsUrl(item.place_id)}></ListItem>
                              </InfoWindowF>
                            )
                          } 
                          </Marker>
                      ))
                  }
              </GoogleMap>
            }
            { loadError && (
              <p>Yikes! Looks like we're having technical difficulties loading the map. Please forgive us!</p>
            )}
          </div>
        </Col>
      </Row>

      {/* Map and List buttons only displayed on mobile to toggle back and forth between map and list in small width devices */}
      {displayScreen === 0 ? (
        <Button
          className="mobile-button d-sm-none" 
          onClick={() => onToggleScreen()}>
            <IoLocationOutline className="button-icon" size="20px" />
            Map
          </Button>
      ) : (
        <Button
          className="mobile-button d-sm-none "
          onClick={() => onToggleScreen()}>
            <IoListOutline className="button-icon" size="20px"  />
            List
        </Button>
      )}
      
    </Container>
  );
}

export default App;
