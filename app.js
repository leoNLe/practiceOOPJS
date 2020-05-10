const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


checkNotEmpty = ( input) => { 
  if(input === "") {
    return `value cannot be empty`;
  }
  return true;
}
const employeeQuestions = (employeeType) => {
  return [
    {
      message: `What is ${employeeType}'s name?`,
      name: "name",
      validate: checkNotEmpty
    },
    { 
      message: "What is there's ID?",
      name: "id",
      validate: checkNotEmpty
    },
    {
      message: "What is there's email?",
      name: "email",
      validate: checkNotEmpty
    }
  ]
}
const managerQuestions = [
  {
    message: "What is there's office number?",
    name: "office",
    validate: checkNotEmpty
  },
];

const engineerQuestions = [
  {
    message: "What is there's github name?",
    name: "github",
    validate: checkNotEmpty
  },
];

const internQuestions = [
  {
    message: "What is the intern's school?",
    name: "school"
  }
];

const employeeTypesQuestion = [
  {
    type: "list",
    choices: [
      "Engineer",
      "Intern",
      "None" 
    ],
    message: "What employee do you want to add?",
    name: "employeeType",
  },
];

init = async () => {

  try {
    const employees = [];
    const {name, id, email, office} = await getManager(); 
    console.log("_".repeat(100));  
    employees.push(new Manager(name, id, email, office));
    
    let employeeType = ""; 
    while( employeeType !== "None" ) {
      //Get Type of employee you want to add;
      ( 
       { employeeType } = await inquirer.prompt(employeeTypesQuestion)
      );

      if( employeeType === "Engineer" )  {
        let {name, id, email, github}  = await getEngineer();
        employees.push(new Engineer(name, id, email, github));
      }

      if( employeeType === "Intern" ){
        let {name, id, email, school} = await getIntern();
        employees.push(new Intern(name, id, email, school));
      }

      console.log("_".repeat(100));

    }
    writeToFile(employees);

  } catch (err){
    console.log(err)
    throw err;
  }
}

getManager = () => {
  return inquirer.prompt([...employeeQuestions("manager"), ...managerQuestions]);
}

getEngineer = () => {
  return inquirer.prompt([...employeeQuestions("engineer"), ...engineerQuestions]);
}

getIntern = () => {
  return inquirer.prompt([...employeeQuestions("intern"), ...internQuestions]);
}

writeToFile = (employees) => {
  //Check if path exists if does not have it then create.
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR,{recursive: false }, (err) => {
      if(err) throw new Error("Error in making Object");
    })
  }
  
  fs.writeFile(outputPath, render(employees), (err) => {
    if(err) return new Error("error in writing html");
    console.log("success");
  }) 
}

init();

