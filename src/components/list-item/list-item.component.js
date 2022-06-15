import './list-item.component.css';
import { useEffect, useState } from 'react';
import { IoStarOutline, IoStar, IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import DefaultHikingImage from "../../assets/martis-trail.jpg";
import axios from 'axios';


const heartSize = '22px';

export function ListItem({name, image, numReviews, rating, description, priceLevel}) {
  const [favorite, setFavorite] = useState(false);

  const onHeartToggle = () => {
    setFavorite((prevFavState) => !prevFavState);
  };

  const FavoriteHeart = (isFav) => {
    if(isFav) {
      return (<IoHeartSharp size={heartSize} color={'#428815'} onClick={onHeartToggle}/>)
    } else {
      return (<IoHeartOutline size={heartSize} onClick={onHeartToggle}/>)
    }
  }

  const StarRating = (avgRating, numReviews) => {
    const highestRating = 5;
    const starSize = '14px';
    return (
      <>
        <div className="star-rating">
          {[...Array(highestRating)].map((star, index) => {        
            if (index < avgRating) {
              return (<IoStar key={`filled-star-${index}`} size={starSize} className="icon-spacing" />)
            } else {
              return (<IoStarOutline key={`outline-star${index}`} size={starSize} className="icon-spacing" />)
            }
          })}
          <span className="restaurant-details">({numReviews.toString()})</span>
        </div>
        
      </>
    );
  };

  return (
    <div className="restaurant-list-item">
      <div className="image-container">
        <img src={image ? image.getUrl({maxWidth: 65, maxHeight: 65}) : DefaultHikingImage} alt={name} className="restaurant-image" />
      </div>
      <div className="restaurant-details-container">
          <p className="restaurant-title">{name}</p>
          <div className="reviews-container">
            {StarRating(rating, numReviews)}
          </div>
          <p className="restaurant-details">
            <span>{Array(priceLevel).fill('$')}</span> &bull; <span>{description}</span>
          </p>
        </div>  
        <div className="favorites-container">
          {FavoriteHeart(favorite)}
        </div>
  </div>
  );
}