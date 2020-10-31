DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

-- create tables for employee, department, and role
CREATE TABLE department (
 id INT AUTO_INCREMENT PRIMARY KEY,
 -- unique means we can't create the same department twice
 name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  INDEX dept_ind(department_id),
  -- foreign key for department - VLOOKUP for finding same id on each sheet
  CONSTRAINT fk_department FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
  -- on delete cascade, deleting all roles associated with deleted department
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  -- refers to role the employee has - match id in role table
  role_id INT NOT NULL,
  department_id INT,
  INDEX roles_ind(role_id),
  CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
  -- refers to the manager assigned to this employee
 --  manager_id INT
  -- constraint - manager id matches employee id
);


INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES ("Katie", "Anilionis", 1, 1), ("Ian", "Rogers", 2, 1), ("Raymond", "Lee", 3, 2), ("Deb", "Arehart", 4, 2), ("Rosemary", "Rulon", 5, 3), ("Jorden", "Kouahi", 6, 4), ("Jake", "Crye", 7, 4);

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);


SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;

-- SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.id, department.name
-- FROM employee
-- LEFT JOIN roles ON employee.role_id = roles.id
-- LEFT JOIN department ON employee.department_id = department.id;

-- SELECT department.name, roles.title
-- FROM roles
-- LEFT JOIN department ON roles.department_id = department.id;

-- SELECT department.name, roles.title, roles.salary
-- FROM roles
-- LEFT JOIN department ON roles.department_id = department.id;

SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.id, department.name
FROM department
INNER JOIN employee ON department.id = employee.role_id






