const express = require('express');
const router = express.Router();
const { sendSubscriptionEmail } = require('../module/mailer');

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }

        const emailSent = await sendSubscriptionEmail(email);
        
        if (emailSent) {
            res.json({ success: true, message: 'Subscription successful! Please check your inbox.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send confirmation email' });
        }
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;