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
  inquirer.prompt({
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
  }).then((answer) => {
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

function viewAllEmployees() {
  const query = 'SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN department ON role.department_id = department.department_id LEFT JOIN employee manager ON employee.manager_id = manager.employee_id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    },
  ]).then((answer) => {
    const query = 'INSERT INTO department SET ?';
    connection.query(query, { department_name: answer.departmentName }, (err, res) => {
      if (err) throw err;
      console.log(`${answer.departmentName} added successfully!`);
      init();
    });
  });
}

function addEmployee() {
  const rolesQuery = 'SELECT role_id, title FROM role';
  const managersQuery = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee';
  
  connection.query(rolesQuery, (err, roles) => {
    if (err) throw err;

    connection.query(managersQuery, (err, managers) => {
      if (err) throw err;

      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "Enter the employee's last name:",
        },
        {
          type: 'list',
          name: 'role',
          message: "Select the employee's role:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.role_id,
          })),
        },
        {
          type: 'list',
          name: 'manager',
          message: "Select the employee's manager:",
          choices: managers.map((manager) => ({
            name: manager.manager_name,
            value: manager.employee_id,
          })),
          default: null,
        },
      ]).then((answer) => {
        const query = 'INSERT INTO employee SET ?';
        connection.query(query,
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role,
            manager_id: answer.manager,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${answer.firstName} ${answer.lastName} added successfully!`);
            init();
          }
        );
      });
    });
  });
}
