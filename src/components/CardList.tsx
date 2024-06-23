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
  onPageChange: (
    page: number,
    limit: number,
    sortField?: string,
    sortOrder?: string
  ) => void;
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
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string | undefined>("ASC");
  const [limitInput, setLimitInput] = useState<number>(limit); // Default limit
  const [pageInput, setPageInput] = useState<number>(page); // Page input for jumping to any page

  useEffect(() => {
    onPageChange(
      1,
      Math.max(limitInput, 10),
      sortField,
      sortOrder || undefined
    ); // Reset to first page when limit changes
  }, [limitInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value !== "" ? value : null,
    }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitInput(isNaN(newLimit) ? 10 : newLimit);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value, 10);
    setPageInput(isNaN(newPage) ? 1 : newPage);
  };

  const handlePageJump = () => {
    if (pageInput >= 1 && pageInput <= totalPages) {
      onPageChange(
        pageInput,
        Math.max(limitInput, 10),
        sortField,
        sortOrder || undefined
      );
    }
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

  const handleSort = (field: string) => {
    let order: string | null;
    if (sortField === field) {
      if (sortOrder === "ASC") {
        order = "DESC";
      } else if (sortOrder === "DESC") {
        order = null;
      } else {
        order = "ASC";
      }
    } else {
      order = "ASC";
    }
    setSortField(order ? field : "");
    setSortOrder(order || undefined);
    onPageChange(page, limitInput, order ? field : "", order || undefined);
  };

  const renderSortArrow = (field: string) => {
    if (sortField === field) {
      if (sortOrder === "ASC") {
        return " ↑";
      } else if (sortOrder === "DESC") {
        return " ↓";
      }
    }
    return "";
  };

  const totalPages = Math.ceil(total / limit);

  const getPageNumbers = () => {
    const startPage = Math.max(page - 2, 1);
    const endPage = Math.min(startPage + 4, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="card-list-container">
      <h1>Card List</h1>
      <div className="card-info">
        <p className="number-cards-returned">
          Number of Cards Returned: {total}
        </p>
        <div className="limit-input">
          <label htmlFor="limit">Show</label>
          <input
            type="number"
            id="limit"
            value={limitInput}
            onChange={handleLimitChange}
            min="10"
          />
          <label htmlFor="limit" id="cardsPerPage">
            cards per page
          </label>
        </div>
      </div>
      <table className="card-table">
        <thead>
          <tr>
            <th>Select</th>
            <th onClick={() => handleSort("year")}>
              Year {renderSortArrow("year")}
            </th>
            <th onClick={() => handleSort("player")}>
              Player {renderSortArrow("player")}
            </th>
            <th onClick={() => handleSort("addedDate")}>
              Added Date {renderSortArrow("addedDate")}
            </th>
            <th onClick={() => handleSort("manufacturer")}>
              Manufacturer {renderSortArrow("manufacturer")}
            </th>
            <th onClick={() => handleSort("cardSet")}>
              Set {renderSortArrow("cardSet")}
            </th>
            <th onClick={() => handleSort("subset")}>
              Subset {renderSortArrow("subset")}
            </th>
            <th onClick={() => handleSort("type")}>
              Type {renderSortArrow("type")}
            </th>
            <th onClick={() => handleSort("onCardCode")}>
              On Card Code {renderSortArrow("onCardCode")}
            </th>
            <th onClick={() => handleSort("sport")}>
              Sport {renderSortArrow("sport")}
            </th>
            <th onClick={() => handleSort("tags")}>
              Tags {renderSortArrow("tags")}
            </th>
            <th onClick={() => handleSort("grade")}>
              Grade {renderSortArrow("grade")}
            </th>
            <th>Notes</th>
            <th onClick={() => handleSort("pricePaid")}>
              Price Paid {renderSortArrow("pricePaid")}
            </th>
            <th onClick={() => handleSort("marketPrice")}>
              Market Price {renderSortArrow("marketPrice")}
            </th>
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
        <button
          onClick={() =>
            onPageChange(1, limit, sortField, sortOrder || undefined)
          }
          disabled={page === 1}
          className="underline"
        >
          &laquo;
        </button>
        <button
          onClick={() =>
            onPageChange(page - 1, limit, sortField, sortOrder || undefined)
          }
          disabled={page === 1}
        >
          &lt;
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() =>
              onPageChange(pageNumber, limit, sortField, sortOrder || undefined)
            }
            className={pageNumber === page ? "active" : ""}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() =>
            onPageChange(page + 1, limit, sortField, sortOrder || undefined)
          }
          disabled={page * limit >= total}
        >
          &gt;
        </button>
        <button
          onClick={() =>
            onPageChange(totalPages, limit, sortField, sortOrder || undefined)
          }
          disabled={page === totalPages}
          className="underline"
        >
          &raquo;
        </button>
        <div className="page-info">
          Page {page} of {totalPages}
        </div>
        <div className="page-jump">
          <input
            type="number"
            value={pageInput}
            onChange={handlePageInputChange}
            min="1"
            max={totalPages}
          />
          <button onClick={handlePageJump}>Go</button>
        </div>
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
