const inputs = Array.from(document.querySelectorAll(".otp-input"));
const phoneDisplay = document.getElementById("phoneDisplay");
const verifyBtn = document.getElementById("verifyBtn");
const invalid_error = document.getElementById("invalid_error");
const empty_error = document.getElementById("empty_error");
const storedOtp = localStorage.getItem("site_otp_code") || "";
const storedPhone = localStorage.getItem("site_otp_phone") || "-";
phoneDisplay.textContent = storedPhone;
inputs.forEach((input, idx) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value && idx < inputs.length - 1) inputs[idx + 1].focus();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && idx > 0)
      inputs[idx - 1].focus();
  });
});
inputs[0].focus();
verifyBtn.addEventListener("click", () => {
  const code = inputs.map((i) => i.value).join("");
  if (code === storedOtp) {
    window.location.href = "taxi-city.html";
  } else {
    if(inputs[0]==""){
      empty_error.style.display="block";
      invalid_error.style.display="none";
      return;
    }
    else{
      empty_error.style.display="none";
      invalid_error.style.display="block";
      return;
    }
  }
});
