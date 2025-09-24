// index.js
const readline = require("readline-sync");

// Array to store employees
let employees = [];

// Function to add employee
function addEmployee() {
    const name = readline.question("Enter employee name: ");
    const id = readline.questionInt("Enter employee ID: ");
    const role = readline.question("Enter employee role: ");
    
    employees.push({ id, name, role });
    console.log("✅ Employee added successfully!\n");
}

// Function to view all employees
function viewEmployees() {
    if (employees.length === 0) {
        console.log("⚠️ No employees found.\n");
    } else {
        console.log("\n📋 Employee List:");
        employees.forEach(emp => {
            console.log(`ID: ${emp.id}, Name: ${emp.name}, Role: ${emp.role}`);
        });
        console.log("");
    }
}

// Function to delete employee
function deleteEmployee() {
    const id = readline.questionInt("Enter Employee ID to delete: ");
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
        employees.splice(index, 1);
        console.log("🗑️ Employee deleted successfully!\n");
    } else {
        console.log("⚠️ Employee not found.\n");
    }
}

// CLI Menu
function mainMenu() {
    while (true) {
        console.log("===== Employee Management System =====");
        console.log("1. Add Employee");
        console.log("2. View Employees");
        console.log("3. Delete Employee");
        console.log("4. Exit");
        
        const choice = readline.questionInt("Choose an option: ");
        
        switch (choice) {
            case 1:
                addEmployee();
                break;
            case 2:
                viewEmployees();
                break;
            case 3:
                deleteEmployee();
                break;
            case 4:
                console.log("👋 Exiting... Goodbye!");
                process.exit(0);
            default:
                console.log("❌ Invalid choice, try again.\n");
        }
    }
}

// Start program
mainMenu();
