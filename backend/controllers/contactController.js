const Contact = require('../models/contact');

const createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message, carOfInterest } = req.body;
        
        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const contact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            message,
            carOfInterest
        });

        await contact.save();
        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (err) {
        console.error('Contact submission error:', err);
        res.status(500).json({ message: 'Error submitting contact form' });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error updating contact status' });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    updateContactStatus
};