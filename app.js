// Import mysql2
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_db"
});

db.connect(function (err) {
    if(err) throw err;
    init()
})

// Import Inquirer
const inquirer = require("inquirer");

// Init Function
function init() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Hello what would you like to do?',
            choices: ['View all Departments', 'Create new Department'],
            name: "option"
        }
    ]).then(({option}) => {
        if(option == 'View all Departments') {
            viewDept()
        } else if(option == 'Create new Department') {
            createDept()
        }
    })
}

// View Department function
function viewDept() {
    db.query('SELECT * FROM department', (err, data) => {
        if(err) throw err;
        console.log('\n')
        console.table(data)
        console.log('\n')

        init()
    })
}

// Create Department function
function createDept() {
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