// The Intern class inherits from Employee
const Employee = require("./Employee");

class Intern  extends Employee {
  /* with SAME properties of Employee and also the following property:
   *  - school
   */
  constructor(name, id, email, school) {
    super(name, id, email);
    this.school = school;
  }

  /* with the following method:
   *  - getSchool()
   *  - getRole() // Overridden to return 'Intern'
   */
  getSchool() { return this.school; }
  getRole()   { return 'Intern';    }
}

module.exports = Intern;