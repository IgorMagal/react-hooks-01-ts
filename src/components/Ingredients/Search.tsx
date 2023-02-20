import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";
import Iingredient from "../../models/IngredientModel";

const Search: React.FC<{
  ingredientsList: Iingredient[];
  onFilterChange: (ingredientsList: Iingredient[]) => void;
}> = React.memo((props) => {
  const [filteredText, setFilteredText] = useState("");

  useEffect(() => {
    const filteredList = props.ingredientsList.filter((e) =>
      e.name.toLowerCase().match(filteredText.toLowerCase())
    );

    props.onFilterChange(filteredList);

    console.log("filteredList " + filteredList.map((e) => e.name));
  }, [filteredText, props.ingredientsList, props]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={filteredText}
            onChange={(e) => setFilteredText(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
