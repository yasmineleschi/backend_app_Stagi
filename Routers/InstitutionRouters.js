const express = require('express');
const { getFilteredInstitutions } = require('../Controllers/InstitutionControllers'); 

const router = express.Router();


router.get('/getinstitutions', getFilteredInstitutions); 


module.exports = router;
