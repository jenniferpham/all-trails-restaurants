import { useState } from 'react';
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import './restaurant-list.component.css';
import { ListItem } from '../list-item/list-item.component';


function RestaurantList({locations, onItemClick, onItemHoverIn, onItemHoverOut}) {
  const [favorites, setFavorites] = useState(new Set());

  const heartSize = '22px';

  const onFavoriteClick = (placeId) => {
    // toggle favorites
    const newFavorites = new Set(favorites);
    if(favorites.has(placeId)) {
      newFavorites.delete(placeId);
    } else {
      newFavorites.add(placeId);
    }

    setFavorites(newFavorites);
  }

  const FavoriteHeart = ({isFavorite, onClick}) => {
    if(isFavorite) {
      return (<IoHeartSharp size={heartSize} color={'#428815'} onClick={onClick}/>)
    } else {
      return (<IoHeartOutline size={heartSize} onClick={onClick}/>)
    }
  }

  return (
    <div className="restaurant-list-container">
      {locations.map((item) => (
        <div className="restaurant-list-border" key={`${item.place_id}-wrapper`} >
          <ListItem 
            key={item.place_id}
            item={item}
            onHoverIn={onItemHoverIn}
            onHoverOut={onItemHoverOut}
            onClick={() =>{
              if(onItemClick) onItemClick(item.place_id)
            }}
          >
            <div className="favorites-container">
              <FavoriteHeart isFavorite={favorites.has(item.place_id)} onClick={() => onFavoriteClick(item.place_id)} />
            </div>
          </ListItem>
        </div>
      ))}
     
    </div>
  );
}

export { RestaurantList };
