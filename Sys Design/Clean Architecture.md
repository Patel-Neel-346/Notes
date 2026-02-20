![[Pasted image 20240709191934.png]]
### Infra Layer
- External Service Integrations:
    - API clients for third-party services
    - Payment gateway integrations
    - Email service implementations
- File System Operations:
    - File storage services
    - Document management systems
- Caching Mechanisms:
    - Redis or Memcached implementations
    - In-memory caching services
- Messaging Systems:
    - Message queue implementations (e.g., RabbitMQ, Kafka)
    - Pub/sub systems
- Logging and Monitoring:
    - Logging implementations
    - Error tracking services
    - Performance monitoring tools
- Authentication and Authorization:
    - JWT token handlers
    - OAuth implementations
    - Role-based access control (RBAC) implementations
- Configuration Management:
    - Environment-specific configuration loaders
    - Feature flag services
- Security:
    - Encryption/decryption services
    - Hashing services
- Web-related Components:
    - HTTP clients
    - WebSocket implementations
- ORM and Database Migrations:
    - ORM configurations
    - Database migration scripts and tools
- Search Engine Integrations:
    - Elasticsearch clients
    - Algolia or other search service implementations
- Job Scheduling:
    - Cron job implementations
    - Task scheduling services
- Dependency Injection Containers:
    - IoC container configurations
- Data Serialization/Deserialization:
    - JSON/XML parsers and serializers
- External Device Integrations:
    - IoT device communication layers
    - Hardware interfacing components
- Localization and Internationalization:
    - Language translation services
    - Currency conversion services
- Geographic Services:
    - Geocoding implementations
    - Map service integrations
- Machine Learning Model Serving:
    - ML model deployment and serving infrastructure
- Blockchain Integrations:
    - Cryptocurrency wallet integrations
    - Smart contract interaction layers
- Cloud Service Integrations:
    - AWS/Azure/GCP service clients
    - Cloud storage adapters
	
Remember, the key principle is that these components in the infrastructure layer should implement interfaces defined in the application layer, allowing the core business logic to remain decoupled from specific implementations. This approach maintains the flexibility to change or replace these components without affecting the business logic.
##### Example
```ts
// app/interfaces/IEmailService.ts
export interface IEmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendTemplatedEmail(to: string, templateId: string, data: any): Promise<void>;
}
```

```ts
// infra/services/SendGridEmailService.ts
import { IEmailService } from '../../app/interfaces/IEmailService';
import sendgrid from '@sendgrid/mail';

export class SendGridEmailService implements IEmailService {
  constructor(apiKey: string) {
    sendgrid.setApiKey(apiKey);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await sendgrid.send({
      to,
      from: 'your-verified-sender@example.com',
      subject,
      text: body,
    });
  }

  async sendTemplatedEmail(to: string, templateId: string, data: any): Promise<void> {
    await sendgrid.send({
      to,
      from: 'your-verified-sender@example.com',
      templateId,
      dynamicTemplateData: data,
    });
  }
}
```

```ts
// app/services/UserService.ts
import { injectable, inject } from 'inversify';
import { IEmailService } from '../interfaces/IEmailService';

@injectable()
export class UserService {
  constructor(
    @inject('IEmailService') private emailService: IEmailService
  ) {}

  async registerUser(email: string, name: string): Promise<void> {
    // User registration logic...

    await this.emailService.sendTemplatedEmail(
      email,
      'welcome-template-id',
      { name }
    );
  }
}
```

```ts
// infra/ioc/container.ts
import { Container } from 'inversify';
import { IEmailService } from '../../app/interfaces/IEmailService';
import { SendGridEmailService } from '../services/SendGridEmailService';

const container = new Container();

container.bind<IEmailService>('IEmailService').to(SendGridEmailService);

export { container };
```

### Presentation Layer
1. Controllers:
    - API Controllers (for REST APIs)
    - GraphQL Resolvers (if using GraphQL)
    - WebSocket handlers
2. View Models / DTOs (Data Transfer Objects):
    - Objects that shape the data specifically for presentation purposes
3. Request/Response Models:
    - Structures that define the shape of incoming requests and outgoing responses
4. Middleware (in web applications):
    - Authentication middleware
    - Logging middleware
    - Error handling middleware
5. Input Validation:
    - Request validation logic
    - Input sanitization
6. Serialization/Deserialization:
    - JSON serialization/deserialization
    - XML parsing (if needed)
7. API Documentation:
    - Swagger/OpenAPI specifications
    - API documentation generation
8. View Templates (for server-rendered applications):
    - HTML templates
    - Template engines configuration
9. Presenters (in MVP architecture):
    - Classes that format data for specific views
10. Route Definitions:
    - URL route mappings to controllers/handlers
11. API Versioning:
    - Version-specific controllers or route prefixes
12. Response Formatting:
    - Consistent response envelope structuring
    - HTTP status code management
13. Cross-Cutting Concerns:
    - CORS configuration
    - Rate limiting
    - Caching headers
14. Dependency Injection Setup (for presentation-specific dependencies):
    - Controller registrations
    - Middleware registrations
15. Health Check Endpoints:
    - Simple endpoints for monitoring application health
16. Static File Serving (if applicable):
    - Configuration for serving static assets
17. WebSocket Event Handlers (if using WebSockets):
    - WebSocket connection management
    - Real-time event handling
18. GraphQL Schema Definitions (if using GraphQL):
    - Type definitions
    - Query and mutation definitions
19. Validation Decorators (in frameworks that support them):
    - Input validation decorators for controller methods
20. Pagination Logic:
    - Handling of page numbers, limits, and offsets in list endpoints

