# KADIMAR ERP Backend

A Spring Boot REST API backend for the KADIMAR Construction Management System.

## Features

- **RESTful APIs** for Contact and Communication management
- **PostgreSQL** database integration
- **CORS** configuration for frontend integration
- **Validation** and error handling
- **Modular architecture** (Controller, Service, Repository, Model)
- **Test endpoints** for verification

## Technology Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**

## Project Structure

```
src/main/java/com/kadimar/erp/
├── ErpBackendApplication.java     # Main application class
├── config/
│   └── CorsConfig.java           # CORS configuration
├── controller/
│   ├── ContactController.java    # Contact REST endpoints
│   ├── CommunicationController.java # Communication REST endpoints
│   └── TestController.java       # Test/health endpoints
├── service/
│   ├── ContactService.java       # Contact business logic
│   └── CommunicationService.java # Communication business logic
├── repository/
│   ├── ContactRepository.java    # Contact data access
│   └── CommunicationRepository.java # Communication data access
├── model/
│   ├── Contact.java             # Contact entity
│   ├── Communication.java       # Communication entity
│   ├── ContactCategory.java     # Contact category enum
│   ├── ContactStatus.java       # Contact status enum
│   └── CommunicationType.java   # Communication type enum
└── exception/
    └── GlobalExceptionHandler.java # Global error handling
```

## Setup Instructions

### 1. Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL database

### 2. Database Configuration

Update `src/main/resources/application.properties` with your PostgreSQL credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kadimar_erp
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Test Endpoints

- `GET /api/test/health` - Health check
- `GET /api/test/database` - Database connectivity test
- `GET /api/test/cors` - CORS configuration test
- `POST /api/test/echo` - Echo test for POST requests
- `GET /api/test/info` - System information

### Contact Endpoints

- `GET /api/contacts` - Get all contacts (with optional filters)
- `GET /api/contacts/{id}` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact
- `GET /api/contacts/search?q={query}` - Search contacts
- `GET /api/contacts/stats` - Get contact statistics

### Communication Endpoints

- `GET /api/communications` - Get all communications
- `GET /api/communications/{id}` - Get communication by ID
- `GET /api/communications/contact/{contactId}` - Get communications for a contact
- `POST /api/communications` - Create new communication
- `POST /api/communications/contact/{contactId}` - Create communication for specific contact
- `PUT /api/communications/{id}` - Update communication
- `DELETE /api/communications/{id}` - Delete communication
- `GET /api/communications/stats` - Get communication statistics

## Testing

### 1. Health Check

```bash
curl http://localhost:8080/api/test/health
```

### 2. Database Connectivity

```bash
curl http://localhost:8080/api/test/database
```

### 3. CORS Test

```bash
curl http://localhost:8080/api/test/cors
```

### 4. Create a Contact

```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "company": "ACME Corp",
    "category": "CLIENT",
    "status": "ACTIVE"
  }'
```

### 5. Get All Contacts

```bash
curl http://localhost:8080/api/contacts
```

### 6. Frontend Integration Test

From your frontend (running on localhost:3000 or localhost:3001):

```javascript
// Test CORS and basic connectivity
fetch('http://localhost:8080/api/test/health')
  .then(response => response.json())
  .then(data => console.log('Backend health:', data))
  .catch(error => console.error('Error:', error));

// Test creating a contact
fetch('http://localhost:8080/api/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    company: 'Tech Solutions',
    category: 'PROSPECT',
    status: 'ACTIVE'
  })
})
.then(response => response.json())
.then(data => console.log('Created contact:', data))
.catch(error => console.error('Error:', error));
```

## Database Schema

The application will automatically create the following tables:

- `contacts` - Contact information
- `communications` - Communication records linked to contacts

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:3001`

Allowed methods: GET, POST, PUT, DELETE, OPTIONS

## Error Handling

The API includes comprehensive error handling with:
- Validation error responses
- Custom exception handling
- Structured error messages with timestamps

## Development Notes

- The application uses JPA with Hibernate for ORM
- Database schema is auto-updated on startup
- All endpoints include proper HTTP status codes
- Request/response logging is enabled for debugging

## Troubleshooting

1. **Database Connection Issues**: Verify PostgreSQL is running and credentials are correct
2. **CORS Errors**: Ensure frontend is running on allowed origins (localhost:3000 or localhost:3001)
3. **Port Conflicts**: Change server.port in application.properties if 8080 is in use
4. **Build Issues**: Ensure Java 17+ and Maven are properly installed

## Next Steps

1. Test all endpoints with your frontend
2. Configure your Neon PostgreSQL connection
3. Add authentication/authorization if needed
4. Implement additional business logic as required