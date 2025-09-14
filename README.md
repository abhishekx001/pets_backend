# Pet Manager Backend

A well-structured Express.js backend for the Pet Manager application following MVC architecture with proper separation of concerns.

## 🏗️ Project Structure

```
backend/
├── config/
│   ├── index.js          # Configuration management
│   └── supabase.js       # Supabase client configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   └── petController.js  # Pet management logic
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   ├── User.js           # User database operations
│   └── Pet.js            # Pet database operations
├── routes/
│   ├── auth.js           # Authentication routes
│   └── pets.js           # Pet management routes
├── schemas/
│   └── validation.js      # Joi validation schemas
├── utils/
│   └── helpers.js         # Utility functions
├── server.js              # Main server file
└── package.json
```

## 🚀 Features

### Architecture
- **MVC Pattern**: Clear separation of Models, Views (Controllers), and Routes
- **Middleware**: JWT authentication and request validation
- **Schema Validation**: Joi-based input validation
- **Error Handling**: Centralized error handling with consistent responses
- **Configuration Management**: Environment-based configuration

### Authentication
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- User profile management

### Pet Management
- Full CRUD operations for pets
- File upload for pet photos
- Search functionality
- Data validation and sanitization

### Database Integration
- Supabase integration for database operations
- Row Level Security (RLS) policies
- File storage for pet photos
- Proper error handling for database operations

## 📋 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)

### Pet Routes (`/api/pets`) - All Protected
- `GET /` - Get all pets for authenticated user
- `GET /search?q=query` - Search pets by name, breed, or owner
- `GET /:id` - Get single pet by ID
- `POST /` - Create new pet (with optional photo upload)
- `PUT /:id` - Update pet (with optional photo upload)
- `DELETE /:id` - Delete pet

### Health Check
- `GET /api/health` - Server health check

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=24h

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup
Run the SQL queries provided in the main README to set up your Supabase database.

### 4. Start Development Server
```bash
npm run dev
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if implemented)

### Code Structure

#### Controllers
Controllers handle the business logic and coordinate between models and responses:

```javascript
// Example controller method
static async createPet(req, res) {
  try {
    const { name, breed, owner_name, phone } = req.body;
    const userId = req.user.userId;
    
    // Business logic here
    const newPet = await Pet.create({...});
    
    return sendSuccessResponse(res, newPet, 'Pet created successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, 'Failed to create pet');
  }
}
```

#### Models
Models handle all database operations:

```javascript
// Example model method
static async create(petData) {
  const { data, error } = await supabase
    .from('pets')
    .insert([petData])
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data;
}
```

#### Schemas
Joi schemas for input validation:

```javascript
const petCreateSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  breed: Joi.string().min(1).max(100).required(),
  // ... other fields
});
```

#### Middleware
Authentication and validation middleware:

```javascript
const authenticateToken = (req, res, next) => {
  // JWT verification logic
};
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Joi schema validation
- **File Upload Security**: File type and size validation
- **CORS Configuration**: Configurable cross-origin requests
- **Error Handling**: No sensitive information in error responses

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-jwt-secret
SUPABASE_URL=https://your-production-supabase-url
SUPABASE_ANON_KEY=your-production-supabase-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build and Deploy
1. Set up production environment variables
2. Deploy to your hosting platform (Heroku, Railway, etc.)
3. Ensure CORS is configured for your frontend domain
4. Test all endpoints in production

## 🧪 Testing

### Manual Testing
Use tools like Postman or curl to test endpoints:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Notes

- All pet data is isolated per user through Supabase RLS policies
- Photos are stored in Supabase Storage with public access
- JWT tokens expire after 24 hours (configurable)
- File uploads are limited to 5MB per image
- The application follows RESTful API conventions
- Error handling is centralized and consistent
