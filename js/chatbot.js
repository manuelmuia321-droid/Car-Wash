var OWNER_PHONE = '254700000000';
var chatOpen = false;
var bookingStep = null;
var bookingData = {};

// ── FAQ response functions ────────────────────────────────────────────────────

function faqGreet() {
  return "👋 Habari! I'm Sparky, SparkWash KE's AI assistant.\n\nI can answer questions, book a wash for you, or connect you with the owner directly. How can I help?";
}

function faqPrices() {
  return "💰 Here are our prices:\n\n• Quick Rinse — KSh 300\n• Signature Wash — KSh 700\n• Full Detailing — KSh 2,500\n• Van & SUV Wash — KSh 1,200\n\nFirst-time customer? Use code SPARK20 for 20% off! 🎉";
}

function faqHours() {
  return "🕐 We're open:\n• Mon–Fri: 7:00 AM – 7:00 PM\n• Saturday: 7:00 AM – 6:00 PM\n• Sunday: 8:00 AM – 4:00 PM\n• Public holidays: 8:00 AM – 3:00 PM\n\nWould you like to book a slot?";
}

function faqLocation() {
  return "📍 We're on Waiyaki Way, Westlands, Nairobi — opposite ABC Place Mall, near the Shell petrol station.\n\nEasy to drop your car off on the way to work!";
}

function faqDiscount() {
  return "🎉 Yes! First-time customers get 20% OFF any wash. Just use promo code SPARK20 when booking online or mention it when you arrive. Valid once per customer.";
}

function faqNotify() {
  return "📲 Yes! When you book, tick the \"Notify me\" box. We'll send you an SMS the moment your car is washed and ready. No more waiting around — go run errands and come back when it's done!";
}

function faqServices() {
  return "✨ We offer four services:\n\n1. Quick Rinse (KSh 300) — fast exterior wash\n2. Signature Wash (KSh 700) — inside & out, most popular\n3. Full Detailing (KSh 2,500) — deep clean, polish & wax\n4. Van & SUV (KSh 1,200) — for larger vehicles\n\nWhich one interests you?";
}

function faqPayment() {
  return "💳 We accept:\n• M-Pesa (most popular)\n• Cash\n• Bank card\n\nPayment is done at the wash after your car is ready.";
}

function faqThanks() {
  return "😊 You're welcome! Is there anything else I can help you with?";
}

