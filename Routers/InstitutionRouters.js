const express = require('express');
const { getFilteredInstitutions , addInstitution } = require('../Controllers/InstitutionControllers'); 

const router = express.Router();


router.get('/getinstitutions', getFilteredInstitutions); 
router.post('/add', addInstitution); 

module.exports = router;
