const contactService = require('../service/contactService');

const createOrUpdateContact = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const contact = await contactService.findOrCreateContact({ email, phoneNumber });
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrUpdateContact
};