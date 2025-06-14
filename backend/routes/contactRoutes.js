const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');

router.post('/contact', createContact);
router.get('/contacts', getAllContacts);
router.put('/contacts/:id', updateContactStatus);

module.exports = router;