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
  // start()
});

start()

function start(){
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
      // "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "View All Departments",
      "Add Department",
      "Remove Department",
      "View Total Utilized Budget",
      "End App"
    ]}
    ]).then(function(response){
      console.log(response)
      switch(response.action){
      case "View All Employees": viewAllEmployees();
      break;
      case "View All Employees By Department": viewByDept()// SELECT employee.role_id...
      break;
      // case "View All Employees By Manager": viewByMgr()// all by mgr
      // break;
      case "Add Employee": createEmployee();
      break;
      case "Remove Employee": removeEmployee();
      break;
      case "Update Employee Role": updateEmployeeRole();
      break; 
      // case "Update Employee Manager": updateEmployee()// update employee mgr
      // break;
      case "View All Roles": viewAllRoles()// SELECT * FROM role
      break;
      case "Add Role": createRole() // INSERT INTO role (id, title, salary)
      break; 
      case "Remove Role": removeRole()// DELETE FROM role
      break;
      case "View All Departments": viewAllDepts()// SELECT * FROM department
      break;
      case "Add Department": createDepartment();
      break;
      case "Remove Department": removeDepartment();
      break;
      case "View Total Utilized Budget": viewBudget();// add all salaries together
      break;
      case "End App": readTable();
      default: start()
      }
    }) 
  }
  
  // call function based on what user wants to do
  // at end of that function, restart questions

  // EMPLOYEES
  // CREATE

  function viewAllEmployees(){
    connection.query(
      "SELECT * FROM employee",
      function(err,res){
        if(err) throw err;
        console.table(res)
      }
    )
    start()
  }

  function viewByDept(){
    connection.query(
      "SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_id, department.name FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON employee.department_id = department.dept_id",
      function(err,res){
        console.table(res)
      }

    )
  }


  function createEmployee() {
    connection.query(
      // ? means we want to reference that object, we can also pass in an object already created by using its variable name
      "SELECT * FROM roles",
      function(err,res){
        if (err) throw err;
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
        choices: function() {
          var roleArray = [];
          for(var i=0; i<res.length; i++){
            roleArray.push(res[i].title)
          }
          return roleArray
        }},
        
      ]).then(function(response) {
        var chosenRole;
        for(var i=0; i<res.length; i++){
          // if this matches what is in the table, then chosenRole will contain all answers
          if(res[i].title === response.role){
            chosenRole = res[i]
          }
        }
        connection.query(
          "INSERT INTO employee SET ?",
          [
            {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: chosenRole.id
            }
          ],
          function(err){
            if(err) throw err;
            console.log("added employee successfully")
            start()
          }
        )
        })
      })
      }

      function removeEmployee() {
        connection.query(
          "SELECT * FROM employee", 
          function(err,res){
            if(err) throw err;
          inquirer.prompt([
          {
            type: "list",
            message: "Which employee would you like to remove?",
            name: "removedEmployee",
            choices: function() {
              var employeeArray = [];
              for(var i=0; i<res.length; i++){
                employeeArray.push(res[i].id + " | " + res[i].first_name + " " + res[i].last_name)
                console.log(employeeArray)
              }
              return employeeArray
            }},
        
          ]).then(
            function(answer) {
          var removedEmployee = answer.removedEmployee.split(" ");
          console.log(removedEmployee)
          connection.query(
            "DELETE FROM employee WHERE id=?", removedEmployee,
            function(err,res){
              console.table(res)
            }
          )
          // Call readProducts AFTER the DELETE completes
          readTable();
          })
      }
      )}



// UPDATE

function updateEmployeeRole() {
  connection.query(
    "SELECT * FROM employee",
    function(err,res){
      if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        message: "Whose role would you like to update?",
        name: "updateEmployee",
        choices: function() {
          var employeeArray = [];
          for(var i=0; i<res.length; i++){
            employeeArray.push(res[i].id + " | " + res[i].first_name + " " + res[i].last_name)
          }
          return employeeArray;
      }},
    ]).then(function (res){
      updateRole(res.updateEmployee)
    })})}


    function updateRole(answer){
      var newAnswer = answer.split(" ")
      console.log(newAnswer)
    
      // res.updateEmployee = answer
      connection.query(
        "SELECT * FROM roles",
        function(err,res){
          if (err) throw err;
        // first object is what we are changing the data to, second object is telling us what part of the database we are changing
        inquirer.prompt([
          {
            type: "list",
            message: "What is their new role?",
            name: "newRole",
            choices: function() {
              var newRoleArray = [];
              for(var i=0; i<res.length; i++){
                newRoleArray.push(res[i].id + " | " + res[i].title)
              }
              return newRoleArray;
          }},
        ]).then(function (res){
          console.log(res);
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: res.newRole.charAt(0)
              },
              {
                id: newAnswer[0]
              }
            ]
          )
            console.log(res)
        })

    })}
      


function viewAllRoles(){

}

function createRole(){

}

function viewAllDepts(){

}

// DELETE



function removeRole(){

}

// READ

function readTable() {
  console.log("all done")
  // 3 different query statements - one for employee, roles, dept
  // connection.query("SELECT * FROM employee AND roles AND department", function(err, res) {
  //   if (err) throw err;
  //   // Log all results of the SELECT statement
  //   console.table(res);
  //   connection.end();
  // });
}

function endApp(){
  console.log("all done")
  connection.end()
}