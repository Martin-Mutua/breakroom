CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

CREATE TABLE employeeDetails (
    user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    userPassword VARCHAR(50) UNIQUE NOT NULL,
    gender VARCHAR(7),
    jobRole VARCHAR(50),
    department VARCHAR(50),
    userAddress VARCHAR(50),
    createdOn VARCHAR(150) NOT NULL,
    lastLogin VARCHAR(150)
);