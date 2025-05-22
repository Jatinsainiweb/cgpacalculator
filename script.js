document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const semesterInputs = document.getElementById('semester-inputs');
    const addSemesterBtn = document.getElementById('add-semester');
    const calculateBtn = document.getElementById('calculate-cgpa');
    const resultDiv = document.getElementById('result');
    const cgpaValue = document.getElementById('cgpa-value');
    
    // Initialize semester counter
    let semesterCount = 1;
    
    // Add new semester row
    addSemesterBtn.addEventListener('click', () => {
        semesterCount++;
        const newRow = document.createElement('div');
        newRow.className = 'semester-row bg-gray-50 p-5 rounded-lg border border-gray-200 transition-all hover:shadow-md';
        newRow.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 flex items-center">
                    <i class="fas fa-bookmark text-primary-500 mr-2"></i>
                    <span class="semester-name">Semester ${semesterCount}</span>
                </h3>
                <button type="button" class="remove-semester text-red-500 hover:text-red-700 transition-colors">
                    <i class="fas fa-times-circle"></i> Remove
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">SGPA (Semester GPA)</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-chart-line text-gray-400"></i>
                        </div>
                        <input type="number" step="0.01" min="0" max="10" placeholder="Enter SGPA (0-10)" 
                               class="sgpa pl-10 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 transition-all" required>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Percentage</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-award text-gray-400"></i>
                        </div>
                        <input type="number" step="1" min="0" max="100" placeholder="Enter Percentage (0-100)" 
                               class="percentage pl-10 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 transition-all" required>
                    </div>
                </div>
            </div>
        `;
        semesterInputs.appendChild(newRow);
        
        // Add event listener to the remove button
        const removeBtn = newRow.querySelector('.remove-semester');
        removeBtn.addEventListener('click', () => {
            // Add fadeout animation before removing
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(10px)';
            newRow.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                newRow.remove();
                updateSemesterNumbers();
            }, 300);
        });

        // Animate the new row
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(10px)';
        setTimeout(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
            newRow.style.transition = 'opacity 0.5s, transform 0.5s';
        }, 10);
        
        updateRemoveButtons();
    });
    
    // Show the remove button for the first semester if more than one semester exists
    function updateRemoveButtons() {
        const rows = document.querySelectorAll('.semester-row');
        rows.forEach((row, index) => {
            const removeBtn = row.querySelector('.remove-semester');
            if (rows.length > 1) {
                removeBtn.classList.remove('hidden');
            } else {
                removeBtn.classList.add('hidden');
            }
        });
    }
    
    // Update semester numbers after removal
    function updateSemesterNumbers() {
        semesterCount = 0;
        const rows = document.querySelectorAll('.semester-row');
        rows.forEach((row, index) => {
            semesterCount++;
            const semesterName = row.querySelector('.semester-name');
            semesterName.textContent = `Semester ${semesterCount}`;
        });
        updateRemoveButtons();
    }
    
    // Calculate CGPA
    calculateBtn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.semester-row');
        let totalWeightedPoints = 0;
        let totalPercentage = 0;
        let isValid = true;
        
        // Reset any previous errors
        document.querySelectorAll('.sgpa, .percentage').forEach(input => {
            input.classList.remove('border-red-500');
            input.classList.remove('input-error');
        });
        
        rows.forEach(row => {
            const sgpaInput = row.querySelector('.sgpa');
            const percentageInput = row.querySelector('.percentage');
            
            const sgpa = parseFloat(sgpaInput.value);
            const percentage = parseFloat(percentageInput.value);
            
            // Validate inputs
            if (isNaN(sgpa) || isNaN(percentage) || sgpa < 0 || sgpa > 10 || percentage < 0 || percentage > 100) {
                isValid = false;
                if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
                    sgpaInput.classList.add('border-red-500');
                    sgpaInput.classList.add('input-error');
                    // Shake animation for invalid inputs
                    sgpaInput.animate([
                        { transform: 'translateX(0px)' },
                        { transform: 'translateX(-5px)' },
                        { transform: 'translateX(5px)' },
                        { transform: 'translateX(-5px)' },
                        { transform: 'translateX(0px)' }
                    ], {
                        duration: 300
                    });
                }
                
                if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                    percentageInput.classList.add('border-red-500');
                    percentageInput.classList.add('input-error');
                    // Shake animation for invalid inputs
                    percentageInput.animate([
                        { transform: 'translateX(0px)' },
                        { transform: 'translateX(-5px)' },
                        { transform: 'translateX(5px)' },
                        { transform: 'translateX(-5px)' },
                        { transform: 'translateX(0px)' }
                    ], {
                        duration: 300
                    });
                }
            } else {
                // Calculate credit points for this semester
                const weightedPoints = sgpa * percentage;
                totalWeightedPoints += weightedPoints;
                totalPercentage += percentage;
            }
        });
        
        if (isValid) {
            // Calculate CGPA
            const cgpa = totalWeightedPoints / totalPercentage;
            
            // Display result with animation
            resultDiv.classList.remove('hidden');
            cgpaValue.textContent = '0.00';
            
            // Animate the counting effect
            const duration = 1000; // 1 second
            const frameDuration = 1000/60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;
            
            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentCount = progress * cgpa;
                
                cgpaValue.textContent = currentCount.toFixed(2);
                
                if (frame === totalFrames) {
                    clearInterval(counter);
                    cgpaValue.textContent = cgpa.toFixed(2);
                }
            }, frameDuration);
            
            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Add a little celebration effect
            if (cgpa >= 8.5) {
                // Display a congratulations message for high CGPA
                const congrats = document.createElement('p');
                congrats.className = 'text-green-600 mt-2 animate-fadeIn';
                congrats.innerHTML = '<i class="fas fa-trophy mr-1"></i> Excellent performance!';
                
                // Remove any existing congratulations message
                const existingCongrats = resultDiv.querySelector('.text-green-600');
                if (existingCongrats) {
                    existingCongrats.remove();
                }
                
                // Add the new congratulations message
                resultDiv.querySelector('div').appendChild(congrats);
            }
        } else {
            // Better error handling with custom message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'fixed inset-0 flex items-center justify-center z-50';
            errorMessage.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-50" id="error-overlay"></div>
                <div class="bg-white rounded-lg p-6 shadow-xl relative z-10 max-w-md mx-4 animate-fadeIn">
                    <div class="flex items-start mb-4">
                        <div class="bg-red-100 p-2 rounded-full mr-3">
                            <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Invalid Input</h3>
                            <p class="text-gray-600">Please check your entries and ensure:</p>
                            <ul class="list-disc ml-5 mt-2 text-gray-600">
                                <li>SGPA is between 0 and 10</li>
                                <li>Credits are at least 1</li>
                                <li>All fields are filled</li>
                            </ul>
                        </div>
                    </div>
                    <button id="close-error" class="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all w-full">
                        Got it
                    </button>
                </div>
            `;
            
            document.body.appendChild(errorMessage);
            
            // Close error message when clicking the button or overlay
            document.getElementById('close-error').addEventListener('click', () => {
                errorMessage.style.opacity = '0';
                errorMessage.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            });
            
            document.getElementById('error-overlay').addEventListener('click', () => {
                errorMessage.style.opacity = '0';
                errorMessage.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            });
        }
    });
    
    // Event delegation for remove buttons
    semesterInputs.addEventListener('click', (e) => {
        // Use closest to find the button even if icon was clicked
        const removeBtn = e.target.closest('.remove-semester');
        if (removeBtn) {
            const row = removeBtn.closest('.semester-row');
            // Add fadeout animation before removing
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            row.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                row.remove();
                updateSemesterNumbers();
            }, 300);
        }
    });
    
    // Initialize remove buttons
    updateRemoveButtons();
});
