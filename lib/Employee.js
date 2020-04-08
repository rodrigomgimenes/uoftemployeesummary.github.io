// The parent class
class Employee {

  /* with the following properties:
   *  - name
   *  - id
   *  - email
   */
  constructor(name, id, email) {
    this.name  = name;
    this.id    = id;
    this.email = email;
  }

  /* with the following methods:
   *  - getName()
   *  - getId()
   *  - getEmail()
   *  - getRole() // Returns 'Employee'
   */
  getName()  { return this.name;  }
  getId()    { return this.id;    }
  getEmail() { return this.email; }
  getRole()  { return 'Employee'; }
}

module.exports = Employee;