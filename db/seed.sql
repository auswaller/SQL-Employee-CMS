INSERT INTO department (department_name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 70000.00, 1),
  ('Sales Representative', 50000.00, 1),
  ('Marketing Coordinator', 45000.00, 2),
  ('Software Engineer', 80000.00, 3),
  ('QA Engineer', 65000.00, 3),
  ('HR Manager', 60000.00, 4),
  ('HR Assistant', 40000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, NULL),
  ('Emily', 'Williams', 4, 3),
  ('David', 'Brown', 5, 3),
  ('Sarah', 'Taylor', 6, NULL),
  ('Alex', 'Lee', 7, 6);