function offerCall() {
  setTimeout(function () {
    var msgs = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.className = 'msg bot';
    d.innerHTML =
      '<strong>Connect with owner</strong>Tap below to call or WhatsApp the owner directly:<br><br>' +
      '<a class="call-owner-btn" href="tel:+' + OWNER_PHONE + '">📞 Call owner now</a>' +
      '<a class="wa-btn" href="https://wa.me/' + OWNER_PHONE + '?text=Hi%20SparkWash%20KE!%20I%20have%20a%20question." target="_blank">💬 WhatsApp owner</a>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);
  return null;
}

function offerWhatsApp() {
  setTimeout(function () {
    var msgs = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.className = 'msg bot';
    d.innerHTML =
      '<strong>WhatsApp the owner</strong>Tap below to open WhatsApp and chat directly:<br><br>' +
      '<a class="wa-btn" href="https://wa.me/' + OWNER_PHONE + '?text=Hi%20SparkWash%20KE!%20I%20saw%20your%20website." target="_blank">💬 Open WhatsApp</a>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);
  return null;
}

// ── Keyword → handler map ─────────────────────────────────────────────────────

var faqs = {
  'price|cost|how much|bei|charges|pricing': faqPrices,
  'hour|open|time|when|close|operating': faqHours,
  'location|where|address|find|nairobi|westlands': faqLocation,
  'book|appointment|reserve|schedule': startBooking,
  'discount|offer|promo|first time|new customer|20': faqDiscount,
  'sms|notify|notification|alert|done|ready|know when': faqNotify,
  'service|wash|detailing|types|options': faqServices,
  'call|speak|talk|owner|human|person|phone': offerCall,
  'whatsapp|chat|message|wa': offerWhatsApp,
  'hello|hi|hey|hujambo|habari|good morning|good afternoon': faqGreet,
  'thank|thanks|asante|sawa': faqThanks,
  'payment|pay|mpesa|cash|card': faqPayment,
};

// ── Guided booking flow ───────────────────────────────────────────────────────

function startBooking() {
  bookingStep = 'name';
  bookingData = {};
  return "📅 Great! Let me book a wash for you. I'll need a few quick details.\n\nFirst — what's your name?";
}

function handleBookingFlow(txt) {
  if (bookingStep === 'name') {
    bookingData.name = txt;
    bookingStep = 'phone';
    return 'Nice to meet you, ' + txt + '! 😊\n\nWhat\'s your phone number? (We\'ll SMS you when your car is ready)';
  }
  if (bookingStep === 'phone') {
    bookingData.phone = txt;
    bookingStep = 'service';
    setQuickBtns(['Quick Rinse – KSh 300', 'Signature Wash – KSh 700', 'Full Detailing – KSh 2,500', 'Van & SUV – KSh 1,200']);
    return 'Got it! Which service would you like?';
  }
  if (bookingStep === 'service') {
    bookingData.service = txt;
    bookingStep = 'date';
    clearQuickBtns();
    return 'Great choice! What date would you like? (e.g. Monday 16 June, or tomorrow)';
  }
  if (bookingStep === 'date') {
    bookingData.date = txt;
    bookingStep = 'time';
    setQuickBtns(['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']);
    return 'And what time works for you?';
  }
  if (bookingStep === 'time') {
    bookingData.time = txt;
    bookingStep = null;
    clearQuickBtns();
    notifyOwner();
    return confirmBooking();
  }
  return null;
}

function confirmBooking() {
  return (
    '✅ Booking confirmed!\n\n📋 Summary:\n' +
    '• Name: ' + bookingData.name + '\n' +
    '• Phone: ' + bookingData.phone + '\n' +
    '• Service: ' + bookingData.service + '\n' +
    '• Date: ' + bookingData.date + '\n' +
    '• Time: ' + bookingData.time + '\n\n' +
    "We'll SMS you when your car is ready. See you soon! 🚗💧"
  );
}

function notifyOwner() {
  var msg =
    'New booking via website chat!\n\n' +
    'Name: ' + bookingData.name + '\n' +
    'Phone: ' + bookingData.phone + '\n' +
    'Service: ' + bookingData.service + '\n' +
    'Date: ' + bookingData.date + '\n' +
    'Time: ' + bookingData.time;

  var waLink = 'https://wa.me/' + OWNER_PHONE + '?text=' + encodeURIComponent(msg);

  setTimeout(function () {
    var msgs = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.className = 'msg bot';
    d.innerHTML =
      '<strong>Owner notified</strong>The owner has been sent a WhatsApp notification about your booking. You can also message them directly:<br><br>' +
      '<a class="wa-btn" href="' + waLink + '" target="_blank">📲 View booking on WhatsApp</a>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1200);
}

// ── Core chat logic ───────────────────────────────────────────────────────────

function getResponse(txt) {
  if (bookingStep) return handleBookingFlow(txt);

  var lower = txt.toLowerCase();
  for (var pattern in faqs) {
    var keys = pattern.split('|');
    for (var i = 0; i < keys.length; i++) {
      if (lower.indexOf(keys[i]) > -1) return faqs[pattern]();
    }
  }

  return "I'm not sure about that one! 😅 I can help with:\n• Prices & services\n• Booking a wash\n• Our location & hours\n• Discounts\n• Connecting you with the owner\n\nWhat would you like to know?";
}

function addMsg(text, type) {
  var msgs = document.getElementById('chatMessages');
  var d = document.createElement('div');
  d.className = 'msg ' + type;
  d.style.whiteSpace = 'pre-line';
  d.textContent = text;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  var msgs = document.getElementById('chatMessages');
  var d = document.createElement('div');
  d.className = 'typing';
  d.id = 'typing-indicator';
  d.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  var t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function setQuickBtns(arr) {
  var qb = document.getElementById('quickBtns');
  qb.innerHTML = '';
  arr.forEach(function (label) {
    var b = document.createElement('button');
    b.className = 'qbtn';
    b.textContent = label;
    b.onclick = function () { sendMsg(label); };
    qb.appendChild(b);
  });
}

function clearQuickBtns() {
  document.getElementById('quickBtns').innerHTML = '';
}

function sendMsg(override) {
  var input = document.getElementById('chatInput');
  var txt = override || input.value.trim();
  if (!txt) return;
  input.value = '';
  clearQuickBtns();
  addMsg(txt, 'user');
  showTyping();
  setTimeout(function () {
    hideTyping();
    var reply = getResponse(txt);
    if (reply) addMsg(reply, 'bot');
    showDefaultQuickBtns();
  }, 800);
}

function showDefaultQuickBtns() {
  if (bookingStep) return;
  setQuickBtns(['Book a wash', 'Prices', 'Our location', 'Call owner']);
}

function toggleChat() {
  chatOpen = !chatOpen;
  var w = document.getElementById('chat-window');
  w.classList.toggle('open', chatOpen);
  document.getElementById('chat-notif').style.display = 'none';

  if (chatOpen && document.getElementById('chatMessages').children.length === 0) {
    setTimeout(function () {
      addMsg(
        "👋 Habari! I'm Sparky, SparkWash KE's AI assistant.\n\nI can answer questions, book a wash for you, or connect you with the owner directly. How can I help?",
        'bot'
      );
      showDefaultQuickBtns();
    }, 300);
  }
}