const form = document.getElementById("resultForm");
const message = document.getElementById("message");
const resultBox = document.getElementById("resultBox");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const registration_no = document
    .getElementById("regNo")
    .value
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

  message.textContent = "Checking result...";
  resultBox.innerHTML = "";

  try {
    const response = await fetch("/.netlify/functions/get-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_no })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.error || "Invalid Registration No.";
      return;
    }

    message.textContent = "";

    const marks = parseFloat(data.obtained_marks);
    let percentage = "-";
    let eligibilityText = "Not Eligible for Scholarship";
    let scholarshipClass = "fail";

    if (!isNaN(marks)) {
      percentage = marks.toFixed(2);

      if (marks >= 60) {
        eligibilityText = "🎉 Congratulations! You have been awarded 20% Scholarship.";
        scholarshipClass = "success";
      }
    }

    resultBox.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <img src="Educare.jpg" alt="School Logo" class="result-logo">
          <h2>The EduCare School & College Gadoon</h2>
          <h3>Scholarship Test 2026 Result</h3>
        </div>

        <hr>

        <div class="row"><strong>Registration No:</strong><span>${data.registration_no}</span></div>
        <div class="row"><strong>Student Name:</strong><span>${data.student_name}</span></div>
        <div class="row"><strong>Father Name:</strong><span>${data.father_name || "-"}</span></div>
        <div class="row"><strong>Previous School:</strong><span>${data.school || "-"}</span></div>
        <div class="row"><strong>Address:</strong><span>${data.address || "-"}</span></div>

        <hr>

        <div class="row"><strong>9th Marks:</strong><span>${data.ninth_marks || "-"}</span></div>
        <div class="row"><strong>Test Marks:</strong><span>${data.obtained_marks || "-"} / 100</span></div>
        <div class="row"><strong>Percentage:</strong><span>${percentage}%</span></div>

        <div class="scholarship ${scholarshipClass}">
          Scholarship Status: ${eligibilityText}
        </div>

        <button class="print-btn" onclick="window.print()">Print Result</button>
      </div>
    `;
  } catch (error) {
    message.textContent = "Server error. Please try again.";
  }
});