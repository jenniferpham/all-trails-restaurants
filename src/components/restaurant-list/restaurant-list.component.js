
import './restaurant-list.component.css';
import { ListItem } from '../list-item/list-item.component';


function RestaurantList({locations}) {
  return (
    <div className="restaurant-list-container">
      {locations.map((item) => (
        <ListItem 
          name={item.name} 
          key={item.place_id} 
          image={item.photos ? item.photos[0] : null} 
          rating={item.rating} 
          numReviews={item.user_ratings_total} 
          description={item.formatted_address}
          priceLevel={item.price_level}
        />
      ))}
     
    </div>
  );
}

export { RestaurantList };
