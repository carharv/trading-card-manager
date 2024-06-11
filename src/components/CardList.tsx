// src/components/CardList.tsx
import React, { useState, useEffect } from "react";
import "../styles/CardList.css"; // Import the CSS file

export interface Card {
  id: number;
  year: number;
  player: string;
  addedDate: string;
  manufacturer: string;
  cardSet: string;
  subset?: string;
  type: string;
  onCardCode: string;
  sport: string;
  tags?: string[];
  grade?: string;
  notes?: string;
  pricePaid?: number | null;
  marketPrice?: number | null;
}

interface CardListProps {
  cards: Card[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onUpdateCard: (id: number, updatedCard: Partial<Card>) => void;
  onDeleteCard: (id: number) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  total,
  page,
  limit,
  onPageChange,
  onUpdateCard,
  onDeleteCard,
}) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [form, setForm] = useState<Partial<Card>>({
    year: undefined,
    player: "",
    manufacturer: "",
    cardSet: "",
    subset: "",
    type: "",
    onCardCode: "",
    sport: "",
    tags: [],
    grade: "",
    notes: "",
    pricePaid: null,
    marketPrice: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  useEffect(() => {
    if (editingCard) {
      setForm({
        ...editingCard,
        pricePaid:
          editingCard.pricePaid !== undefined ? editingCard.pricePaid : null,
        marketPrice:
          editingCard.marketPrice !== undefined
            ? editingCard.marketPrice
            : null,
      });
    }
  }, [editingCard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value !== "" ? value : null,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.year || isNaN(Number(form.year.toString()))) {
      newErrors.year = "Year is required and must be a valid number";
    }
    if (!form.player) {
      newErrors.player = "Player is required";
    }
    if (!form.manufacturer) {
      newErrors.manufacturer = "Manufacturer is required";
    }
    if (!form.cardSet) {
      newErrors.cardSet = "Set is required";
    }
    if (!form.type) {
      newErrors.type = "Type is required";
    }
    if (!form.onCardCode) {
      newErrors.onCardCode = "On Card Code is required";
    }
    if (!form.sport) {
      newErrors.sport = "Sport is required";
    }
    if (
      form.pricePaid !== undefined &&
      form.pricePaid !== null &&
      (isNaN(Number(form.pricePaid.toString())) ||
        form.pricePaid.toString().trim() === "")
    ) {
      newErrors.pricePaid = "Price Paid must be a valid number";
    }
    if (
      form.marketPrice !== undefined &&
      form.marketPrice !== null &&
      (isNaN(Number(form.marketPrice.toString())) ||
        form.marketPrice.toString().trim() === "")
    ) {
      newErrors.marketPrice = "Market Price must be a valid number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      if (editingCard) {
        try {
          await onUpdateCard(editingCard.id, form);
          setEditingCard(null);
          setForm({
            year: undefined,
            player: "",
            manufacturer: "",
            cardSet: "",
            subset: "",
            type: "",
            onCardCode: "",
            sport: "",
            tags: [],
            grade: "",
            notes: "",
            pricePaid: null,
            marketPrice: null,
          });
        } catch (error) {
          console.error("Error updating card:", error);
        }
      }
    }
  };

  const handleCancel = () => {
    setEditingCard(null);
    setForm({
      year: undefined,
      player: "",
      manufacturer: "",
      cardSet: "",
      subset: "",
      type: "",
      onCardCode: "",
      sport: "",
      tags: [],
      grade: "",
      notes: "",
      pricePaid: null,
      marketPrice: null,
    });
    setErrors({});
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await onDeleteCard(id);
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm("Are you sure you want to delete selected cards?")) {
      try {
        const deletePromises = Array.from(selectedCards).map((id) =>
          onDeleteCard(id)
        );
        await Promise.all(deletePromises);
        setSelectedCards(new Set());
      } catch (error) {
        console.error("Error deleting cards:", error);
      }
    }
  };

  const handleSelectCard = (id: number) => {
    setSelectedCards((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleExpandNote = (note: string) => {
    setExpandedNote(note);
  };

  const handleCloseOverlay = () => {
    setExpandedNote(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1>Card List</h1>
      <p>Number of Cards Returned: {total}</p>
      <table className="card-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Year</th>
            <th>Player</th>
            <th>Added Date</th>
            <th>Manufacturer</th>
            <th>Set</th>
            <th>Subset</th>
            <th>Type</th>
            <th>On Card Code</th>
            <th>Sport</th>
            <th>Tags</th>
            <th>Grade</th>
            <th>Notes</th>
            <th>Price Paid</th>
            <th>Market Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.length > 0 ? (
            cards.map((card) => (
              <tr key={card.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCards.has(card.id)}
                    onChange={() => handleSelectCard(card.id)}
                  />
                </td>
                {editingCard && editingCard.id === card.id ? (
                  <>
                    <td>
                      <input
                        type="number"
                        name="year"
                        value={form.year || ""}
                        onChange={handleChange}
                      />
                      {errors.year && (
                        <span className="error">{errors.year}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="player"
                        value={form.player || ""}
                        onChange={handleChange}
                      />
                      {errors.player && (
                        <span className="error">{errors.player}</span>
                      )}
                    </td>
                    <td>{new Date(card.addedDate).toLocaleDateString()}</td>
                    <td>
                      <input
                        type="text"
                        name="manufacturer"
                        value={form.manufacturer || ""}
                        onChange={handleChange}
                      />
                      {errors.manufacturer && (
                        <span className="error">{errors.manufacturer}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="cardSet"
                        value={form.cardSet || ""}
                        onChange={handleChange}
                      />
                      {errors.cardSet && (
                        <span className="error">{errors.cardSet}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="subset"
                        value={form.subset || ""}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="type"
                        value={form.type || ""}
                        onChange={handleChange}
                      />
                      {errors.type && (
                        <span className="error">{errors.type}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="onCardCode"
                        value={form.onCardCode || ""}
                        onChange={handleChange}
                      />
                      {errors.onCardCode && (
                        <span className="error">{errors.onCardCode}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="sport"
                        value={form.sport || ""}
                        onChange={handleChange}
                      />
                      {errors.sport && (
                        <span className="error">{errors.sport}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="tags"
                        value={form.tags?.join(", ") || ""}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="grade"
                        value={form.grade || ""}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="notes"
                        value={form.notes || ""}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="pricePaid"
                        value={form.pricePaid || ""}
                        onChange={handleChange}
                      />
                      {errors.pricePaid && (
                        <span className="error">{errors.pricePaid}</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        name="marketPrice"
                        value={form.marketPrice || ""}
                        onChange={handleChange}
                      />
                      {errors.marketPrice && (
                        <span className="error">{errors.marketPrice}</span>
                      )}
                    </td>
                    <td>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{card.year}</td>
                    <td>{card.player}</td>
                    <td>{new Date(card.addedDate).toLocaleDateString()}</td>
                    <td>{card.manufacturer}</td>
                    <td>{card.cardSet}</td>
                    <td>{card.subset}</td>
                    <td>{card.type}</td>
                    <td>{card.onCardCode}</td>
                    <td>{card.sport}</td>
                    <td>{card.tags?.join(", ")}</td>
                    <td>{card.grade}</td>
                    <td>
                      {card.notes ? (
                        <span
                          className="note-snippet"
                          onClick={() => handleExpandNote(card.notes!)}
                        >
                          {card.notes.length > 30
                            ? `${card.notes.substring(0, 30)}...`
                            : card.notes}
                        </span>
                      ) : (
                        <span>No notes</span>
                      )}
                    </td>
                    <td>{card.pricePaid?.toFixed(2)}</td>
                    <td>{card.marketPrice?.toFixed(2)}</td>
                    <td>
                      <button onClick={() => setEditingCard(card)}>Edit</button>
                      <button onClick={() => handleDelete(card.id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={15}>No cards available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="bulk-actions">
        <button onClick={handleBulkDelete} disabled={selectedCards.size === 0}>
          Delete Selected
        </button>
      </div>
      <div className="pagination">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page * limit >= total}
        >
          Next
        </button>
      </div>
      {expandedNote && (
        <div className="overlay" onClick={handleCloseOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-overlay" onClick={handleCloseOverlay}>
              &times;
            </span>
            <p>{expandedNote}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;
