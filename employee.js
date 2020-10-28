const inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "View All Departments",
      "Add Department",
      "Remove Department",
      "View Total Utilized Budget"
    ]}
    ]).then(function(response){
      console.log(response)
      switch(response.action){
      case "View All Employees": // SELECT * FROM employee
      break;
      case "View All Employees By Department": // SELECT employee.role_id...
      break;
      case "View All Employees By Manager": // all by mgr
      break;
      case "Add Employee": createEmployee();
      break;
      case "Remove Employee": removeEmployee();
      break;
      case "Update Employee Role": updateEmployee();
      break; 
      case "Update Employee Manager": // update employee mgr
      break;
      case "View All Roles": // SELECT * FROM role
      break;
      case "Add Role": // INSERT INTO role (id, title, salary)
      break; 
      case "Remove Role": // DELETE FROM role
      break;
      case "View All Departments": // SELECT * FROM department
      break;
      case "Add Department": createDepartment();
      break;
      case "Remove Department": removeDepartment();
      break;
      case "View Total Utilized Budget": // add all salaries together
      }
    }) 
    //   {
    //   name: "View All Employees",
    //   value: "",
    //   },
    //   {
    //   name: "View All Employees By Department",
    //   value: ""
    //   },
    //   {
    //   name: "View All Employees By Manager",
    //   value: "",
    //   },
    //   {
    //   name: "Add Employee",
    //   value: "",
    //   },
    //   {
    //   name: "Remove Employee",
    //   value: ""
    //   },
    //   {
    //   name: "Update Employee Role",
    //   value: ""
    //   },
    //   {
    //   name: "Update Employee Manager",
    //   value: ""
    //   },
    //   {
    //   name: "View All Roles",
    //   value: ""
    //   },
    //   {
    //   name: "Add Role",
    //   value: ""
    //   },
    //   {
    //   name: "Remove Role",
    //   value: ""
    //   },
    //   {
    //   name: "View All Departments",
    //   value: ""
    //   },
    //   {
    //   name: "Add Department",
    //   value: ""
    //   },
    //   {
    //   name: "Remove Department",
    //   value: ""
    //   },
    //   {
    //   name: "View Total Utilized Budget",
    //   value: ""
    //   }]
    // }
 
  // call function based on what user wants to do
  // at end of that function, restart questions

  // CREATE

  createEmployee()
  function createEmployee() {
    var query = connection.query(
      // ? means we want to reference that object, we can also pass in an object already created by using its variable name
      "INSERT INTO employee SET ?",
      inquirer.prompt([
        {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
        },
        {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
        },
        {
        type: "list",
        message: "What is the employee's role?",
        name: "role",
        choices: [
          "Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"
        ]
        },
        {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: [
          // SELECT * FROM employee
        ]
        }
      ]).then(function(err, res) {
        if (err) throw err;
        
        console.log(res.affectedRows + " product inserted!\n");
        
      }
      // INSERT INTO employee SET ?
    ))}


// UPDATE

function updateEmployee() {
  var query = connection.query(
    // first object is what we are changing the data to, second object is telling us what part of the database we are changing
    // anywhere there is "Rocky Road", the quantity will be changed to 100
    inquirer.prompt([
      {
        type: "list",
        message: "What would you like to update?",
        name: "itemUpdate",
        // choices: employee, role, manager, department
      }
    ]))
    "UPDATE employee SET ? WHERE ?",
    [
      {
        
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows);
      // Call deleteProduct AFTER the UPDATE completes
      deleteEmployee();
    }
    // logs the actual query being run
    console.log(query.sql);
}

// DELETE

function deleteEmployee() {
  connection.query(
    "DELETE FROM products WHERE ?",
    {
      
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows);
      // Call readProducts AFTER the DELETE completes
      readTable();
    }
  );
}

// READ

function readTable() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    connection.end();
  });
}
