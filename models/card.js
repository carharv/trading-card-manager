// models/card.js
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define("Card", {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardSet: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subset: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    onCardCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sport: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pricePaid: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    marketPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return Card;
};
