// Dependencies
const mysql = require("mysql2");      // mysql2
const art = require('ascii-art');     // ascii art
const inquirer = require("inquirer"); // Inquirer
require('dotenv').config()            // dotenv

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Error Handling
db.connect(function (err) {
    if(err) throw err;
    init(); // initialize app
})

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

}

// View Roles Function
function viewRoles() {
// job title, 
// role id, 
// the department that role belongs to, 
// salary for that role

    db.query('SELECT * FROM role', (err, data) => {
        if (err) throw err;
        console.log('\n');
        console.table(data);
        console.log('\n');

        init();
    })



}

// View Departments function
function viewDepts() {
    db.query('SELECT * FROM department', (err, data) => {
        if(err) throw err;
        console.log('\n');
        console.table(data);
        console.log('\n');

        init();
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
        VALUES (?)`

        db.query(sqlString, [newDept], (err, result) => {
            if(err) throw err;
            // console.log(result)
            init()
        })
    })
}