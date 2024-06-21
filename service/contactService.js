const Contact = require('../models/contact');
const { Sequelize } = require('sequelize');

const findOrCreateContact = async ({ email, phoneNumber }) => {
  let contact = await Contact.findOne({
    where: {
      [Sequelize.Op.or]: [
        { email },
        { phoneNumber }
      ]
    }
  });

  if (!contact) {
    contact = await Contact.create({ email, phoneNumber });
  } else {
    // Logic to handle linking of contacts
  }

  return contact;
};

module.exports = {
  findOrCreateContact
};

