const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password1234',
  database: 'employeeCMS_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected');
  init();
});

function init() {
  inquirer
    .prompt({
      name: 'choice',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.choice) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Application exited.');
          break;
        default:
          console.log('An error occured with that selection.');
          break;
      }
    });
}

function viewAllDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
}

function viewAllRoles() {
  const query = 'SELECT role.role_id, role.title, department.department_name, role.salary FROM role INNER JOIN department ON role.department_id = department.department_id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
}
