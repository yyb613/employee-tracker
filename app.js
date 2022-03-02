// Dependencies
const mysql = require("mysql2"); // mysql2
const inquirer = require("inquirer"); // Inquirer
require("dotenv").config(); // dotenv

// Connect to database
const db = mysql.createConnection({
  host: "localhost", // Host
  user: process.env.DB_USER, // Username
  password: process.env.DB_PASSWORD, // Password
  database: process.env.DB_DATABASE, // Database
});

db.connect(function (err) {
  if (err) throw err; // error handling
  init(); // initialize app
});

// Init Function
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?", // Main Menu
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "Add Role",
          "View All Roles",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
        name: "option",
      },
    ])
    .then(({ option }) => {
      switch (option) {
        case "View All Employees": // View all Employees
          viewEmployees();
          break;
        case "Add Employee": // Add Employee
          addEmployee();
          break;
        case "Update Employee Role": // Update Employee Role
          updateEmployeeRole();
          break;
        case "Add Role": // Add Role
          addRole();
          break;
        case "View All Roles": // View All Roles
          viewRoles();
          break;
        case "View All Departments": // View All Departments
          viewDepts();
          break;
        case "Add Department": // Add Department
          addDept();
          break;
        case "Quit": // Quit
          console.log("Goodbye!");
          process.exit();
      }
    });
}

// View Employees Function
function viewEmployees() {
  const sqlString = `
  SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  JOIN role 
  ON employee.role_id = role.id
  JOIN department
  ON role.department_id = department.id
  LEFT JOIN employee manager 
  ON manager.id = employee.manager_id`

  db.query(sqlString, (err, data) => {
    if (err) throw err; // error handling
    console.table(data); // show data
    init(); // return to main menu
  });
}

// Add Employee Function
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your Employee's first name?", // first name
        name: "fName",
      },
      {
        type: "input",
        message: "What is your Employee's last name?", // last name
        name: "lName",
      },
    ])
    .then(({ fName, lName }) => {
      fetchRoles() // fetch roles
        .then(([rows]) => {
          const roleChoices = rows.map(({ id, title }) => ({
            name: title,
            value: id
          }))

          inquirer.prompt({
            type: 'list',
            name: 'roleID',
            message: 'What the role of this new employeee?', // ask role
            choices: roleChoices
          })
            .then(({ roleID }) => {
              fetchEmployees() // fetch employees
                .then(([rows]) => {
                  const managerChoices = rows.map(({ id, first_name, last_name }) => ({
                    name: first_name + " " + last_name,
                    value: id
                  }))
                  inquirer.prompt({
                    type: 'list',
                    name: 'mgrID',
                    message: 'Who is this the manager for this employee?', // ask manager
                    choices: managerChoices
                  })
                    .then(({ mgrID }) => {
                      const sqlString = `
                      INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`

                      db.query(sqlString, [fName, lName, roleID, mgrID], (err, result) => { // add employee
                        if (err) throw err; // error handling
                        init(); // return to main menu
                      })
                    })
                })
            })
        })
    });
}

// Fetch Roles Function
function fetchRoles() {
  return db.promise().query("SELECT role.id, role.title FROM role");
}

// Fetch Employees Function
function fetchEmployees() {
  return db.promise().query("SELECT employee.id, first_name, last_name FROM employee");
}

// Update Employee Role Function
function updateEmployeeRole() {
  fetchEmployees() // fetch employees
    .then(([rows]) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id
      }))
      inquirer.prompt(
        {
          type: 'list',
          message: 'Which employee are we updating?', // select employee
          choices: employeeChoices,
          name: 'employee',
        }
      )
        .then(({ employee }) => {
          fetchRoles() // fetch roles
            .then(([rows]) => {
              const roleChoices = rows.map(({ id, title }) => ({
                name: title,
                value: id
              }))
              inquirer.prompt(
                {
                  type: 'list',
                  message: "What is the employee's role?", // select role
                  choices: roleChoices,
                  name: 'role',
                }
              )
                .then(({ role }) => {
                  const sqlString = `
                  UPDATE employee
                  SET role_id = ?
                  WHERE employee.id = ?`

                  db.query(sqlString, [role, employee], (err, result) => { // update employee role
                    if (err) throw err;  // error handling
                    init(); // return to main menu
                  })
                })
            })
        })
    })
}

// Add Role Function
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your new Role?", // new role
        name: "newRole",
      },
      {
        type: "input",
        message: "How much is the salary?", // salary
        name: "salary",
      },
      {
        type: "input",
        message: "What department does it belong to?", // department
        name: "dept",
      },
    ])
    .then(({ newRole, salary, dept }) => {
      db.query(
        `SELECT id FROM department WHERE name='${dept}';`, (err, dept_id) => { // get deptID
          if (err) throw err; // error handling
          let deptId = dept_id[0].id; // set deptId

          const sqlString = `
            INSERT INTO role(title, salary, department_id)
            VALUES (?, ?, ?);`;

          db.query(sqlString, [newRole, salary, deptId], (err, result) => { // create role
            if (err) throw err; // error handling
            init(); // return to main menu
          });
        }
      );
    });
}

// View Roles Function
function viewRoles() {
  const sqlString = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        INNER JOIN department ON role.department_id=department.id;`;

  db.query(sqlString, (err, data) => { // view roles
    if (err) throw err;  // error handling
    console.table(data); // show table
    init(); // return to main menu
  });
}

// View Departments function
function viewDepts() {
  db.query("SELECT * FROM department;", (err, data) => { // view departments
    if (err) throw err;  // error handling
    console.table(data); // show table
    init(); // return to main menu
  });
}

// Add Department function
function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your new Department?", // new department name
        name: "newDept",
      },
    ])
    .then(({ newDept }) => {
      const sqlString = `
        INSERT INTO department(name)
        VALUES (?);`;

      db.query(sqlString, [newDept], (err, result) => { // add new department
        if (err) throw err; // error handling
        init(); // return to main menu
      });
    });
}