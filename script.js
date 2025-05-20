document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorPanels = document.querySelectorAll('.calculator-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            calculatorPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-calculator`).classList.add('active');
        });
    });

    // General Calculator
    const semesterInputs = document.getElementById('semester-inputs');
    const addSemesterBtn = document.getElementById('add-semester');
    const calculateBtn = document.getElementById('calculate-cgpa');
    const conversionFormula = document.getElementById('conversion-formula');
    let semesterCount = 1;

    // Add course to a semester
    function addCourse(semesterDiv) {
        const courseInputs = semesterDiv.querySelector('.course-inputs');
        const newCourse = document.createElement('div');
        newCourse.className = 'course';
        newCourse.innerHTML = `
            <input type="text" placeholder="Course Name">
            <input type="number" placeholder="Percentage" min="0" max="100">
        `;
        courseInputs.appendChild(newCourse);
    }

    // Add new semester
    function addSemester() {
        semesterCount++;
        const newSemester = document.createElement('div');
        newSemester.className = 'semester';
        newSemester.innerHTML = `
            <h3>Semester ${semesterCount}</h3>
            <div class="course-inputs">
                <div class="course">
                    <input type="text" placeholder="Course Name">
                    <input type="number" placeholder="Credits" min="1" max="6">
                    <input type="number" placeholder="Grade Points" min="0" max="10">
                </div>
            </div>
            <button class="add-course">+ Add Course</button>
        `;
        semesterInputs.appendChild(newSemester);

        // Add event listener to the new "Add Course" button
        const addCourseBtn = newSemester.querySelector('.add-course');
        addCourseBtn.addEventListener('click', () => addCourse(newSemester));
    }

    // Calculate CGPA
    function calculateCGPA() {
        let totalPercentage = 0;
        let courseCount = 0;
        const divisor = parseFloat(conversionFormula.value);

        // Loop through all semesters
        document.querySelectorAll('.semester').forEach(semester => {
            // Loop through all courses in the semester
            semester.querySelectorAll('.course').forEach(course => {
                const inputs = course.querySelectorAll('input');
                const percentage = parseFloat(inputs[1].value) || 0;

                if (percentage) {
                    totalPercentage += percentage;
                    courseCount++;
                }
            });
        });

        // Calculate average percentage
        const avgPercentage = courseCount ? (totalPercentage / courseCount).toFixed(2) : 0;
        
        // Calculate CGPA using selected formula
        const cgpa = (avgPercentage / divisor).toFixed(2);
        document.getElementById('cgpa-result').textContent = cgpa;
        document.getElementById('percentage-result').textContent = avgPercentage;

        // Update performance scale highlighting
        updatePerformanceScale(parseFloat(cgpa));
    }

    // Update performance scale
    function updatePerformanceScale(cgpa) {
        const scaleItems = document.querySelectorAll('.scale-item');
        scaleItems.forEach(item => item.style.opacity = '0.5');

        if (cgpa >= 9.0) {
            document.querySelector('.scale-item.excellent').style.opacity = '1';
        } else if (cgpa >= 8.0) {
            document.querySelector('.scale-item.very-good').style.opacity = '1';
        } else if (cgpa >= 7.0) {
            document.querySelector('.scale-item.good').style.opacity = '1';
        } else if (cgpa >= 6.0) {
            document.querySelector('.scale-item.average').style.opacity = '1';
        } else {
            document.querySelector('.scale-item.poor').style.opacity = '1';
        }
    }

    // Quick Conversion Calculator
    const percentageInput = document.getElementById('percentage-input');
    const cgpaInput = document.getElementById('cgpa-input');
    const convertBtns = document.querySelectorAll('.convert-btn');

    convertBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            const resultSpan = parent.querySelector('.quick-result span');
            const divisor = parseFloat(conversionFormula.value);

            if (parent.querySelector('#percentage-input')) {
                const percentage = parseFloat(percentageInput.value) || 0;
                resultSpan.textContent = (percentage / divisor).toFixed(2);
            } else {
                const cgpa = parseFloat(cgpaInput.value) || 0;
                resultSpan.textContent = (cgpa * divisor).toFixed(2) + '%';
            }
        });
    });

    // University Calculators
    const gradeContainers = {
        vit: document.getElementById('vit-grades'),
        srm: document.getElementById('srm-grades'),
        aktu: document.getElementById('aktu-grades'),
        jntu: document.getElementById('jntu-grades'),
        ipu: document.getElementById('ipu-grades')
    };

    const gradeScales = {
        vit: [
            { grade: 'S', points: 10, range: '90-100' },
            { grade: 'A', points: 9, range: '80-89' },
            { grade: 'B', points: 8, range: '70-79' },
            { grade: 'C', points: 7, range: '60-69' },
            { grade: 'D', points: 6, range: '50-59' },
            { grade: 'F', points: 0, range: '<50' }
        ],
        srm: [
            { grade: 'O', points: 10, range: '90-100' },
            { grade: 'A+', points: 9, range: '80-89' },
            { grade: 'A', points: 8, range: '70-79' },
            { grade: 'B+', points: 7, range: '60-69' },
            { grade: 'B', points: 6, range: '50-59' },
            { grade: 'F', points: 0, range: '<50' }
        ],
        aktu: [
            { grade: 'A+', points: 10, range: '90-100' },
            { grade: 'A', points: 9, range: '80-89' },
            { grade: 'B+', points: 8, range: '70-79' },
            { grade: 'B', points: 7, range: '60-69' },
            { grade: 'C', points: 6, range: '50-59' },
            { grade: 'F', points: 0, range: '<50' }
        ],
        jntu: [
            { grade: 'O', points: 10, range: '90-100' },
            { grade: 'A+', points: 9, range: '80-89' },
            { grade: 'A', points: 8, range: '70-79' },
            { grade: 'B', points: 7, range: '60-69' },
            { grade: 'C', points: 6, range: '50-59' },
            { grade: 'F', points: 0, range: '<50' }
        ],
        ipu: [
            { grade: 'A+', points: 10, range: '90-100' },
            { grade: 'A', points: 9, range: '80-89' },
            { grade: 'B+', points: 8, range: '70-79' },
            { grade: 'B', points: 7, range: '60-69' },
            { grade: 'C', points: 6, range: '50-59' },
            { grade: 'F', points: 0, range: '<50' }
        ]
    };

    const conversionFormulas = {
        vit: (cgpa) => (cgpa * 10) - 5,
        srm: (cgpa) => cgpa * 10,
        aktu: (cgpa) => cgpa * 10,
        jntu: (cgpa) => (cgpa - 0.5) * 10,
        ipu: (cgpa) => cgpa * 9.5
    };

    function addGradeRow(container, university) {
        const row = document.createElement('div');
        row.className = 'grade-row';
        const gradeOptions = gradeScales[university]
            .map(g => `<option value="${g.points}">${g.grade} (${g.points}) - ${g.range}%</option>`)
            .join('');

        row.innerHTML = `
            <input type="text" placeholder="Course Name">
            <input type="number" placeholder="Credits" min="1" max="4">
            <select>${gradeOptions}</select>
        `;
        container.appendChild(row);
    }

    // Add event listeners for all university calculators
    const addGradeRowBtns = document.querySelectorAll('.add-grade-row');
    const calculateUniversityBtns = document.querySelectorAll('.calculate-university');

    addGradeRowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.previousElementSibling.querySelector('.grade-inputs');
            const university = container.id.split('-')[0];
            addGradeRow(container, university);
        });
    });

    calculateUniversityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const university = btn.dataset.university;
            const container = document.getElementById(`${university}-grades`);
            const resultDiv = btn.nextElementSibling;
            
            let totalPoints = 0;
            let totalCredits = 0;
            
            container.querySelectorAll('.grade-row').forEach(row => {
                const credits = parseFloat(row.querySelector('input[type="number"]').value) || 0;
                const points = parseFloat(row.querySelector('select').value) || 0;
                
                if (credits && points) {
                    totalPoints += credits * points;
                    totalCredits += credits;
                }
            });
            
            const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
            const percentage = totalCredits ? conversionFormulas[university](parseFloat(cgpa)).toFixed(2) : '0.00';
            
            resultDiv.querySelector('p:first-child span').textContent = cgpa;
            resultDiv.querySelector('p:last-child span').textContent = percentage + '%';
        });
    });

    // Initialize first grade row for each university calculator
    Object.keys(gradeContainers).forEach(university => {
        if (gradeContainers[university]) {
            addGradeRow(gradeContainers[university], university);
        }
    });

    // Event Listeners for General Calculator
    addSemesterBtn.addEventListener('click', addSemester);
    calculateBtn.addEventListener('click', calculateCGPA);

    // Add event listener to the first "Add Course" button
    document.querySelector('.add-course').addEventListener('click', () => {
        addCourse(document.querySelector('.semester'));
    });
});
