// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check system preference for dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Function to update dark mode
const updateDarkMode = (isDark) => {
    html.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Update favicon based on theme
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = isDark ? '/favicon-dark.ico' : '/favicon.ico';
    }
};

// Initialize dark mode
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'enabled' || (savedDarkMode === null && prefersDark.matches)) {
    updateDarkMode(true);
}

// Listen for dark mode toggle
darkModeToggle.addEventListener('click', () => {
    updateDarkMode(!html.classList.contains('dark'));
});

// Listen for system preference changes
prefersDark.addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
        updateDarkMode(e.matches);
    }
});

// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(tabId + 'Tab').classList.add('active');
    });
});

// Handle tab switching with keyboard
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// Add subject row
document.getElementById('addSubject').addEventListener('click', () => {
    const container = document.getElementById('subjectsContainer');
    const rowCount = container.children.length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'subject-row grid grid-cols-1 md:grid-cols-3 gap-4 fade-in';
    
    newRow.innerHTML = `
        <div class="input-group">
            <label class="input-label required" for="subject${rowCount}">Subject Name</label>
            <input type="text" id="subject${rowCount}" placeholder="Enter subject name" class="input-field" required>
        </div>
        <div class="input-group">
            <label class="input-label required" for="grade${rowCount}">Grade</label>
            <select id="grade${rowCount}" class="input-field" required>
                <option value="" disabled selected>Select Grade</option>
                <option value="10">S/O/A+</option>
                <option value="9">A</option>
                <option value="8">B</option>
                <option value="7">C</option>
                <option value="6">D</option>
                <option value="5">E</option>
                <option value="0">F</option>
            </select>
        </div>
        <div class="input-group">
            <label class="input-label required" for="credits${rowCount}">Credits</label>
            <input type="number" id="credits${rowCount}" placeholder="1-5" class="input-field" min="1" max="5" required>
        </div>
    `;
    
    container.appendChild(newRow);

    // Focus the new subject input
    newRow.querySelector('input[type="text"]').focus();

    // Add event listeners for validation
    const inputs = newRow.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            document.getElementById('cgpaError').classList.add('hidden');
        });
    });
});

// Add semester row
document.getElementById('addSemester').addEventListener('click', () => {
    const container = document.getElementById('semestersContainer');
    const newRow = document.createElement('div');
    newRow.className = 'semester-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 fade-in';
    
    newRow.innerHTML = `
        <input type="number" placeholder="Enter SGPA" class="input-field" step="0.01" min="0" max="10">
        <input type="number" placeholder="Credits in Semester" class="input-field" min="1">
    `;
    
    container.appendChild(newRow);
});

// Calculate CGPA
document.getElementById('calculateCGPA').addEventListener('click', () => {
    const rows = document.querySelectorAll('.subject-row');
    let totalCredits = 0;
    let totalPoints = 0;
    let isValid = true;
    let errorMessage = '';

    rows.forEach((row, index) => {
        const subjectInput = row.querySelector('input[type="text"]');
        const gradeSelect = row.querySelector('select');
        const creditsInput = row.querySelector('input[type="number"]');

        const subject = subjectInput.value.trim();
        const grade = parseFloat(gradeSelect.value);
        const credits = parseFloat(creditsInput.value);

        // Validation
        if (!subject) {
            isValid = false;
            errorMessage = 'Please enter all subject names';
            subjectInput.classList.add('error');
        } else {
            subjectInput.classList.remove('error');
        }

        if (!gradeSelect.value) {
            isValid = false;
            errorMessage = errorMessage || 'Please select all grades';
            gradeSelect.classList.add('error');
        } else {
            gradeSelect.classList.remove('error');
        }

        if (isNaN(credits) || credits < 1 || credits > 5) {
            isValid = false;
            errorMessage = errorMessage || 'Please enter valid credits (1-5)';
            creditsInput.classList.add('error');
        } else {
            creditsInput.classList.remove('error');
        }

        if (!isNaN(grade) && !isNaN(credits)) {
            totalPoints += grade * credits;
            totalCredits += credits;
        }
    });

    const resultElement = document.getElementById('cgpaResult');
    const errorElement = document.getElementById('cgpaError');
    
    if (!isValid) {
        resultElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        errorElement.querySelector('span').textContent = errorMessage;
        return;
    }

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    const percentage = (cgpa * 9.5).toFixed(2);
    
    resultElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
    resultElement.querySelector('span').textContent = `Your CGPA: ${cgpa} (${percentage}%)`;

    // Save to history
    const history = JSON.parse(localStorage.getItem('cgpaHistory') || '[]');
    history.unshift({
        date: new Date().toISOString(),
        cgpa: cgpa,
        percentage: percentage,
        totalCredits: totalCredits
    });
    if (history.length > 10) history.pop(); // Keep only last 10 entries
    localStorage.setItem('cgpaHistory', JSON.stringify(history));
});

// Reset CGPA Calculator
document.getElementById('resetCGPA').addEventListener('click', () => {
    document.getElementById('subjectsContainer').innerHTML = `
        <div class="subject-row grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input type="text" placeholder="Subject Name" class="input-field">
            <select class="input-field">
                <option value="">Select Grade</option>
                <option value="10">S/O/A+</option>
                <option value="9">A</option>
                <option value="8">B</option>
                <option value="7">C</option>
                <option value="6">D</option>
                <option value="5">E</option>
                <option value="0">F</option>
            </select>
            <input type="number" placeholder="Credits" class="input-field" min="1" max="5">
        </div>
    `;
    document.getElementById('cgpaResult').querySelector('span').textContent = '';
});