Remember, the presentation layer should be as thin as possible, primarily responsible for:

- Accepting input (HTTP requests, WebSocket messages, etc.)
- Calling the appropriate **use case** or **application service**
- Returning the result in the appropriate format
##### What to do when one layer is trying to depend on other
```ts
// infra/db/models/UserModel.ts
import { prop } from "@typegoose/typegoose";

export class UserModel {
  @prop()
  name: string;

  @prop()
  email: string;
}

// presentation/schemas/UserSchema.ts
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class UserSchema {
  @Field()
  name: string;

  @Field()
  email: string;
}
```

 creating a shared folder inside which all of the shared logic present
```ts
// shared/models/User.ts 
import { prop } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  @prop()
  name: string;

  @Field()
  @prop()
  email: string;
}
```

### Application layer
```txt
src/
├── domain/
│   ├── entities/
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   └── value-objects/
├── application/
│   ├── interfaces/
│   │   ├── repositories/
│   │   │   ├── IOrderRepository.ts
│   │   │   ├── IProductRepository.ts
│   │   │   └── IUserRepository.ts
│   │   └── services/
│   │       ├── IOrderService.ts
│   │       ├── IProductService.ts
│   │       └── IUserService.ts
│   ├── use-cases/
│   │   ├── order/
│   │   │   ├── CreateOrderUseCase.ts
│   │   │   └── GetOrderUseCase.ts
│   │   ├── product/
│   │   └── user/
│   └── services/
│       ├── OrderService.ts
│       ├── ProductService.ts
│       └── UserService.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── MongoOrderRepository.ts
│   │   ├── MongoProductRepository.ts
│   │   └── MongoUserRepository.ts
│   └── ...
└── presentation/
    └── ...
```
---
#### Clean Architecture in GO
```txt
go-social/
├── cmd/
│   ├── api/
│   │   └── main.go                 # API server entry point
│   ├── worker/
│   │   └── main.go                 # Background worker entry point
│   └── migrate/
│       └── main.go                 # Database migration tool
├── internal/
│   ├── domain/                     # Enterprise Business Rules (Entities)
│   │   ├── user.go
│   │   ├── post.go
│   │   ├── comment.go
│   │   └── errors.go
│   ├── usecase/                    # Application Business Rules (Use Cases)
│   │   ├── interfaces/
│   │   │   ├── repositories.go     # Repository interfaces
│   │   │   └── services.go         # External service interfaces
│   │   ├── user/
│   │   │   ├── create_user.go
│   │   │   ├── get_user.go
│   │   │   └── update_user.go
│   │   ├── post/
│   │   │   ├── create_post.go
│   │   │   ├── get_posts.go
│   │   │   └── delete_post.go
│   │   └── auth/
│   │       ├── login.go
│   │       ├── register.go
│   │       └── refresh_token.go
│   ├── adapter/                    # Interface Adapters
│   │   ├── handler/                # HTTP handlers (Controllers)
│   │   │   ├── rest/
│   │   │   │   ├── user_handler.go
│   │   │   │   ├── post_handler.go
│   │   │   │   ├── auth_handler.go
│   │   │   │   └── middleware.go
│   │   │   └── graphql/
│   │   │       ├── resolver.go
│   │   │       └── schema.go
│   │   ├── repository/             # Data access implementations
│   │   │   ├── postgres/
│   │   │   │   ├── user_repository.go
│   │   │   │   ├── post_repository.go
│   │   │   │   └── queries.sql.go  # sqlc generated
│   │   │   ├── redis/
│   │   │   │   └── cache_repository.go
│   │   │   └── memory/
│   │   │       └── user_repository.go
│   │   └── service/                # External service implementations
│   │       ├── email/
│   │       │   ├── smtp.go
│   │       │   └── sendgrid.go
│   │       ├── storage/
│   │       │   ├── s3.go
│   │       │   └── local.go
│   │       └── notification/
│   │           └── firebase.go
│   ├── infrastructure/             # Frameworks & Drivers
│   │   ├── database/
│   │   │   ├── postgres.go
│   │   │   └── redis.go
│   │   ├── server/
│   │   │   ├── http.go
│   │   │   ├── grpc.go
│   │   │   └── routes.go
│   │   ├── config/
│   │   │   └── config.go
│   │   └── logger/
│   │       └── logger.go
│   └── pkg/                        # Shared utilities
│       ├── auth/
│       │   ├── jwt.go
│       │   └── password.go
│       ├── validation/
│       │   └── validator.go
│       ├── response/
│       │   └── response.go
│       └── utils/
│           ├── time.go
│           └── strings.go
├── db/
│   ├── migrations/
│   │   ├── 000001_create_users.up.sql
│   │   ├── 000001_create_users.down.sql
│   │   ├── 000002_create_posts.up.sql
│   │   └── 000002_create_posts.down.sql
│   ├── queries/
│   │   ├── users.sql
│   │   └── posts.sql
│   └── seeds/
│       └── seed.sql
├── api/
│   ├── openapi/
│   │   └── swagger.yaml
│   └── proto/
│       └── user.proto
├── configs/
│   ├── config.yaml
│   ├── config.dev.yaml
│   └── config.prod.yaml
├── deployments/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── k8s/
│       ├── deployment.yaml
│       └── service.yaml
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   └── deploy.sh
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
├── tests/
│   ├── integration/
│   │   ├── user_test.go
│   │   └── post_test.go
│   ├── e2e/
│   │   └── api_test.go
│   └── fixtures/
│       └── users.json
├── .env
├── .env.example
├── .gitignore
├── go.mod
├── go.sum
├── Makefile
├── README.md
└── sqlc.yaml
```

