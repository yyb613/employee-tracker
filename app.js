// Dependencies
const mysql = require("mysql2");      // mysql2
// const art = require('ascii-art');  // ascii art
const inquirer = require("inquirer"); // Inquirer
require('dotenv').config()            // dotenv

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,         // Username
    password: process.env.DB_PASSWORD, // Password
    database: process.env.DB_DATABASE  // Database
});

db.connect(function (err) {
    if(err) throw err;
    init(); // initialize app
});

// Show Ascii Function
// function showAscii() {
//     art.font("Employee Tracker", 'doom', (err, rendered) => { 
//         console.log('\n');
//         console.log(rendered);
//         console.log('\n');
//     });
// }

// Init Function
function init() {
    // showAscii(); // show ascii
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'Add Role',
                'View All Roles',
                'View All Departments',
                'Add Department',
                'Quit'
            ],
            name: "option"
        }
    ]).then(({option}) => {
        switch (option) {
            case 'View All Employees':   // View all Employees
                viewEmployees();
                break;
            case 'Add Employee':         // Add Employee
                addEmployee(); 
                break;
            case 'Update Employee Role': // Update Employee Role
                updateEmployeeRole();
                break;
            case 'Add Role':             // Add Role
                addRole();
                break;
            case 'View All Roles':       // View All Roles
                viewRoles();
                break;
            case 'View All Departments': // View All Departments
                viewDepts();
                break;
            case 'Add Department':       // Add Department
                addDept();
                break;
            case 'Quit':                 // Quit
                console.log('Goodbye!');
                process.exit();
        }
    })
}

// View Employees Function
function viewEmployees() {
// formatted table showing employee data, 
// including employee ids, 
// first names, 
// last names, 
// job titles, 
// departments, 
// salaries, 
// and managers that the employees report to
    db.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.log('\n');
        console.table(data);
        console.log('\n');
    })
}

// Add Employee Function
function addEmployee() {
// prompted to enter the employee’s first name, 
// last name, 
// role, 
// and manager(and that employee is added to the database)

    inquirer.prompt([
        {
            type: 'input',
            message: "What is your Employee's first name?",
            name: 'fName'
        },
        {
            type: 'input',
            message: "What is your Employee's last name?",
            name: 'lName'
        },
        {
            type: 'input',
            message: "What is your Employee's role?",
            name: 'role'
        },
        {
            type: 'input',
            message: "Who is your Employee's manager?",
            name: 'manager'
        }
    ]).then(({ fName, lName, role, manager }) => {
        const sqlString = `
        INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?);`

        db.query(sqlString, [fName, lName, role, manager], (err, result) => { // create employee
            if (err) throw err; // error handling
            init();             // return to main menu
        })
    })


}

// Update Employee Role Function
function updateEmployeeRole() {
// prompted to select an employee to update and their new role (and this information is updated in the database)

}

// Add Role Function
function addRole() {
// prompted to enter name, 
// salary, 
// and department for the role (and that role is added to the database)

    inquirer.prompt([
        {
            type: 'input',
            message: 'What is your new Role?',
            name: 'newRole'
        },
        {
            type: 'input',
            message: 'How much is the salary?',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'What department does it belong to?',
            name: 'dept'
        }
    ]).then(({ newRole, salary, dept }) => {
        const myvar = db.query(`SELECT id FROM department WHERE name=${dept};`, (err, deptId) => { // sql query
            if (err) throw err; // error handling
        })
        console.log(myvar);
       
       
 

        // const sqlString = `
        // INSERT INTO role(title, salary, department_id)
        // VALUES (?, ?, ?);`

        // db.query(sqlString, [newRole, salary, deptId], (err, result) => { // create role
        //     if (err) throw err; // error handling
        //     init();             // return to main menu
        // })
    })





}

// View Roles Function
function viewRoles() {
    const sqlString = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        INNER JOIN department ON role.department_id=department.id;`

    db.query(sqlString, (err, data) => { // sql query
        if (err) throw err;  // error handling
        console.table(data); // show table
        init();              // return to main menu
    })
}

// View Departments function
function viewDepts() {
    db.query('SELECT * FROM department;', (err, data) => { // sql query
        if(err) throw err;   // error handling
        console.table(data); // show table
        init();              // return to main menu
    })
}

// Add Department function
function addDept() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is your new Department?',
            name: 'newDept'
        }
    ]).then(({newDept}) => {
        const sqlString = `
        INSERT INTO department(name)
        VALUES (?);`

        db.query(sqlString, [newDept], (err, result) => { // sql query
            if(err) throw err; // error handling
            init();            // return to main menu
        })
    })
}