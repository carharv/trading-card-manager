// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import CardList, { Card } from "../components/CardList";
import { searchCards, updateCard, deleteCard } from "../services/cardService";
import "../styles/Home.css";

const Home: React.FC = () => {
  const initialSearchTerms = {
    year: "",
    player: "",
    addedDate: "",
    manufacturer: "",
    cardSet: "",
    subset: "",
    type: "",
    onCardCode: "",
    sport: "",
    tags: "",
    grade: "",
    pricePaid: "",
    marketPrice: "",
  };

  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50); // Default limit set to 50
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await searchForCards(1, limit);
  };

  const searchForCards = async (page = 1, newLimit = limit) => {
    try {
      setError(null);
      const searchTermsWithTagsArray = {
        ...searchTerms,
        tags: searchTerms.tags
          ? searchTerms.tags.split(",").map((tag) => tag.trim())
          : [],
      };
      const results = await searchCards(
        searchTermsWithTagsArray,
        page,
        newLimit,
        sortField,
        sortOrder
      );
      setSearchResults(results.data);
      setTotal(results.total);
      setPage(page);
      setLimit(newLimit);
      setSearched(true);
    } catch (error) {
      setError("Error searching cards");
      setSearched(false);
    }
  };

  const clearSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSearchTerms(initialSearchTerms);
    setSearchResults([]);
    setTotal(0);
    setSearched(false);
  };

  useEffect(() => {
    if (searched) {
      searchForCards(page, limit);
    }
  }, [page, sortField, sortOrder, limit]);

  const handlePageChange = (
    newPage: number,
    newLimit: number,
    field = sortField,
    order = sortOrder
  ) => {
    setPage(newPage);
    setLimit(newLimit);
    setSortField(field);
    setSortOrder(order);
    searchForCards(newPage, newLimit);
  };

  const handleUpdateCard = async (id: number, updatedCard: Partial<Card>) => {
    try {
      await updateCard(id.toString(), updatedCard);
      await searchForCards(page, limit);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (id: number) => {
    try {
      await deleteCard(id.toString());
      await searchForCards(page, limit);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchForCards();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms({ ...searchTerms, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h1>Search Your Card Collection</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Player</th>
              <th>Added Date</th>
              <th>Manufacturer</th>
              <th>Card Set</th>
              <th>Subset</th>
              <th>Type</th>
              <th>On Card Code</th>
              <th>Sport</th>
              <th>Tags</th>
              <th>Grade</th>
              <th>Price Paid</th>
              <th>Market Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="year"
                  value={searchTerms.year}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="player"
                  value={searchTerms.player}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="addedDate"
                  value={searchTerms.addedDate}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="MM/DD/YYYY"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="manufacturer"
                  value={searchTerms.manufacturer}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="cardSet"
                  value={searchTerms.cardSet}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="subset"
                  value={searchTerms.subset}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="type"
                  value={searchTerms.type}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="onCardCode"
                  value={searchTerms.onCardCode}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="sport"
                  value={searchTerms.sport}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="tags"
                  value={searchTerms.tags}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Tag1, Tag2, Tag3"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="grade"
                  value={searchTerms.grade}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="pricePaid"
                  value={searchTerms.pricePaid}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="marketPrice"
                  value={searchTerms.marketPrice}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearSearch}>Clear Search</button>
      </div>
      {error && <p>{error}</p>}
      {searched && searchResults.length === 0 && (
        <p>No cards found matching your search criteria.</p>
      )}
      {searched && searchResults.length > 0 && (
        <div className="card-list-container">
          <CardList
            cards={searchResults}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
