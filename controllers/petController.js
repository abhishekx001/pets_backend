const Pet = require('../models/Pet');
const { 
  uploadFileToStorage, 
  generateFileName, 
  sendSuccessResponse, 
  sendErrorResponse 
} = require('../utils/helpers');

class PetController {
  // Get all pets for authenticated user
  static async getAllPets(req, res) {
    try {
      const userId = req.user.userId;
      const pets = await Pet.findAllByUserId(userId);

      return sendSuccessResponse(res, pets, 'Pets retrieved successfully');

    } catch (error) {
      console.error('Get pets error:', error);
      return sendErrorResponse(res, 'Failed to retrieve pets');
    }
  }

  // Get single pet by ID
  static async getPetById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const pet = await Pet.findById(id, userId);
      if (!pet) {
        return sendErrorResponse(res, 'Pet not found', 404);
      }

      return sendSuccessResponse(res, pet, 'Pet retrieved successfully');

    } catch (error) {
      console.error('Get pet error:', error);
      return sendErrorResponse(res, 'Failed to retrieve pet');
    }
  }

  // Create new pet
  static async createPet(req, res) {
    try {
      const { name, breed, owner_name, phone, photo_url: urlPhoto } = req.body;
      const userId = req.user.userId;

      let photo_url = null;

      // Handle file upload if provided
      if (req.file) {
        const fileName = generateFileName(req.file.originalname);
        photo_url = await uploadFileToStorage(req.file, fileName);
      } else if (urlPhoto && urlPhoto.trim()) {
        // Use provided URL
        photo_url = urlPhoto.trim();
      }

      // Create pet
      const newPet = await Pet.create({
        name,
        breed,
        owner_name,
        phone,
        photo_url,
        user_id: userId
      });

      return sendSuccessResponse(res, newPet, 'Pet created successfully', 201);

    } catch (error) {
      console.error('Create pet error:', error);
      return sendErrorResponse(res, 'Failed to create pet');
    }
  }

  // Update pet
  static async updatePet(req, res) {
    try {
      const { id } = req.params;
      const { name, breed, owner_name, phone, photo_url: urlPhoto } = req.body;
      const userId = req.user.userId;

      // Check if pet exists and belongs to user
      const existingPet = await Pet.findById(id, userId);
      if (!existingPet) {
        return sendErrorResponse(res, 'Pet not found', 404);
      }

      let photo_url = existingPet.photo_url;

      // Handle file upload if provided
      if (req.file) {
        const fileName = generateFileName(req.file.originalname);
        photo_url = await uploadFileToStorage(req.file, fileName);
      } else if (urlPhoto !== undefined) {
        // Update with new URL (can be empty string to remove photo)
        photo_url = urlPhoto ? urlPhoto.trim() : null;
      }

      // Update pet
      const updatedPet = await Pet.update(id, userId, {
        name,
        breed,
        owner_name,
        phone,
        photo_url
      });

      return sendSuccessResponse(res, updatedPet, 'Pet updated successfully');

    } catch (error) {
      console.error('Update pet error:', error);
      return sendErrorResponse(res, 'Failed to update pet');
    }
  }

  // Delete pet
  static async deletePet(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check if pet exists and belongs to user
      const petExists = await Pet.exists(id, userId);
      if (!petExists) {
        return sendErrorResponse(res, 'Pet not found', 404);
      }

      // Delete pet
      await Pet.delete(id, userId);

      return sendSuccessResponse(res, null, 'Pet deleted successfully');

    } catch (error) {
      console.error('Delete pet error:', error);
      return sendErrorResponse(res, 'Failed to delete pet');
    }
  }

  // Search pets by name or breed
  static async searchPets(req, res) {
    try {
      const { q } = req.query;
      const userId = req.user.userId;

      if (!q || q.trim().length === 0) {
        return sendErrorResponse(res, 'Search query is required', 400);
      }

      // This would require a custom query in Supabase
      // For now, we'll get all pets and filter in memory
      const allPets = await Pet.findAllByUserId(userId);
      const filteredPets = allPets.filter(pet => 
        pet.name.toLowerCase().includes(q.toLowerCase()) ||
        pet.breed.toLowerCase().includes(q.toLowerCase()) ||
        pet.owner_name.toLowerCase().includes(q.toLowerCase())
      );

      return sendSuccessResponse(res, filteredPets, 'Search completed successfully');

    } catch (error) {
      console.error('Search pets error:', error);
      return sendErrorResponse(res, 'Failed to search pets');
    }
  }
}

module.exports = PetController;
