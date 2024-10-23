const Institution = require('../Models/Institution');


const getFilteredInstitutions = async (req, res) => {
  try {
    const searchQuery = req.query.name || ''; 

    
    const institutions = await Institution.find({
      name: { $regex: `^${searchQuery}` }
    }).limit(10); 

    res.json(institutions); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
};


module.exports = { getFilteredInstitutions };
