const Contact = require('../models/contact');
const { Op } = require('sequelize');

const identifyContact = async ({ email, phoneNumber }) => {
    // Find existing contacts by email or phoneNumber
    const contacts = await Contact.findAll({
        where: {
            [Op.or]: [
                { email },
                { phoneNumber }
            ]
        }
    });

    let primaryContact = null;
    let secondaryContacts = [];

    //if no contacts found then create a new primary contact
    if (contacts.length > 0) {
        // take the parent(with smaller id) primary contact that exist with the linkPrecedence as primary otherwise take the first contact as primary contact
        primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary') || contacts[0];
        console.log(primaryContact);
        // if there is no any primary contact then need to update first secondary contact as primary contact 
        primaryContact.linkPrecedence = 'primary';
        await primaryContact.save();

        // set all other contacts as secondary contacts which id is not equal to primary contact id
        secondaryContacts = contacts.filter(contact => contact.id !== primaryContact.id);

    
        //find a pair for email or phoneNumber that is not already in the database 
        const isEmailNew = email && !contacts.some(contact => contact.email === email);
        const isPhoneNumberNew = phoneNumber && !contacts.some(contact => contact.phoneNumber === phoneNumber);

        if (isEmailNew || isPhoneNumberNew) {
            const newContact = await Contact.create({
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary'
            });
            secondaryContacts.push(newContact);
        }

        // Ensure all secondary contacts are correctly linked
        for (const contact of secondaryContacts) {
            contact.linkedId = primaryContact.id;
            contact.linkPrecedence = 'secondary';
            await contact.save();
        }
    } else {
        // If an incoming request has either of phoneNumber or email common to an existing contact but contains new information, the service will create a “secondary” Contact row.
        primaryContact = await Contact.create({ email, phoneNumber, linkPrecedence: 'primary' });
    }

    // Get all updated contacts with the same email or phoneNumber
    const relatedContacts = await Contact.findAll({
        where: {
            [Op.or]: [
                { email },
                { phoneNumber },
                { linkedId: primaryContact.id }
            ]
        }
    });

    // Extract emails, phone numbers, and secondary contact IDs for the response
    const emails = [...new Set(relatedContacts.map(contact => contact.email).filter(Boolean))];
    const phoneNumbers = [...new Set(relatedContacts.map(contact => contact.phoneNumber).filter(Boolean))];
    const secondaryContactIds = relatedContacts.filter(contact => contact.linkPrecedence === 'secondary').map(contact => contact.id);

    return {
        contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    };
};

module.exports = {
    identifyContact
};
