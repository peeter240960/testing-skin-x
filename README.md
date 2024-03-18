### Project Name: Skin-x blogs testing

#### Description:
This project is a backend system for managing blogs. It provides functionalities for creating, reading, updating, and deleting blog posts. It utilizes technologies such as Fastify for building GraphQL APIs, Prisma for database management, and various other tools for testing and development.

#### Setup Instructions:
1. **Installation**: Ensure you have Node.js (version >=20.11.0) and Yarn installed on your system.
2. **Clone Repository**: Clone this repository to your local machine.
3. **Install Dependencies**: Run `yarn install` to install all required dependencies.
4. **Environment Setup**: Set up environment variables for sensitive information such as database credentials and JWT secrets.
5. **Database Migration**: Run `yarn setup:database` to apply database migrations and seed initial data.
6. **Build and Run**: 
   - For development: Run `yarn dev` to start both frontend and backend servers in development mode.
   - For production: Run `yarn build` to build both frontend and backend for production.
   
#### Available Scripts:

- **Development**:
  - `yarn blogs:dev`: Serve the frontend application for blogs.
  - `yarn backend:dev`: Serve the backend in development mode.
  
- **Testing**:
  - `yarn backend:test`: Run tests for the backend.

- **Building**:
  - `yarn blogs:build`: Build the frontend for production.
  - `yarn backend:build`: Build the backend for production.
  - `yarn build`: Build both frontend and backend for production.
  
- **Docker**:
  - `yarn blogs:build-docker`: Build Docker image for the frontend.
  - `yarn backend:build-docker`: Build Docker image for the backend.
  
- **Database Management**:
  - `yarn db-primary:pull`: Pull the database schema.
  - `yarn db-primary:reset`: Reset the database migrations.
  - `yarn db-primary:migrate`: Run database migrations in development mode.
  - `yarn db-primary:deploy`: Deploy database migrations.
  - `yarn db-primary:generate`: Generate Prisma client.
  - `yarn db-primary:seed`: Seed the database with initial data.
  - `yarn db-primary:studio`: Open Prisma Studio for visual database management.
  
- **Code Generation**:
  - `yarn codegen`: Generate TypeScript types from GraphQL schema.
  - `yarn codegen-client`: Generate TypeScript types and React Apollo hooks from GraphQL schema.

- **Other**:
  - `yarn genql`: Generate GraphQL queries and mutations.
  - `yarn setup:backend`: Set up backend environment including dependency installation, database setup, and code generation.

#### Development and Deployment Steps:

**Option 1: Setup Project Backend for Local Development**

- `yarn setup:backend` Install dependencies and generate type for GraphQL and Prisma
- `docker compose up db-primary cache -d` Run database container
- `yarn setup:database` Migrate and seed data to database
- `yarn backend:dev` Start server backend
- After backend server started  
    - New terminal -> `yarn backend:test` run test backend service

**Setup project blogs(frontend) for dev on local**

- `yarn` Install dependencies
- `yarn codegen-client` Generate for Apollo client
- `yarn blogs:dev` Start server blogs
- After blogs server started  —> http://localhost:4200

**Option 2: Using Projects with Docker Compose**

- `yarn setup:backend`
- `yarn codegen-client`
- `yarn build`
- `docker compose up -d`
- `yarn setup:database`
- `yarn backend:test`
- Go to http://localhost:4200

**Option 3: Setup 2 Projects for Dev on Local**

- `docker compose up db-primary cache -d`
- `yarn setup:backend`
- `yarn codegen-client`
- `yarn setup:database`
- `yarn dev` Start server many project blogs and backend
- Go to http://localhost:4200

#### Technologies Used:
- **Backend Framework**: Fastify
- **Database ORM**: Prisma
- **GraphQL Tools**: Apollo Client, GraphQL Code Generator
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Argon2
- **Testing Frameworks**: Jest, Testing Library
- **Frontend Framework**: React
- **UI Libraries**: MUI, Framer Motion, React Helmet Async
- **State Management**: Jotai
- **Routing**: React Router DOM
- **Development Tools**: TypeScript, ESLint, Prettier, Vite

#### Folder Structure:
- `prisma/`: Contains database schema and migration files.
- `apps/backend`: Backend source code.
- `apps/blogs`: Frontend source code.
- `libs/`: Development library shared between apps.
- `tools/`: Development tools and scripts.

#### Contribution Guidelines:
- Fork the repository and create a new branch for your feature or bug fix.
- Make your changes and ensure they adhere to the project's coding style.
- Write tests for your changes to ensure robustness.
- Open a pull request describing the changes you've made and why they are necessary.

#### License:
This project is licensed under the MIT License. See the `LICENSE` file for more details.

#### Authors:
- [Pratchaya Maneechot](https://github.com/peeter240960)

#### Contact:
For any inquiries or issues, please contact [pratya240960@gmail.com](mailto:pratya240960@gmail.com).

#### Acknowledgments:
Special thanks to the contributors and maintainers of the dependencies used in this project.