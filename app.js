// Import mysql2
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_db"
});

// Error Handling
db.connect(function (err) {
    if(err) throw err;
    init();
})

// Import Inquirer
const inquirer = require("inquirer");

// Init Function
function init() {
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
                'Add Department'
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
        }
    })
}

// View Employees Function
function viewEmployees() {

}

// Add Employee Function
function addEmployee() {

}

// Update Employee Role Function
function updateEmployeeRole() {

}

// Add Role Function
function addRole() {

}

// View Roles Function
function viewRoles() {

}

// View Departments function
function viewDepts() {
    db.query('SELECT * FROM department', (err, data) => {
        if(err) throw err;
        console.log('\n')
        console.table(data)
        console.log('\n')

        init()
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