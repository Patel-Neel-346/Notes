A software design approach in which a monolith is designed with a emphasis on interchangeable (and potentially reusable) modules.
#### Module
A module represents a cohesive set of functionalities
#### High Cohesion
All the related functionlaty to the business logic is grouped together.
#### Module Communication
Module monolith are loosely coupled by design.
Module only communicate through a public API.
	- Method Calls 
	- Messaging (could be an in memory event bus)
