const express = require("express");
const cors = require("cors");
const db = require("./models");
const { Op } = require("sequelize");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

db.sequelize.sync().then(() => {
  console.log("Database synchronized");
});

app.get("/cards", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const cards = await db.Card.findAndCountAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
    res.json({
      data: cards.rows,
      total: cards.count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/cards", async (req, res) => {
  try {
    const newCard = await db.Card.create(req.body);
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/cards/:id", async (req, res) => {
  try {
    const updatedCard = await db.Card.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    res.json(updatedCard[1][0]);
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(400).json({ error: error.message });
  }
});

app.delete("/cards/:id", async (req, res) => {
  try {
    await db.Card.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/search", async (req, res) => {
  const {
    year,
    player,
    addedDate,
    manufacturer,
    cardSet,
    subset,
    type,
    onCardCode,
    sport,
    tags,
    grade,
    pricePaid,
    marketPrice,
    quantity,
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const query = {};

    if (year) query.year = { [Op.eq]: year };
    if (player) query.player = { [Op.iLike]: `%${player}%` };
    if (addedDate) {
      const startDate = new Date(addedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(addedDate);
      endDate.setHours(23, 59, 59, 999);
      query.addedDate = { [Op.between]: [startDate, endDate] };
    }
    if (manufacturer) query.manufacturer = { [Op.iLike]: `%${manufacturer}%` };
    if (cardSet) query.cardSet = { [Op.iLike]: `%${cardSet}%` };
    if (subset) query.subset = { [Op.iLike]: `%${subset}%` };
    if (type) query.type = { [Op.iLike]: `%${type}%` };
    if (onCardCode) query.onCardCode = { [Op.iLike]: `%${onCardCode}%` };
    if (sport) query.sport = { [Op.iLike]: `%${sport}%` };
    if (tags) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
      query.tags = { [Op.overlap]: tagsArray };
    }
    if (grade) query.grade = { [Op.iLike]: `%${grade}%` };
    if (pricePaid) query.pricePaid = { [Op.eq]: pricePaid };
    if (marketPrice) query.marketPrice = { [Op.eq]: marketPrice };
    if (quantity) query.quantity = { [Op.eq]: quantity };

    const cards = await db.Card.findAndCountAll({
      where: query,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
    res.json({
      data: cards.rows,
      total: cards.count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  } catch (error) {
    console.error("Error searching cards:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
