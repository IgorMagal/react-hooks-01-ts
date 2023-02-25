import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";
import Iingredient from "../../models/IngredientModel";

const Search: React.FC<{
  onFilterIngredients: (ingredients: Iingredient[]) => void;
  setLoadingstate: (state: boolean) => void;
}> = React.memo((props) => {
  const [filteredText, setFilteredText] = useState("");
  const { onFilterIngredients, setLoadingstate } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (filteredText === inputRef.current?.value) {
        setLoadingstate(true);
        fetch(
          "https://react-http-reqs-f9475-default-rtdb.firebaseio.com/ingredients.json",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const loadedIngredients: Iingredient[] = [];
            for (const key in data) {
              loadedIngredients.push({
                id: key,
                name: data[key].name,
                amount: data[key].amount,
              });
            }

            filteredText !== ""
              ? onFilterIngredients(
                  loadedIngredients.filter((i) =>
                    i.name.toLowerCase().includes(filteredText.toLowerCase())
                  )
                )
              : onFilterIngredients(loadedIngredients);
            setLoadingstate(false);
          });
      }
    }, 600);
    return () => clearTimeout(t);
  }, [filteredText, onFilterIngredients, inputRef, setLoadingstate]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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
