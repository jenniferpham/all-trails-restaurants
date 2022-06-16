import './list-item.component.css';
import { useState } from 'react';
import { IoStarOutline, IoStar, IoStarHalf, IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import DefaultHikingImage from "../../assets/martis-trail.jpg";


const heartSize = '22px';

export function ListItem({item = {}, onHoverIn, onHoverOut, displayFavorite}) {
  const [favorite, setFavorite] = useState(false);
  const {name, rating, photos, user_ratings_total: numReviews, formatted_address: description, geometry, price_level: priceLevel} = item;
  const image = photos ? photos[0] : null;

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

  // shows filled stars, half star, and empty star based on average rating
  const StarRating = (avgRating, numReviews) => {
    const highestRating = 5;
    const starSize = '14px';

    // Ex: Rating 4.3 rounded to 4.5, 1.2 rounded to 1
    const roundedRating = Math.round(avgRating*2)/2;
    const numFullStars = Math.floor(roundedRating);
    // if roundedRating remainder is 0.5, then numHalfStars will be 1
    const numHalfStars = (roundedRating % 1 === 0.5) ? 1 : 0;

    return (
      <div className="star-rating">
        {[...Array(highestRating)].map((star, index) => {        
          if (index < numFullStars) {
            return (<IoStar key={`filled-star-${index}`} size={starSize} className="icon-spacing" />)
          } else if (index < (numFullStars + numHalfStars)) {
            return (<IoStarHalf key={`outline-star${index}`} size={starSize} className="icon-spacing" />)
          } else {
            return (<IoStarOutline key={`outline-star${index}`} size={starSize} className="icon-spacing" />)
          }
        })}
        <span className="restaurant-details">({numReviews.toString()})</span>
      </div>
    );
  };

  return (
    <div 
      className="restaurant-list-item"
      onMouseEnter={() => {
        if(onHoverIn) onHoverIn(item)
      }}
      onMouseLeave={() => {
        if(onHoverOut) onHoverOut();
      }}
      onClick={() => {
        // TODO: link to google places page
      }}
    >
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
        { displayFavorite && 
          <div className="favorites-container">
            {FavoriteHeart(favorite)}
          </div>
        }
      
  </div>
  );
}