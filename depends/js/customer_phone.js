const phoneInput = document.getElementById("phone");
const sendBtn = document.getElementById("sendBtn");
const code = document.getElementById("code");
const card2 = document.getElementById("card2");
const card1 = document.getElementById("card1");
const btncode = document.getElementById("btncode");
const invalid = document.getElementById("invalid_error");
const empty = document.getElementById("empty_error");
function validPhone(v) {
  return /^07\d{8}$/.test(v);
}
phoneInput.addEventListener("inpu t", () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
  sendBtn.disabled = !validPhone(phoneInput.value.trim());
});
sendBtn.addEventListener("click", () => {
  const phone = phoneInput.value.trim();
  if (phone == "") {
    empty.style.display = "block";
    invalid.style.display = "none";
    return;
  } else if (!validPhone(phone)) {
    empty.style.display = "none";
    invalid.style.display = "block";
    return;
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  localStorage.setItem("site_otp_code", otp);
  localStorage.setItem("site_otp_phone", phone);
  card1.style.display = "none";
  card2.style.display = "block";
  code.innerHTML = otp;
});
btncode.addEventListener("click", () => {
  window.location.href = "customer_varify.html";
});
