// The Engineer class inherits from Employee.
const Employee = require("./Employee");

class Engineer  extends Employee {
  /* with SAME properties of Employee and also the following property:
   *  - github  // GitHub username
   */
  constructor(name, id, email, github) {
    super(name, id, email);
    this.github = github;
  }

  /* with the following method:
   *  - getGithub()
   *  - getRole() // Overridden to return 'Engineer'
   */
  getGithub() { return `https://github.com/${this.github}` } // Link to GitHub profile
  getRole()   { return 'Engineer';                         }
}

module.exports = Engineer;