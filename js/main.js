// Mobile menu toggle
function toggleMenu() {
  var m = document.getElementById('mobileMenu');
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

// Booking form submission
function submitBooking() {
  var name    = document.getElementById('fname').value;
  var phone   = document.getElementById('phone').value;
  var service = document.getElementById('service').value;
  var date    = document.getElementById('date').value;
  var time    = document.getElementById('time').value;

  if (!name || !phone || !service || !date || !time) {
    alert('Please fill in all required fields before confirming.');
    return;
  }

  document.getElementById('successMsg').style.display = 'block';

  var btn = document.querySelector('.submit-btn');
  btn.textContent = 'Booking confirmed ✓';
  btn.style.background = '#0F9E6A';
  btn.disabled = true;

  document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Set min date to today so past dates can't be selected
document.addEventListener('DOMContentLoaded', function () {
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('date').min = today;
});
