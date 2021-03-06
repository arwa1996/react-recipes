import React from "react";
import { Link } from "react-router-dom";
const SearchItem = ({ _id, name, likes }) => (
  <li key={_id}>
    <Link to={`/recipes/${_id}`}>
      <h4>{name}</h4>
    </Link>
    <p>{likes}</p>
  </li>
);

export default SearchItem;
