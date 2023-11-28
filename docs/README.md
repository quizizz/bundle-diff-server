# Project Architecture

Project has been structured to support large complex code bases. For simpler use cases, it is advised to avoid applying architectural design pattern and stick with what gets the work done.

## Core Ideas

Before diving into the project architecture, please go through core ideas that have inspired the implementation below.

1. Inversion of Control (IoC)

   - SOLID: Dependency inversion principle
   - Martin Fowler: [Inversion of Control](https://martinfowler.com/bliki/InversionOfControl.html)
   - Baeldung: [Dependency Inversion Principle](https://www.baeldung.com/cs/dip)
   - Wikipedia: [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

2. Layered Architecture

   - O'Reilly [Layered Architecture](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)
   - Martin Fowler

     - [Service Layer](https://martinfowler.com/eaaCatalog/serviceLayer.html)
     - [Repository Layer](https://martinfowler.com/eaaCatalog/repository.html)
       - [Data Mapper](https://www.martinfowler.com/eaaCatalog/dataMapper.html) vs [Active Record](https://www.martinfowler.com/eaaCatalog/activeRecord.html)
       - [Why at Quizizz we prefer Data Mappers over Active Record](https://stackoverflow.com/questions/3828265/is-data-mapper-a-more-modern-trend-than-active-record)

   - Stack Exchange
     - [How essential is it to make a service layer?](https://softwareengineering.stackexchange.com/questions/162399/how-essential-is-it-to-make-a-service-layer)

3. [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)

## Key Technologies

1. [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).
2. [Inversify](https://inversify.io/) for Dependency Injection.
3. [Express](https://expressjs.com/) for handling HTTP requests.

It is worthwhile to mention here that JavaScript supports something called Prototypal Inheritence, which is based on the concept of prototypes, which are objects that serve as a blueprint for creating new objects or extending existing ones. Prototypal inheritence is quite flexible, and classes are a syntactic sugar added on top of it. As a general operating principle, we only use classes in singleton scopes to bind similar behavior together and use functional programming wherever possible.

## Architecture

We are using Inversify to create a IoC container uses a class constructor to identify and inject its dependencies.

- `src/main.ts`: Creates an IoC container and runs the application.
- `src/app`

  - `src/app/app.ts`
    - Interface for any application that main.ts can run
    - App can be anything, for example HTTP REST based webserver or kafka/sqs worker or grpc client. It must implement the `App` interface.
  - `src/app/http.app.ts`: An HTTP implementation for the App interface, which uses express.js as a server. As all the controllers are decoupled as we will see later, it is trivial to remove express with any other server library.
  - `src/app/kafka.app.ts`: Similar to HTTP app. Similarly there can be GRPC app as well.
  - `src/app/factory.app.ts`: Factory to create new apps.

- `src/bootstrap`

  - `src/bootstrap/resources`
    - Contains all boot time resources. They must implement the `Resources` interface.
    - Ideal candidates for the resources are things like database connections, external service connections.
    - You cannot use `Config` values in the constructor as the load operation happens after the creation of container. Please make a PR to add this functionality. All values are available in the load values.
  - `src/bootstrap/bootstrap.ts`
    - We can register all the required resources which can then be concurrently loaded. It supports any resource which implements the `Resource` interface.
      If we need to load a group of resource in sequence, please create a Resource abstraction over them.
  - `src/bootstrap/secrets-manager.ts`
    - Loads all secrets into memory when the `bootstrap.load` function in invoked.

- `src/controllers`

  - Controller handle incoming requests from different agents.
  - All controllers are expected to implement the `BaseController` defined in `src/controllers/base.controller.ts` which is not tied to any protocol. This decoupling is intentional, which serves two purposes:
    - Same controller can be reused between protocol. For example, a controller which handles real time http requests can also be tied to a queue based asynchronous worker action if required.
    - It is easy to switch protocols. While most of our services currently rely on HTTP, we may want to switch to grpc or something similar in the future.
  - `src/controllers/http.controller.ts`
    - Helps convert any base controller implementation into http based controller. Similarly we can have `kafka.controller.ts` or `grpc.controller.ts`.
  - `src/controllers/factory.controller.ts`
    - Contains functional methods to convert a base controller into given type.

- `src/routes`
  - Contains all exposed endpoints. Interfaces with the `App`.
  - `src/routes/http`
    - After creating your controller, if we want to expose it via an http endpoint - we do it in this file.
    - Controllers are decoupled from routes and their versioning. For example, we can expose same controller with different middlewares in different routes.
