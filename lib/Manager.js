// The Manager class inherits from Employee.
const Employee = require("./Employee");

class Manager extends Employee {
  /* with SAME properties of Employee and also the following property:
   *  - officeNumber
   */
  constructor(name, id, email, officeNumber) {
    super(name, id, email);
    this.officeNumber = officeNumber;
  }

  /* with the following method:
   *  - getOfficeNumber()
   *  - getRole() // Overridden to return 'Manager'
   */
  getOfficeNumber() { return this.officeNumber; }
  getRole()         { return 'Manager';         }
}

module.exports = Manager;