document.addEventListener('DOMContentLoaded', function () {
  // 1. Bootstrap Form Validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      },
      false
    );
  });

  // 2. Password Match Validation on Registration Page
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      const pwd = document.getElementById('password').value;
      const confirmPwd = document.getElementById('confirm_password').value;
      const feedbackEl = document.getElementById('passwordMismatchFeedback');
      if (pwd !== confirmPwd) {
        e.preventDefault();
        if (feedbackEl) feedbackEl.classList.remove('d-none');
      } else if (feedbackEl) {
        feedbackEl.classList.add('d-none');
      }
    });
  }

  // 3. Load Dynamic Chart.js Charts from Flask /api/chart-data/<student_id>
  const chartContainer = document.getElementById('studentChartsContainer');
  if (chartContainer && typeof Chart !== 'undefined') {
    const studentId = chartContainer.getAttribute('data-student-id');
    if (studentId) {
      fetch(`/api/chart-data/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          const attCtx = document.getElementById('attendanceBarChart');
          if (attCtx) {
            new Chart(attCtx, {
              type: 'bar',
              data: {
                labels: data.subject_labels,
                datasets: [
                  {
                    label: 'Attendance %',
                    data: data.attendance_percentages,
                    backgroundColor: '#4F46E5',
                    borderRadius: 6,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              },
            });
          }

          const examCtx = document.getElementById('examLineChart');
          if (examCtx) {
            new Chart(examCtx, {
              type: 'line',
              data: {
                labels: data.exam_labels,
                datasets: [
                  {
                    label: 'Exam Percentage %',
                    data: data.exam_percentages,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    tension: 0.35,
                    fill: true,
                    pointRadius: 4,
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              },
            });
          }

          const asgCtx = document.getElementById('assignmentDoughnutChart');
          if (asgCtx) {
            new Chart(asgCtx, {
              type: 'doughnut',
              data: {
                labels: ['Completed', 'Pending'],
                datasets: [
                  {
                    data: [data.completed_assignments, data.pending_assignments],
                    backgroundColor: ['#10B981', '#F59E0B'],
                    borderWidth: 0,
                  },
                ],
              },
              options: {
                responsive: true,
                cutout: '70%',
              },
            });
          }
        })
        .catch((err) => console.error('Failed to load chart data:', err));
    }
  }

  // 4. Print / Download PDF Report Trigger
  const printReportBtn = document.getElementById('downloadPdfReportBtn');
  if (printReportBtn) {
    printReportBtn.addEventListener('click', function () {
      window.print();
    });
  }
});
