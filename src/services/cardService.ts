// src/services/cardService.ts
import axios from "axios";

const API_URL = "http://localhost:5001";
//const API_URL = "http://192.168.1.170:5001";

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
  pricePaid?: number | null;
  marketPrice?: number | null;
}

interface SearchTerms {
  year: string;
  player: string;
  addedDate: string;
  manufacturer: string;
  cardSet: string;
  subset?: string;
  type: string;
  onCardCode: string;
  sport: string;
  tags: string[];
  grade?: string;
  pricePaid?: string;
  marketPrice?: string;
}

export const getCards = async (
  page = 1,
  limit = 10,
  sortField = "id",
  sortOrder = "ASC"
) => {
  const response = await axios.get(`${API_URL}/cards`, {
    params: { page, limit, sortField, sortOrder },
  });
  console.log("API Response:", response.data);
  return response.data;
};

export const addCard = async (card: any) => {
  const response = await axios.post(`${API_URL}/cards`, card);
  return response.data;
};

export const updateCard = async (id: string, card: any) => {
  console.log("Updating Card ID:", id);
  console.log("Payload:", card);
  const response = await axios.put(`${API_URL}/cards/${id}`, card);
  console.log("Update Response:", response.data);
  return response.data;
};

export const deleteCard = async (id: string) => {
  await axios.delete(`${API_URL}/cards/${id}`);
};

export const searchCards = async (
  searchTerms: SearchTerms,
  page = 1,
  limit = 10,
  sortField = "id",
  sortOrder = "ASC"
) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { ...searchTerms, page, limit, sortField, sortOrder },
  });
  console.log("Search Response:", response.data);
  return response.data;
};
