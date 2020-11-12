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

// start()

function start(){
inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      // "View All Employees By Manager",
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
      case "End App": endApp();
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
      "SELECT employee.first_name, employee.last_name, roles.title, department.dept_id, department.name FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON employee.department_id = department.dept_id",
      function(err,res){
        console.table(res)
      }

    )
    start()
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
        roleArray.push(res[i].id + " | " + res[i].title)
      }
      return roleArray
      }},
      
    ]).then(function(res) {
      // var addedRole = res.role.split(" ");
      // console.log(addedRole);
      addEmployeeDept(res)
    }
    )
  })
  function addEmployeeDept(answer){
    console.log(answer)
    connection.query(
      "SELECT * FROM department",
      function(err,res){
        if(err) throw err;
      inquirer.prompt([
        {
        type: "list",
        message: "What department is this role in?",
        name: "newDept",
        choices: function(){
          var newDeptArray = [];
          for(var i=0; i<res.length; i++){
            newDeptArray.push(res[i].dept_id + " | " + res[i].name)
          }
          return newDeptArray;
        }}
      ]).then(function (res){
        console.log(res)
        // var addedNewDept = response.newDept.split(" ")
        // console.log(addedNewDept);
    connection.query(
      "INSERT INTO employee SET ?",
      [
      {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.role.charAt(0),
      department_id: res.newDept.charAt(0),
      }
      ],
      function(err){
        if(err) throw err;
        console.log("added employee successfully")
        start()
        }
      )
      }
    )
  })}}


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
    start()
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
      updatedDept(res)
    })})

function updatedDept(answer){
  console.log(answer)
      connection.query(
        "SELECT * FROM department",
        function (err,res){
          if(err) throw err;
        inquirer.prompt([
          {
          type: "list",
          message: "What department is this role in?",
          name: "newDept",
          choices: function(){
            var newDeptArray = [];
            for(var i=0; i<res.length; i++){
              newDeptArray.push(res[i].dept_id + " | " + res[i].name)
            }
            return newDeptArray;
          }}
        ]).then(function (response){
          console.log(response)


      connection.query(
        "UPDATE employee SET ? WHERE ?",[
        {
        role_id: answer.newRole.charAt(0),
        department_id: response.newDept.charAt(0)
        },
        {
        id: newAnswer[0],
        }
        ])
      console.log(res)
      })
      start()
  })}}
      

function viewAllRoles(){
connection.query(
  "SELECT * FROM roles",
  function(err,res){
    if(err) throw err;
    console.table(res)
  })
  start()
}

function viewAllDepts(){
connection.query(
  "SELECT * FROM department",
  function(err,res){
    if(err) throw err;
    console.table(res)
  })
  start()
}

function createRole(){
  connection.query(
    // ? means we want to reference that object, we can also pass in an object already created by using its variable name
    "SELECT * FROM department",
    function(err,res){
        if (err) throw err;
    inquirer.prompt([
      {
      type: "input",
      message: "What role would you like to create?",
      name: "newRole",
      },
      {
      type: "input",
      message: "What is the salary for this role?",
      name: "addSalary",
      },
      {
      type: "list",
      message: "What department will this role be a part of?",
      name: "addDept",
      choices: function() {
        var deptArray = [];
        for(var i=0; i<res.length; i++){
          deptArray.push(res[i].dept_id + " | " + res[i].name)
        }
        return deptArray
        }},
        
      ]).then(function(response) {
        var addedDept = response.addDept.split(" ")
        console.log(addedDept);
        // var chosenDept;
      //   for(var i=0; i<res.length; i++){
      //     // if this matches what is in the table, then chosenRole will contain all answers
      //     if(res[i].name === response.addDept){
      //       chosenDept = res[i]
      //     }
      // }
      connection.query(
        "INSERT INTO roles SET ?",
        [
        {
        title: response.newRole,
        salary: response.addSalary,
        department_id: response.addDept.charAt(0)
        }
        ],
        function(err){
          if(err) throw err;
          console.log("added role successfully"),
          console.table(res)
          start()
          }
        )
        })
      })
      start()
      }


// DELETE



function removeRole(){
  connection.query(
    // ? means we want to reference that object, we can also pass in an object already created by using its variable name
    "SELECT * FROM roles",
    function(err,res){
        if (err) throw err;
    inquirer.prompt([
      {
      type: "list",
      message: "Which role would you like to remove?",
      name: "remRole",
      choices: function() {
        var roleArray = [];
        for(var i=0; i<res.length; i++){
          roleArray.push(res[i].id + " | " + res[i].title)
        }
        return roleArray
        }},
        
      ]).then(function(response) {
        var remRole = response.remRole.split(" ");
        console.log(remRole)
        connection.query(
          "DELETE FROM roles WHERE id=?", remRole,
          function(err,res){
            console.table(res)
          }
        )
        start()
        })
})
}
function removeDepartment(){
  connection.query(
    // ? means we want to reference that object, we can also pass in an object already created by using its variable name
    "SELECT * FROM department",
    function(err,res){
        if (err) throw err;
    inquirer.prompt([
      {
      type: "list",
      message: "Which department would you like to remove?",
      name: "remDept",
      choices: function() {
        var deptArray = [];
        for(var i=0; i<res.length; i++){
          deptArray.push(res[i].dept_id + " | " + res[i].name)
        }
        return deptArray
        }},
        
      ]).then(function(response) {
        var remDept = response.remDept.split(" ");
        console.log(remDept)
        connection.query(
          "DELETE FROM department WHERE id=?", remDept,
          function(err,res){
            console.table(res)
          }
        )
        start()
        })
})

}


function endApp(){
  console.log("all done")
  connection.end()
}