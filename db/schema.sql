DROP DATABASE IF EXISTS employeeCMS_db;

CREATE DATABASE employeeCMS_db;
USE employeeCMS_db;

CREATE TABLE department (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL
);

CREATE TABLE role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department (department_id) ON DELETE CASCADE
);

CREATE TABLE employee (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee (employee_id) ON DELETE SET NULL
);