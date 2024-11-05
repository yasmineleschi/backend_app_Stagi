
const Institution = require('../Models/Institution');

const getFilteredInstitutions = async (req, res) => {
  try {
    const searchQuery = req.query.name || ''; 

    const institutions = await Institution.find({
      name: { $regex: `^${searchQuery}`, $options: 'i' } 
    }).limit(10); 

    res.json(institutions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
};


const addInstitution = async (req, res) => {
  try {
    const { name } = req.body; 

    if (!name) {
      return res.status(400).json({ error: 'Institution name is required' });
    }

    const newInstitution = new Institution({ name });

    await newInstitution.save(); 

    res.status(201).json(newInstitution); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to add institution' });
  }
};

module.exports = { getFilteredInstitutions, addInstitution };
