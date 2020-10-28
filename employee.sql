DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

-- create tables for employee, department, and role
CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  -- refers to role the employee has
  role_id INT,
  -- refers to the manager assigned to this employee
  manager_id INT
);

CREATE TABLE department (
 id INT PRIMARY KEY,
 name VARCHAR(30)
);

INSERT INTO department (id, name)
VALUES (1, "Sales"), (2, "Engineering"), (3, "Finance"), (4, "Legal");

CREATE TABLE role (
  id INT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT
);

INSERT INTO role (id, title, salary)
VALUES (1, "Sales Lead", 100000), (2, "Salesperson", 80000), (3, "Lead Engineer", 150000), (4, "Software Engineer", 120000), (5, "Accountant", 125000), (6, "Legal Team Lead", 250000), (7, "Lawyer", 190000);










