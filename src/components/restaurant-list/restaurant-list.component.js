
import './restaurant-list.component.css';
import { ListItem } from '../list-item/list-item.component';


function RestaurantList({locations, onItemHoverIn, onItemHoverOut}) {
  return (
    <div className="restaurant-list-container">
      {locations.map((item) => (
        <div className="restaurant-list-border" key={`${item.place_id}-wrapper`} >
          <ListItem 
            key={item.place_id}
            item={item}
            displayFavorite={true}
            onHoverIn={onItemHoverIn}
            onHoverOut={onItemHoverOut}
          />
        </div>
      ))}
     
    </div>
  );
}

export { RestaurantList };
