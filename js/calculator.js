document.addEventListener('DOMContentLoaded', () => {
    // Calculator State
    let activeFormula = 9.5;
    let semesters = [{
        id: 1,
        courses: [{
            name: '',
            credits: 4,
            grade: 10
        }]
    }];

    // DOM Elements
    const calculatorTabs = document.querySelector('.calculator-tabs');
    const semesterContainer = document.getElementById('semester-container');
    const addSemesterBtn = document.querySelector('.add-semester-btn');
    const calculateBtn = document.getElementById('calculate-cgpa');
    const cgpaValue = document.querySelector('.cgpa-value');
    const percentageValue = document.querySelector('.percentage-value');
    const universityCards = document.querySelectorAll('.btn-primary[data-uni]');
    
    // Handle university card clicks
    universityCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const uni = e.target.dataset.uni;
            const targetTab = document.querySelector(`.calculator-tabs .tab-btn[data-formula][data-uni="${uni}"]`);
            if (targetTab) {
                // Activate the corresponding tab
                document.querySelector('.calculator-tabs .tab-btn.active').classList.remove('active');
                targetTab.classList.add('active');
                activeFormula = parseFloat(targetTab.dataset.formula);
                calculateCGPA();
            }
            // Smooth scroll to calculator
            document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initialize Calculator
    function initCalculator() {
        renderSemesters();
        setupEventListeners();
    }

    // Event Listeners
    function setupEventListeners() {
        // Tab switching
        calculatorTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                document.querySelector('.tab-btn.active').classList.remove('active');
                e.target.classList.add('active');
                activeFormula = parseFloat(e.target.dataset.formula);
                calculateCGPA();
            }
        });

        // Add semester
        addSemesterBtn.addEventListener('click', () => {
            semesters.push({
                id: semesters.length + 1,
                courses: [{
                    name: '',
                    credits: 4,
                    grade: 10
                }]
            });
            renderSemesters();
        });

        // Calculate CGPA
        calculateBtn.addEventListener('click', calculateCGPA);
    }

    // Render Functions
    function renderSemesters() {
        semesterContainer.innerHTML = semesters.map((semester, index) => `
            <div class="semester" data-semester="${index}">
                <h3>Semester ${semester.id}</h3>
                <div class="course-list">
                    ${renderCourses(semester.courses, index)}
                </div>
                <button class="add-course-btn" data-semester="${index}">+ Add Course</button>
            </div>
        `).join('');

        // Add event listeners to new elements
        setupSemesterListeners();
    }

    function renderCourses(courses, semesterIndex) {
        return courses.map((course, courseIndex) => `
            <div class="course-row" data-course="${courseIndex}">
                <input type="text" class="course-name" placeholder="Course Name" value="${course.name}">
                <select class="course-credits">
                    ${[1,2,3,4,5].map(credit => 
                        `<option value="${credit}" ${credit === course.credits ? 'selected' : ''}>${credit} Credit${credit !== 1 ? 's' : ''}</option>`
                    ).join('')}
                </select>
                <select class="course-grade">
                    ${[
                        {value: 10, label: 'O / A+'},
                        {value: 9, label: 'A'},
                        {value: 8, label: 'B+'},
                        {value: 7, label: 'B'},
                        {value: 6, label: 'C'},
                        {value: 5, label: 'D'},
                        {value: 0, label: 'F'}
                    ].map(grade => 
                        `<option value="${grade.value}" ${grade.value === course.grade ? 'selected' : ''}>${grade.label}</option>`
                    ).join('')}
                </select>
                <button class="remove-course" title="Remove Course">×</button>
            </div>
        `).join('');
    }

    function setupSemesterListeners() {
        // Add course buttons
        document.querySelectorAll('.add-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const semesterIndex = parseInt(e.target.dataset.semester);
                semesters[semesterIndex].courses.push({
                    name: '',
                    credits: 4,
                    grade: 10
                });
                renderSemesters();
            });
        });

        // Remove course buttons
        document.querySelectorAll('.remove-course').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseRow = e.target.closest('.course-row');
                const semester = e.target.closest('.semester');
                const semesterIndex = parseInt(semester.dataset.semester);
                const courseIndex = parseInt(courseRow.dataset.course);

                if (semesters[semesterIndex].courses.length > 1) {
                    semesters[semesterIndex].courses.splice(courseIndex, 1);
                    renderSemesters();
                }
            });
        });

        // Course input changes
        document.querySelectorAll('.course-row').forEach(row => {
            const semesterIndex = parseInt(row.closest('.semester').dataset.semester);
            const courseIndex = parseInt(row.dataset.course);

            row.querySelector('.course-name').addEventListener('input', (e) => {
                semesters[semesterIndex].courses[courseIndex].name = e.target.value;
            });

            row.querySelector('.course-credits').addEventListener('change', (e) => {
                semesters[semesterIndex].courses[courseIndex].credits = parseInt(e.target.value);
                calculateCGPA();
            });

            row.querySelector('.course-grade').addEventListener('change', (e) => {
                semesters[semesterIndex].courses[courseIndex].grade = parseInt(e.target.value);
                calculateCGPA();
            });
        });
    }

    // Calculation Functions
    function calculateCGPA() {
        let totalCredits = 0;
        let totalGradePoints = 0;

        semesters.forEach(semester => {
            semester.courses.forEach(course => {
                totalCredits += course.credits;
                totalGradePoints += course.credits * course.grade;
            });
        });

        const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
        const percentage = (cgpa * activeFormula).toFixed(2);

        cgpaValue.textContent = cgpa;
        percentageValue.textContent = percentage + '%';

        updatePerformanceHighlight(parseFloat(cgpa));
    }

    function updatePerformanceHighlight(cgpa) {
        const scaleItems = document.querySelectorAll('.scale-item');
        scaleItems.forEach(item => item.classList.remove('active'));

        if (cgpa >= 9.0) scaleItems[0].classList.add('active');
        else if (cgpa >= 8.0) scaleItems[1].classList.add('active');
        else if (cgpa >= 7.0) scaleItems[2].classList.add('active');
        else if (cgpa >= 6.0) scaleItems[3].classList.add('active');
        else scaleItems[4].classList.add('active');
    }

    // Initialize the calculator
    initCalculator();
});

