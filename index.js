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
  console.log(`
  ______ __  __ _____  _      ______     ________ ______    _____       _______       ____           _____ ______ 
 |  ____|  \\/  |  __ \\| |    / __ \\ \\   / /  ____|  ____|  |  __ \\   /\\|__   __|/\\   |  _ \\   /\\    / ____|  ____|
 | |__  | \\  / | |__) | |   | |  | \\ \\_/ /| |__  | |__     | |  | | /  \\  | |  /  \\  | |_) | /  \\  | (___ | |__   
 |  __| | |\\/| |  ___/| |   | |  | |\\   / |  __| |  __|    | |  | |/ /\\ \\ | | / /\\ \\ |  _ < / /\\ \\  \\___ \\|  __|  
 | |____| |  | | |    | |___| |__| | | |  | |____| |____   | |__| / ____ \\| |/ ____ \\| |_) / ____ \\ ____) | |____ 
 |______|_|  |_|_|    |______\\____/  |_|  |______|______|  |_____/_/    \\_\\_/_/    \\_\\____/_/    \\_\\_____/|______|
 `);
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
      'Update an employee manager',
      'Delete a role',
      'Delete a department',
      'Delete an employee',
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
      case 'Update an employee manager':
        updateEmployeeManager();
        break;
      case 'Delete a role':
        deleteRole();
        break;
      case 'Delete a department':
        deleteDepartment();
        break;
      case 'Delete an employee':
        deleteEmployee();
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

function updateEmployeeRole() {
  const employeesQuery = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
  const rolesQuery = 'SELECT role_id, title FROM role';

  connection.query(employeesQuery, (err, employees) => {
    if (err) throw err;

    connection.query(rolesQuery, (err, roles) => {
      if (err) throw err;

      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Select the employee you want to update:',
          choices: employees.map((employee) => ({
            name: employee.employee_name,
            value: employee.employee_id,
          })),
        },
        {
          type: 'list',
          name: 'newRole',
          message: 'Select the new role for the employee:',
          choices: roles.map((role) => ({
            name: role.title,
            value: role.role_id,
          })),
        },
      ]).then((answer) => {
        const query = 'UPDATE employee SET role_id = ? WHERE employee_id = ?';
        connection.query(query,
          [answer.newRole, answer.employee],
          (err, res) => {
            if (err) throw err;
            console.log('Employee role updated successfully!');
            init();
          }
        );
      });
    });
  });
}

function addRole() {
  const departmentsQuery = 'SELECT department_id, department_name FROM department';

  connection.query(departmentsQuery, (err, departments) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'Select the department for the role:',
        choices: departments.map((department) => ({
          name: department.department_name,
          value: department.department_id,
        })),
      },
    ]).then((answer) => {
      const query = 'INSERT INTO role SET ?';
      connection.query(query,
        {
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: answer.roleDepartment,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${answer.roleTitle} added successfully!`);
          init();
        }
      );
    });
  });
}

function updateEmployeeManager() {
  const employeesQuery = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';

  connection.query(employeesQuery, (err, employees) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select the employee you want to update:',
        choices: employees.map((employee) => ({
          name: employee.employee_name,
          value: employee.employee_id,
        })),
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Select the new manager for the employee:',
        choices: employees.map((employee) => ({
          name: employee.employee_name,
          value: employee.employee_id,
        })),
        default: null,
      },
    ]).then((answer) => {
      const query = 'UPDATE employee SET manager_id = ? WHERE employee_id = ?';
      connection.query(query,
        [answer.manager, answer.employee],
        (err, res) => {
          if (err) throw err;
          init();
        }
      );
    });
  });
}

function deleteRole() {
  const rolesQuery = 'SELECT role_id, title FROM role';

  connection.query(rolesQuery, (err, roles) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Select the role to delete:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.role_id,
        })),
      },
    ]).then((answer) => {
      const query = 'DELETE FROM role WHERE role_id = ?';

      connection.query(query, [answer.role], (err, res) => {
        if (err) throw err;
        console.log('Role deleted successfully!');
        init();
      });
    });
  });
}

function deleteDepartment() {
  const departmentsQuery = 'SELECT department_id, department_name FROM department';

  connection.query(departmentsQuery, (err, departments) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Select the department to delete:',
        choices: departments.map((department) => ({
          name: department.department_name,
          value: department.department_id,
        })),
      },
    ]).then((answer) => {
      const query = 'DELETE FROM department WHERE department_id = ?';

      connection.query(query, [answer.department], (err, res) => {
        if (err) throw err;
        console.log('Department deleted successfully!');
        init();
      });
    });
  });
}

function deleteEmployee() {
  const employeesQuery = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';

  connection.query(employeesQuery, (err, employees) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select the employee to delete:',
        choices: employees.map((employee) => ({
          name: employee.employee_name,
          value: employee.employee_id,
        })),
      },
    ]).then((answer) => {
      const query = 'DELETE FROM employee WHERE employee_id = ?';

      connection.query(query, [answer.employee], (err, res) => {
        if (err) throw err;
        console.log('Employee deleted successfully!');
        init();
      });
    });
  });
}