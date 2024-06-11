// src/pages/CardListPage.tsx
import React, { useEffect, useState } from "react";
import CardList, { Card } from "../components/CardList";
import { getCards, updateCard, deleteCard } from "../services/cardService";
import "../styles/CardListPage.css";

const CardListPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await getCards(page, limit);
        setCards(response.data);
        setTotal(response.total);
      } catch (error) {
        setError("Error fetching cards");
      }
    };

    fetchCards();
  }, [page, limit]);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const response = await getCards(newPage, limit);
    setCards(response.data);
    setTotal(response.total);
  };

  const handleUpdateCard = async (id: number, updatedCard: Partial<Card>) => {
    try {
      await updateCard(id.toString(), updatedCard);
      const response = await getCards(page, limit);
      setCards(response.data);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (id: number) => {
    try {
      await deleteCard(id.toString());
      const response = await getCards(page, limit);
      setCards(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div className="card-list-container">
        <CardList
          cards={cards}
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        />
      </div>
    </div>
  );
};

export default CardListPage;
