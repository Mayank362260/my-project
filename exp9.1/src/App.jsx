import { useState } from "react";
import "./App.css";

// Base Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getInfo() {
    return `Hi, I'm ${this.name}, and I'm ${this.age} years old.`;
  }
}

// Student Subclass
class Student extends Person {
  constructor(name, age, course) {
    super(name, age);
    this.course = course;
  }
  getInfo() {
    return `${super.getInfo()} I study ${this.course}.`;
  }
}

// Teacher Subclass
class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }
  getInfo() {
    return `${super.getInfo()} I teach ${this.subject}.`;
  }
}

function App() {
  const [message, setMessage] = useState("");

  const showStudent = () => {
    const student = new Student("Roshan Kumar", 14, "8th Grade");
    setMessage(student.getInfo());
  };

  const showTeacher = () => {
    const teacher = new Teacher("Mr. John", 40, "Math");
    setMessage(teacher.getInfo());
  };

  return (
    <div className="card">
      <h2>Person Class Hierarchy</h2>
      <div className="buttons">
        <button onClick={showStudent}>Show Student</button>
        <button onClick={showTeacher}>Show Teacher</button>
      </div>
      <hr />
      <p>{message}</p>
    </div>
  );
}

export default App;
