document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const familyName = document.getElementById('familyName').value;
        const dob = document.getElementById('dob').value;

        if (!validateDOB(dob)) {
            alert('Student must be at least 10 years old.');
            return;
        }

        addStudent(firstName, familyName, dob);
    });

    function validateDOB(dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        return age >= 10;
    }

    function addStudent(firstName, familyName, dob) {
        // Implementation remains the same
    }

    function fetchStudents() {
        // Implementation remains the same
    }

    // Fetch students on load
    fetchStudents();
});

// In the form submission event listener
document.getElementById('studentForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const dob = document.getElementById('dob').value;
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }

    if (age < 10) {
        alert("Student must be at least 10 years old.");
        return; // Stop form submission
    }

    // Proceed with form submission if validation passes
    const firstName = document.getElementById('firstName').value;
    const familyName = document.getElementById('familyName').value;

    // Your existing code to submit these values
});


// Function to add a new student
function addStudent(firstName, familyName, dob) {
    fetch('/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, familyName, dob }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, refresh the student list here to show the newly added student
        fetchStudents();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to fetch and display all students
function fetchStudents() {
    fetch('/students')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('studentsList').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing table content

        data.forEach((student) => {
            const row = tableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.textContent = student.firstName;
            cell2.textContent = student.familyName;
            cell3.textContent = student.dob;
        });
    })
    .catch(error => console.error('Error fetching students:', error));
}
