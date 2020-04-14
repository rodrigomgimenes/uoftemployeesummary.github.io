const Manager  = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern   = require("./lib/Intern");
const render   = require("./lib/htmlRenderer");
const inquirer = require("inquirer");
const path     = require("path");
const fs       = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");



// Information about the team MANAGER
const questionsManager = [
  {
    type:    "input",
    name:    "managerName",
    message: "Enter Team Manager fullname: "
  },
  {
    type:    "input",
    name:    "managerID",
    message: "Enter Team Manager ID: "
  },
  {
    type:    "input",
    name:    "managerEmail",
    message: "Enter Team Manager email: "
  },
  {
    type:    "input",
    name:    "managerOfficeNumber",
    message: "Enter Team Manager office number: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }
];

// Information about the development team MEMBERS (Engineers and Interns)
const questionsMembers = [
  {
    type:    "input",
    name:    "memberName",
    message: "Enter Development Team Member fullname: "
  },
  {
    type:    "input",
    name:    "memberID",
    message: "Enter Development Team Member ID: "
  },
  {
    type:    "input",
    name:    "memberEmail",
    message: "Enter Development Team Member email: "
  },
  {
    type:    "list",
    name:    "memberRole",
    message: "Select Development Team Member's role: ",
    choices: [
      "Engineer",
      "Intern"
    ]
  }
];

// Information about the team ENGINEER
const questionsEngineer = [
  {
    type:    "input",
    name:    "engineerGithub",
    message: "Enter Engineer GithHub username: "
  }
];

// Information about the team INTERN
const questionsIntern = [
  {
    type:    "input",
    name:    "internSchool",
    message: "Enter Intern School Name: "
  }
];

let teamMembersInfo = [];


// This function will initiate the program
function init() {
  inquirer.prompt(
    [
      {
        type: 'list',
        name: 'welcomeOption',
        message: "Welcome to Team Generator!\n" + 
                 "A command-line application that will help to build your team and create an HTML file that displays it nicely.\n" +
                 "Please, select one of the options below:",
        choices: [
          "Build your Team",
          "EXIT"
        ]
      }
    ] 
  ).then( (answer) => {
    // Verify the chosen option
    switch (answer.welcomeOption) {
      case "Build your Team": // Option "Build your Team" (initiate program)
        startTeamGenerator();
        break;

      case "EXIT": // Option "Exit" (Leave program)
        process.exit();
        break;
    
      default:
        console.log("[WARNING] Option invalid!");
        init();
        break;
    }
  });
}

function startTeamGenerator() {
  // Start asking questions about Team Manager..
  inquirer.prompt(questionsManager).then( (responseManager) => {
    if (JSON.stringify(responseManager) !== JSON.stringify({})) {
      const manager = new Manager(responseManager.managerName, responseManager.managerID, responseManager.managerEmail, responseManager.managerOfficeNumber);
    
      teamMembersInfo.push(manager);

      // Start asking questions about Team Members..
      startTeamMembers();
    }
    else {
      console.log("[WARNING] Please, complete the Team Manager information to continue.");
      startTeamGenerator();
    }
  });
}

function startTeamMembers() {
  // Verify how many members the Development Team will have
  inquirer.prompt(
    [
      {
        type:    "input",
        name:    "numberMembers",
        message: "Enter the number of Team Members: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ] 
  ).then( (answer) => {
    buildTeamMembers(parseInt(answer.numberMembers))
  });
}

function buildTeamMembers(numberMembers) {
  let nMembers = parseInt(numberMembers);

  // Check how many Members make up the Team
  if (nMembers > 0) {
    inquirer.prompt(questionsMembers).then( (responseMembers) => {
      if (JSON.stringify(responseMembers) !== JSON.stringify({})) {
        // Team Member = Engineer
        if (responseMembers.memberRole.toLowerCase() === "engineer") {
          inquirer.prompt(questionsEngineer).then( (responseEngineer) => {
            const responseComplementary = ((JSON.stringify(responseEngineer) !== JSON.stringify({})) ? responseEngineer.engineerGithub : "Not Defined");
            const engineer              = new Engineer(responseMembers.memberName, responseMembers.memberID, responseMembers.memberEmail, responseComplementary);
            
            teamMembersInfo.push(engineer);
            buildTeamMembers(--nMembers);
          });
        }
        // Team Member = Intern
        else {
          inquirer.prompt(questionsIntern).then( (responseIntern) => {
            const responseComplementary = ((JSON.stringify(responseIntern) !== JSON.stringify({})) ? responseIntern.internSchool : "Not Defined");
            const intern                = new Intern(responseMembers.memberName, responseMembers.memberID, responseMembers.memberEmail, responseComplementary);
            
            teamMembersInfo.push(intern);
            buildTeamMembers(--nMembers);
          });
        }
      }
      else {
        console.log(`[WARNING] Please, complete Development Team Members information to continue. (${nMembers} Team Member(s) missing information)`);
        buildTeamMembers(nMembers);
      }
    });
  }
  else if (teamMembersInfo.length > 0) {
    // Ask if there's any other member(s) to be added
    verifyTeamComplete();
  }
  else{
    console.log("[WARNING] No Development Team Members information found!\nPlease, complete Development Team Members information to continue.");
    teamMembersInfo.splice(0, teamMembersInfo.length); // Clear array
    startTeamMembers();
  }
}

function verifyTeamComplete() {
  inquirer.prompt(
    [
      {
        type: 'list',
        name: 'proceed',
        message: 'Would you like to add one or more member(s) to your Team?',
        choices: [
          "Yes",
          "No"
        ]
      }
    ] 
  ).then( (answer) => {
    if (answer.proceed.toLowerCase() === "yes")
      startTeamMembers(); // Call members function again to add more Team Members
    else
      buildHTML(); // Build the HTML with ALL information available
  });
}

// Build webpage with ALL Team Members (Manager, Engineer, and Intern)
function buildHTML() {
  createDirectory(OUTPUT_DIR);// In case Folder does NOT exists
  writeToFile(render(teamMembersInfo), outputPath);
}

const createDirectory = (dirPath) => {
  fs.mkdirSync(dirPath, {recursive: true}, (error) => {
    if (error)
      console.error("An ERROR occured: ", error);
    else
      console.log(`"${dirPath}" directory successfully created!`);
  });
}

function writeToFile(data, ...fileName) {
  for (let index = 0; index < fileName.length; index++) {
    console.log(`Creating "HTML" file...`);

    fs.writeFileSync(fileName[index], data, function(err){
      if (err) {
        console.log(`ERROR: "HTML" file was not create due to ${err}.`);
      }
    });
    console.log(`"HTML" file successfully created!`); 
  }
}


// Call "init()" function
init();
