# SOENav

SQL Team: For group-collaboration, we might have to use a cloud DB.
Choose a Cloud Provider:

Popular options include:

AWS RDS (Amazon Web Services Relational Database Service).

Google Cloud SQL.

PlanetScale (serverless MySQL with branching).

Clever Cloud or Heroku (for smaller projects).

Set Up the Database:

Sign up for an account with your chosen provider.

Create a new MySQL database instance.

Configure the database settings (e.g., region, storage, backup options).

Get Connection Details:

After creating the database, the provider will give you the following details:

Host: The database server’s address (e.g., my-database.12345.us-east-1.rds.amazonaws.com).

Port: Usually 3306 for MySQL.

Username: The database user (e.g., admin).

Password: The password for the database user.

Database Name: The name of the database (e.g., project_db).

Share Credentials Securely:

Share the connection details with your team using a secure method (e.g., encrypted messaging or a password manager).

Avoid committing sensitive information (e.g., passwords) to your Git repository.

2. Define the Database Schema
Design the Schema:

Use a tool like MySQL Workbench or dbdiagram.io to design your database schema.

Define tables, columns, data types, and relationships.

Create Tables:

Write SQL scripts to create tables. For example:

sql
Copy
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Share the Schema:

Export the schema as an SQL file and share it with your team.

Alternatively, use a migration tool like knex.js to manage schema changes.

3. Set Up Environment Variables
Create a .env File:

In your Node.js project, create a .env file to store database credentials:

env
Copy
DB_HOST=my-database.12345.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_password
DB_NAME=project_db
Install dotenv:

Install the dotenv package to load environment variables:

bash
Copy
npm install dotenv
Load Environment Variables:

At the top of your Node.js entry file (e.g., index.js or app.js), add:

javascript
Copy
require('dotenv').config();