// CGPA to Percentage Converter
function convertCGPAToPercentage() {
    const cgpa = parseFloat(document.getElementById('cgpaInput').value);
    if (!isNaN(cgpa) && cgpa >= 0 && cgpa <= 10) {
        const percentage = (cgpa * 9.5).toFixed(2);
        document.getElementById('percentageResult').textContent = `Percentage: ${percentage}%`;
    } else {
        document.getElementById('percentageResult').textContent = 'Please enter a valid CGPA (0-10)';
    }
}

// Percentage to CGPA Converter
function convertPercentageToCGPA() {
    const percentage = parseFloat(document.getElementById('percentageInput').value);
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
        const cgpa = (percentage / 9.5).toFixed(2);
        document.getElementById('cgpaResult2').textContent = `CGPA: ${cgpa}`;
    } else {
        document.getElementById('cgpaResult2').textContent = 'Please enter a valid percentage (0-100)';
    }
}

// Calculate SGPA to CGPA
function calculateSGPAtoCGPA() {
    const rows = document.querySelectorAll('.semester-row');
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach(row => {
        const sgpa = parseFloat(row.querySelector('input[type="number"]:first-child').value);
        const credits = parseFloat(row.querySelector('input[type="number"]:last-child').value);
        
        if (!isNaN(sgpa) && !isNaN(credits)) {
            totalPoints += sgpa * credits;
            totalCredits += credits;
        }
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById('sgpaResult').textContent = `Your CGPA: ${cgpa}`;
}

// Reset SGPA Calculator
document.getElementById('resetSGPA').addEventListener('click', () => {
    document.getElementById('semestersContainer').innerHTML = `
        <div class="semester-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="number" placeholder="Enter SGPA" class="input-field" step="0.01" min="0" max="10">
            <input type="number" placeholder="Credits in Semester" class="input-field" min="1">
        </div>
    `;
    document.getElementById('sgpaResult').textContent = '';
});

// FAQ Section
const faqs = [
    {
        question: "What is CGPA and why is it important?",
        answer: "CGPA (Cumulative Grade Point Average) is a standardized measure of academic performance that represents your overall grade point average across all semesters. It's important because it's often used for higher education admissions, job applications, and academic evaluations."
    },
    {
        question: "How do I calculate my CGPA manually?",
        answer: "To calculate CGPA manually: 1) Multiply each course grade point by its credit hours, 2) Add up all these products, 3) Sum up all credit hours, 4) Divide the total grade points by total credit hours. Our calculator automates this process for accuracy."
    },
    {
        question: "What's the difference between SGPA and CGPA?",
        answer: "SGPA (Semester Grade Point Average) represents your performance in a single semester, while CGPA is the cumulative average of all semesters combined. SGPA gives a snapshot of one semester, while CGPA shows your overall academic performance."
    },
    {
        question: "How accurate is the CGPA to percentage conversion?",
        answer: "The standard conversion uses a multiplier of 9.5 (Percentage = CGPA × 9.5). While this is widely accepted, some institutions may use different factors. Our calculator uses the standard 9.5 multiplier as it's the most commonly used formula."
    },
    {
        question: "Which universities use the 10-point CGPA system?",
        answer: "Many Indian universities including VIT, SRM, and KTU use the 10-point CGPA system. However, the grade-to-point conversion might vary slightly between institutions. Our calculator supports multiple university formats."
    },
    {
        question: "Can I calculate CGPA with unequal credit hours?",
        answer: "Yes, our calculator handles courses with different credit hours. The formula automatically weights each course based on its credit hours when calculating the final CGPA."
    },
    {
        question: "How do I improve my CGPA?",
        answer: "To improve your CGPA: 1) Focus on high-credit courses as they have more impact, 2) Maintain consistent performance across semesters, 3) Consider retaking courses with low grades if your institution allows it, 4) Seek help early if struggling in any subject."
    },
    {
        question: "Is CGPA calculated the same way in all universities?",
        answer: "While the basic principle is similar, universities may have slight variations in their grading scales and calculation methods. Our calculator supports multiple university systems including VIT, SRM, and KTU."
    },
    {
        question: "What is a good CGPA?",
        answer: "Generally, a CGPA above 8.0 is considered excellent, 7.0-8.0 is very good, and 6.0-7.0 is good. However, standards may vary by institution and field of study. Many top companies and graduate schools look for a minimum CGPA of 7.0 or higher."
    },
    {
        question: "Can I convert my percentage to CGPA?",
        answer: "Yes, you can convert percentage to CGPA using our calculator. The standard formula is: CGPA = Percentage ÷ 9.5. However, some institutions may use different conversion factors."
    }
];

// Populate FAQ section
const faqContainer = document.getElementById('faqContainer');
faqs.forEach(faq => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    
    faqItem.innerHTML = `
        <button class="faq-question w-full" aria-expanded="false">
            <span>${faq.question}</span>
            <svg class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
        </button>
        <div class="faq-answer hidden">
            ${faq.answer}
        </div>
    `;
    
    faqContainer.appendChild(faqItem);
});

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('svg');
        
        answer.classList.toggle('hidden');
        icon.style.transform = answer.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        button.setAttribute('aria-expanded', !answer.classList.contains('hidden'));
    });
});
