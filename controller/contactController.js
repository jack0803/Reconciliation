const contactService = require('../service/contactService');

const identifyContact = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        const contact = await contactService.identifyContact({ email, phoneNumber });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    identifyContact
};
