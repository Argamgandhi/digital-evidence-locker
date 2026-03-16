const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false,
});

const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName:    { type: DataTypes.STRING, allowNull: false },
  lastName:     { type: DataTypes.STRING, allowNull: false },
  email:        { type: DataTypes.STRING, allowNull: false, unique: true },
  password:     { type: DataTypes.STRING, allowNull: false },
  dob:          { type: DataTypes.STRING },
  phone:        { type: DataTypes.STRING },
  organisation: { type: DataTypes.STRING },
  userType:     { type: DataTypes.STRING, defaultValue: 'personal' },
  // userType: 'personal' | 'professional' | 'organization' | 'verification_authority'
});

const Upload = sequelize.define('Upload', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  fileName:    { type: DataTypes.STRING, allowNull: false },
  fileHash:    { type: DataTypes.STRING, allowNull: false, unique: true },
  ipfsCID:     { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  txHash:      { type: DataTypes.STRING },
  fileSize:    { type: DataTypes.STRING },
  uploadedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Upload, { foreignKey: 'userId' });
Upload.belongsTo(User, { foreignKey: 'userId' });

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced!');
};

module.exports = { sequelize, User, Upload, syncDB };