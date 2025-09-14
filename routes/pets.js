const express = require('express');
const multer = require('multer');
const PetController = require('../controllers/petController');
const { 
  petCreateSchema, 
  petUpdateSchema, 
  validateSchema 
} = require('../schemas/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Pet routes
router.get('/', PetController.getAllPets);
router.get('/search', PetController.searchPets);
router.get('/:id', PetController.getPetById);
router.post('/', upload.single('photo'), validateSchema(petCreateSchema), PetController.createPet);
router.put('/:id', upload.single('photo'), validateSchema(petUpdateSchema), PetController.updatePet);
router.delete('/:id', PetController.deletePet);

module.exports = router;
