// Mobile menu toggle
function toggleMenu() {
  var m = document.getElementById('mobileMenu');
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

// Booking form submission
async function submitBooking() {
  var name    = document.getElementById('fname').value.trim();
  var phone   = document.getElementById('phone').value.trim();
  var service = document.getElementById('service').value;
  var date    = document.getElementById('date').value;
  var time    = document.getElementById('time').value;
  var plate   = document.getElementById('plate').value.trim();
  var promo   = document.getElementById('promo').value.trim();
  var smsOptIn = document.getElementById('smsNotify').checked;

  if (!name || !phone || !service || !date || !time) {
    alert('Please fill in all required fields before confirming.');
    return;
  }

  var btn = document.querySelector('.submit-btn');
  var originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Booking…';

  var { error } = await supabaseClient.from('bookings').insert([{
    name: name,
    phone: phone,
    service: service,
    booking_date: date,
    booking_time: time,
    plate: plate || null,
    promo_code: promo || null,
    sms_opt_in: smsOptIn
  }]);

  if (error) {
    console.error('Booking insert failed:', error);
    alert('Sorry, something went wrong saving your booking. Please try again or WhatsApp us directly.');
    btn.disabled = false;
    btn.textContent = originalText;
    return;
  }

  document.getElementById('successMsg').style.display = 'block';
  btn.textContent = 'Booking confirmed ✓';
  btn.style.background = '#0F9E6A';

  document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Set min date to today so past dates can't be selected
document.addEventListener('DOMContentLoaded', function () {
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('date').min = today;
});
