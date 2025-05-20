// --- CGPA Calculator ---
const subjectsContainer = document.getElementById('subjects-container');
const addSubjectBtn = document.getElementById('add-subject');
const cgpaResult = document.getElementById('cgpaResult');

function calculateCGPA() {
  const rows = subjectsContainer.querySelectorAll('.subject-row');
  let totalGrade = 0, count = 0;
  rows.forEach(row => {
    const gradeInput = row.querySelector('.subject-grade');
    const grade = parseFloat(gradeInput.value);
    if (!isNaN(grade)) {
      totalGrade += grade;
      count++;
    }
  });
  const cgpa = count ? (totalGrade / count) : 0;
  cgpaResult.textContent = cgpa.toFixed(2);
}

function addSubjectRow(name = '', grade = '', percentage = '') {
  const row = document.createElement('div');
  row.className = 'subject-row';
  row.innerHTML = `
    <input type="text" class="subject-name" placeholder="Subject Name" value="${name}" required>
    <input type="number" class="subject-grade" placeholder="Grade (e.g. 9.2)" min="0" max="10" step="0.01" value="${grade}" required>
    <input type="number" class="subject-percentage" placeholder="Percentage (e.g. 92)" min="0" max="100" step="0.01" value="${percentage}" required>
    <button type="button" class="remove-subject" title="Remove Subject">&minus;</button>
  `;
  row.querySelector('.remove-subject').onclick = () => {
    if (subjectsContainer.children.length > 1) {
      row.remove();
      calculateCGPA();
    }
  };
  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateCGPA);
  });
  subjectsContainer.appendChild(row);
}

addSubjectBtn.onclick = () => {
  addSubjectRow();
};

// Initial row already exists, add listeners
subjectsContainer.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', calculateCGPA);
});
subjectsContainer.querySelector('.remove-subject').onclick = function() {
  if (subjectsContainer.children.length > 1) {
    this.parentElement.remove();
    calculateCGPA();
  }
};

// --- CGPA to Percentage Converter ---
const cgpaInput = document.getElementById('cgpaInput');
const universitySelect = document.getElementById('universitySelect');
const percentageResult = document.getElementById('percentageResult');

const cgpaToPercentageFormulas = {
  vit: cgpa => cgpa * 10,
  srm: cgpa => (cgpa - 0.5) * 10,
  du: cgpa => (cgpa - 0.5) * 9.5 + 5,
  aktu: cgpa => cgpa * 10,
  jntu: cgpa => (cgpa - 0.75) * 10
};

function updatePercentageResult() {
  const cgpa = parseFloat(cgpaInput.value);
  const university = universitySelect.value;
  let percentage = 0;
  if (!isNaN(cgpa) && cgpaToPercentageFormulas[university]) {
    percentage = cgpaToPercentageFormulas[university](cgpa);
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
  }
  percentageResult.textContent = percentage.toFixed(2);
}

cgpaInput.addEventListener('input', updatePercentageResult);
universitySelect.addEventListener('change', updatePercentageResult);

// --- Percentage to CGPA Converter ---
const percentageInput = document.getElementById('percentageInput');
const cgpaFromPercentage = document.getElementById('cgpaFromPercentage');

function updateCGPAFromPercentage() {
  const percentage = parseFloat(percentageInput.value);
  let cgpa = 0;
  if (!isNaN(percentage)) {
    cgpa = percentage / 10;
    if (cgpa > 10) cgpa = 10;
    if (cgpa < 0) cgpa = 0;
  }
  cgpaFromPercentage.textContent = cgpa.toFixed(2);
}

percentageInput.addEventListener('input', updateCGPAFromPercentage);

// --- Animation on load ---
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.style.opacity = 1;
  }, 100);
});