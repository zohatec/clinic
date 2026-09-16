/* =====================================================
   নিরাময় হেলথ কেয়ার — main.js
   বাংলা/ইংরেজি টগল, ডার্ক মোড, ফর্ম → Google Sheets
   ===================================================== */

/* ---------- ১) কনফিগারেশন ---------- */
const CONFIG = {
  // ⚠️ Google Apps Script Web App URL এখানে বসান (deploy করার পর)।
  // খালি ("") থাকলে ডেমো মোড — ডাটা ব্রাউজারের localStorage-এ জমা হবে।
  API_URL: ''
};

const STORE_KEYS = {
  appointment: 'nhc_appointments',
  consultation: 'nhc_consultations',
  inquiry: 'nhc_inquiries'
};

/* ---------- ২) হেল্পার ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const BN_DIGITS = { '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯' };
const toBn  = s => String(s).replace(/\d/g, d => BN_DIGITS[d]);
const fmtNum = v => LANG === 'bn' ? toBn(v.toLocaleString('en-US')) : v.toLocaleString('en-US');

let LANG = localStorage.getItem('nhc_lang') || 'bn';
const t = k => (I18N[LANG] && I18N[LANG][k]) || I18N.bn[k] || k;
const L = o => o[LANG] || o.bn; // ডাইনামিক ডাটার জন্য

/* ---------- ৩) অনুবাদ (i18n) ---------- */
const I18N = {
  bn: {
    'brand.name':'নিরাময় হেলথ কেয়ার',
    'topbar.address':'বাড়ি ২৭ (৩য় তলা), রোড ৫, ধানমন্ডি, ঢাকা ১২০৫',
    'topbar.hours':'শনি–বৃহস্পতি: সকাল ৯টা – রাত ৯টা',
    'topbar.emergency':'জরুরি হটলাইন:',
    'nav.home':'হোম','nav.services':'সেবাসমূহ','nav.doctors':'ডাক্তারগণ','nav.schedule':'সময়সূচি',
    'nav.packages':'পরীক্ষা ও প্যাকেজ','nav.blog':'স্বাস্থ্য ব্লগ','nav.contact':'যোগাযোগ','nav.book':'অ্যাপয়েন্টমেন্ট',
    'hero.badge':'ধানমন্ডির বিশ্বস্ত স্বাস্থ্যসেবা কেন্দ্র',
    'hero.title1':'আপনার সুস্থ আগামী,','hero.title2':'আমাদের অঙ্গীকার',
    'hero.desc':'অভিজ্ঞ বিশেষজ্ঞ ডাক্তার, আধুনিক প্যাথলজি ল্যাব ও আন্তরিক সেবা — সবই এক ছাদের নিচে। ঘরে বসেই অনলাইনে অ্যাপয়েন্টমেন্ট নিন অথবা ভিডিও কলে ডাক্তারের পরামর্শ নিন।',
    'hero.cta1':'অ্যাপয়েন্টমেন্ট নিন','hero.cta2':'সেবাসমূহ দেখুন',
    'hero.stat1':'বছরের অভিজ্ঞতা','hero.stat2':'সন্তুষ্ট রোগী','hero.stat3':'বিশেষজ্ঞ ডাক্তার','hero.stat4':'ল্যাব পরীক্ষা',
    'hero.b1a':'৪.৯/৫ রেটিং','hero.b1b':'৩,২০০+ রোগীর রিভিউ',
    'hero.b2a':'২৪/৭ জরুরি সেবা','hero.b2b':'যেকোনো সময় কল করুন',
    'services.eyebrow':'আমাদের সেবা','services.title':'আপনার প্রয়োজনীয় সব সেবা এক জায়গায়',
    'services.desc':'পরামর্শ থেকে পরীক্ষা — বাংলাদেশের বাজারমূল্যে সাশ্রয়ী ও নির্ভরযোগ্য স্বাস্থ্যসেবা।',
    'doctors.eyebrow':'আমাদের ডাক্তারগণ','doctors.title':'অভিজ্ঞ ও বিশ্বস্ত বিশেষজ্ঞ চিকিৎসকবৃন্দ',
    'doctors.desc':'প্রতিটি রোগীর প্রতি মনোযোগী শ্রবণ ও আধুনিক চিকিৎসা — এটাই আমাদের অঙ্গীকার।',
    'doctors.book':'সিরিয়াল নিন',
    'schedule.eyebrow':'চেম্বার সময়সূচি','schedule.title':'ডাক্তারদের চেম্বারের সময়',
    'schedule.desc':'সিরিয়ালের জন্য অগ্রিম বুক করুন — অপেক্ষার ঝামেলা এড়িয়ে চলুন।',
    'schedule.doctor':'ডাক্তার','schedule.specialty':'বিশেষত্ব','schedule.days':'দিন','schedule.time':'সময়','schedule.fee':'ফি',
    'schedule.note':'শুক্রবার: বিকেল ৩টা – রাত ৯টা (সীমিত সেবা)। সিরিয়ালের জন্য কল করুন: +880 1712-345678',
    'packages.eyebrow':'পরীক্ষা ও প্যাকেজ','packages.title':'সাশ্রয়ী মূল্যে নির্ভরযোগ্য পরীক্ষা',
    'packages.desc':'আধুনিক যন্ত্রপাতি ও অভিজ্ঞ টেকনোলজিস্ট — নির্ভুল রিপোর্টের নিশ্চয়তা।',
    'packages.tab1':'প্যাথলজি পরীক্ষা','packages.tab2':'হেলথ প্যাকেজ',
    'packages.note':'রিপোর্ট ডেলিভারি: ২৪ ঘণ্টার মধ্যে (হার্ডকপি / ইমেইল / WhatsApp)। ঢাকার ভেতরে হোম স্যাম্পল কালেকশন সুবিধা আছে।',
    'packages.includes':'প্যাকেজে যা থাকছে',
    'appt.eyebrow':'অ্যাপয়েন্টমেন্ট','appt.title':'অনলাইনে সিরিয়াল বুক করুন',
    'appt.desc':'ফর্ম পূরণ করুন — আমাদের প্রতিনিধি ফোনে কনফার্ম করবেন।',
    'appt.infoTitle':'চেম্বার তথ্য',
    'appt.addr':'বাড়ি ২৭ (৩য় তলা), রোড ৫, ধানমন্ডি, ঢাকা ১২০৫',
    'appt.open':'শনি–বৃহস্পতি: সকাল ৯টা – রাত ৯টা',
    'appt.fri':'শুক্রবার: বিকেল ৩টা – রাত ৯টা',
    'appt.hotline':'সিরিয়াল / হটলাইন:',
    'appt.note':'নোট: অ্যাপয়েন্টমেন্ট নিশ্চিত হলে SMS বা ফোনে জানানো হবে।',
    'form.name':'রোগীর নাম *','form.namePh':'যেমন: মো. রফিকুল ইসলাম',
    'form.phone':'মোবাইল নম্বর *','form.email':'ইমেইল (ঐচ্ছিক)',
    'form.doctor':'ডাক্তার নির্বাচন *','form.date':'তারিখ *','form.time':'পছন্দের সময় *',
    'form.problem':'সমস্যার বিবরণ (ঐচ্ছিক)','form.problemPh':'আপনার সমস্যা সংক্ষেপে লিখুন...',
    'form.selectDoctor':'— ডাক্তার বাছাই করুন —','form.selectTime':'— সময় বাছাই করুন —',
    'form.submitAppt':'অ্যাপয়েন্টমেন্ট কনফার্ম করুন',
    'form.platform':'পছন্দের মাধ্যম','form.platPhone':'শুধু ফোন কল',
    'form.message':'বক্তব্য *','form.msgPh':'আপনার সমস্যা সংক্ষেপে লিখুন...',
    'form.submitCons':'পরামর্শের অনুরোধ পাঠান',
    'form.subject':'বিষয় *','form.subj1':'অ্যাপয়েন্টমেন্ট সংক্রান্ত','form.subj2':'রিপোর্ট সংক্রান্ত',
    'form.subj3':'প্যাকেজ / পরীক্ষার মূল্য','form.subj4':'অন্যান্য',
    'form.submitInq':'প্রশ্ন পাঠান',
    'consult.eyebrow':'অনলাইন পরামর্শ','consult.title':'ঘরে বসেই ডাক্তারের পরামর্শ',
    'consult.desc':'ভিডিও বা অডিও কলে বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন — ঢাকার বাইরে থাকলেও সমস্যা নেই।',
    'consult.f1t':'ভিডিও/অডিও কল','consult.f1d':'নির্ধারিত সময়ে লিংক পাবেন',
    'consult.f2t':'মাত্র ৳ ৫০০','consult.f2d':'চেম্বার ভিজিটের চেয়ে সাশ্রয়ী',
    'consult.f3t':'ডিজিটাল প্রেসক্রিপশন','consult.f3d':'PDF হিসেবে ইমেইল/WhatsApp-এ',
    'consult.steps':'কীভাবে কাজ করে?',
    'consult.s1':'১. ফর্ম পূরণ করুন','consult.s2':'২. কনফার্মেশন কল','consult.s3':'৩. মিটিং লিংক','consult.s4':'৪. ভিডিও পরামর্শ',
    'testi.eyebrow':'রোগীদের মতামত','testi.title':'রোগীরা আমাদের সম্পর্কে যা বলেন',
    'testi.desc':'৫০,০০০+ রোগীর আস্থা — আমাদের সবচেয়ে বড় অর্জন।',
    'blog.eyebrow':'স্বাস্থ্য ব্লগ','blog.title':'স্বাস্থ্য সম্পর্কে জেনে রাখুন',
    'blog.desc':'আমাদের বিশেষজ্ঞ ডাক্তারদের লেখা সহজ ভাষার স্বাস্থ্য পরামর্শ।','blog.read':'বিস্তারিত পড়ুন',
    'contact.eyebrow':'যোগাযোগ','contact.title':'চেম্বারে আসুন অথবা খোঁজ নিন',
    'contact.desc':'আমাদের ঠিকানা, ফোন ও লোকেশন ম্যাপ — সাথে সরাসরি প্রশ্ন করার সুবিধা।',
    'contact.addrT':'ঠিকানা','contact.addrV':'বাড়ি ২৭ (৩য় তলা), রোড ৫, ধানমন্ডি, ঢাকা ১২০৫',
    'contact.phoneT':'ফোন','contact.emailT':'ইমেইল','contact.hoursT':'খোলার সময়',
    'contact.directions':'Google Maps-এ নির্দেশনা',
    'inquiry.title':'রোগীর জিজ্ঞাসা','inquiry.desc':'যেকোনো প্রশ্ন থাকলে ফর্মটি পূরণ করুন — আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
    'modal.success':'অনুরোধ সফল হয়েছে!','modal.ref':'রেফারেন্স নম্বর','modal.close':'ঠিক আছে',
    'modal.msg':'আপনার অনুরোধ আমরা পেয়েছি। আমাদের প্রতিনিধি শীঘ্রই ফোনে যোগাযোগ করে নিশ্চিত করবেন। রেফারেন্স নম্বরটি সংরক্ষণ করুন।',
    'modal.localNote':'ডেমো মোড: তথ্যটি এই ব্রাউজারে সংরক্ষিত হয়েছে। Google Sheets কানেক্ট করতে ডকুমেন্টেশন দেখুন।',
    'modal.serverNote':'তথ্যটি সফলভাবে Google Sheets-এ সংরক্ষিত হয়েছে।',
    'toast.phone':'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)',
    'toast.err':'ফর্মটি সঠিকভাবে পূরণ করুন!',
    'footer.about':'২০১০ সাল থেকে ধানমন্ডির প্রাণকেন্দ্রে নির্ভরযোগ্য ও সাশ্রয়ী স্বাস্থ্যসেবা দিয়ে আসছি। আপনার সুস্থ আগামীই আমাদের অঙ্গীকার।',
    'footer.links':'দ্রুত লিংক','footer.services':'সেবাসমূহ','footer.contactT':'যোগাযোগ','footer.rights':'সর্বস্বত্ব সংরক্ষিত',
    'foot.s1':'ডাক্তার পরামর্শ','foot.s2':'অনলাইন পরামর্শ','foot.s3':'প্যাথলজি ল্যাব','foot.s4':'হেলথ প্যাকেজ','foot.s5':'হোম স্যাম্পল কালেকশন'
  },
  en: {
    'brand.name':'Niramoy Health Care',
    'topbar.address':'House 27 (3rd Floor), Road 5, Dhanmondi, Dhaka 1205',
    'topbar.hours':'Sat–Thu: 9:00 AM – 9:00 PM',
    'topbar.emergency':'Emergency Hotline:',
    'nav.home':'Home','nav.services':'Services','nav.doctors':'Doctors','nav.schedule':'Schedule',
    'nav.packages':'Tests & Packages','nav.blog':'Health Blog','nav.contact':'Contact','nav.book':'Book Now',
    'hero.badge':'Trusted Healthcare in Dhanmondi',
    'hero.title1':'Your Healthy Tomorrow,','hero.title2':'Our Commitment',
    'hero.desc':'Expert specialists, a modern pathology lab and heartfelt care — all under one roof. Book an appointment online or consult a doctor over a video call from home.',
    'hero.cta1':'Book Appointment','hero.cta2':'Explore Services',
    'hero.stat1':'Years of Experience','hero.stat2':'Happy Patients','hero.stat3':'Expert Doctors','hero.stat4':'Lab Tests',
    'hero.b1a':'4.9/5 Rating','hero.b1b':'3,200+ patient reviews',
    'hero.b2a':'24/7 Emergency','hero.b2b':'Call us anytime',
    'services.eyebrow':'Our Services','services.title':'Every Service You Need, Under One Roof',
    'services.desc':'From consultations to diagnostics — reliable, affordable healthcare at Bangladeshi market prices.',
    'doctors.eyebrow':'Our Doctors','doctors.title':'Experienced & Trusted Specialists',
    'doctors.desc':'Attentive listening and modern treatment for every patient — that is our promise.',
    'doctors.book':'Book Serial',
    'schedule.eyebrow':'Chamber Schedule','schedule.title':"Doctors' Chamber Hours",
    'schedule.desc':'Book your serial in advance and skip the waiting hassle.',
    'schedule.doctor':'Doctor','schedule.specialty':'Specialty','schedule.days':'Days','schedule.time':'Time','schedule.fee':'Fee',
    'schedule.note':'Friday: 3:00 PM – 9:00 PM (limited service). For serials call: +880 1712-345678',
    'packages.eyebrow':'Tests & Packages','packages.title':'Reliable Tests at Affordable Prices',
    'packages.desc':'Modern equipment and experienced technologists — guaranteed accurate reports.',
    'packages.tab1':'Pathology Tests','packages.tab2':'Health Packages',
    'packages.note':'Report delivery: within 24 hours (hard copy / email / WhatsApp). Home sample collection available inside Dhaka.',
    'packages.includes':"What's included",
    'appt.eyebrow':'Appointment','appt.title':'Book Your Serial Online',
    'appt.desc':'Fill in the form — our representative will confirm over the phone.',
    'appt.infoTitle':'Chamber Info',
    'appt.addr':'House 27 (3rd Floor), Road 5, Dhanmondi, Dhaka 1205',
    'appt.open':'Sat–Thu: 9:00 AM – 9:00 PM',
    'appt.fri':'Friday: 3:00 PM – 9:00 PM',
    'appt.hotline':'Serial / Hotline:',
    'appt.note':'Note: You will be notified via SMS or phone once the appointment is confirmed.',
    'form.name':'Patient Name *','form.namePh':'e.g. Md. Rafiqul Islam',
    'form.phone':'Mobile Number *','form.email':'Email (Optional)',
    'form.doctor':'Select Doctor *','form.date':'Date *','form.time':'Preferred Time *',
    'form.problem':'Describe Your Problem (Optional)','form.problemPh':'Briefly describe your problem...',
    'form.selectDoctor':'— Choose a doctor —','form.selectTime':'— Choose a time —',
    'form.submitAppt':'Confirm Appointment',
    'form.platform':'Preferred Platform','form.platPhone':'Phone call only',
    'form.message':'Message *','form.msgPh':'Briefly describe your problem...',
    'form.submitCons':'Request Consultation',
    'form.subject':'Subject *','form.subj1':'About Appointment','form.subj2':'About Report',
    'form.subj3':'Package / Test Price','form.subj4':'Other',
    'form.submitInq':'Send Question',
    'consult.eyebrow':'Online Consultation','consult.title':'Doctor Consultation From Home',
    'consult.desc':'Consult a specialist over video or audio call — even if you are outside Dhaka.',
    'consult.f1t':'Video/Audio Call','consult.f1d':'Get the link at your scheduled time',
    'consult.f2t':'Only ৳ 500','consult.f2d':'Cheaper than a chamber visit',
    'consult.f3t':'Digital Prescription','consult.f3d':'As PDF via email/WhatsApp',
    'consult.steps':'How it works?',
    'consult.s1':'1. Fill the form','consult.s2':'2. Confirmation call','consult.s3':'3. Meeting link','consult.s4':'4. Video consult',
    'testi.eyebrow':'Testimonials','testi.title':'What Our Patients Say',
    'testi.desc':'The trust of 50,000+ patients — our greatest achievement.',
    'blog.eyebrow':'Health Blog','blog.title':'Learn About Your Health',
    'blog.desc':'Simple health tips written by our specialist doctors.','blog.read':'Read More',
    'contact.eyebrow':'Contact','contact.title':'Visit Our Chamber or Reach Out',
    'contact.desc':'Our address, phone, location map — plus a direct inquiry form.',
    'contact.addrT':'Address','contact.addrV':'House 27 (3rd Floor), Road 5, Dhanmondi, Dhaka 1205',
    'contact.phoneT':'Phone','contact.emailT':'Email','contact.hoursT':'Opening Hours',
    'contact.directions':'Get Directions on Google Maps',
    'inquiry.title':'Patient Inquiry','inquiry.desc':'Have any question? Fill the form — we reply within 24 hours.',
    'modal.success':'Request Submitted!','modal.ref':'Reference No.','modal.close':'OK',
    'modal.msg':"We have received your request. Our representative will call you shortly to confirm. Please save the reference number.",
    'modal.localNote':'Demo mode: data saved in this browser. Connect Google Sheets (see documentation).',
    'modal.serverNote':'Data has been saved to Google Sheets successfully.',
    'toast.phone':'Enter a valid Bangladeshi mobile number (e.g. 01712345678)',
    'toast.err':'Please fill the form correctly!',
    'footer.about':'Providing reliable and affordable healthcare from the heart of Dhanmondi since 2010. Your healthy tomorrow is our commitment.',
    'footer.links':'Quick Links','footer.services':'Services','footer.contactT':'Contact','footer.rights':'All rights reserved',
    'foot.s1':'Doctor Consultation','foot.s2':'Online Consultation','foot.s3':'Pathology Lab','foot.s4':'Health Packages','foot.s5':'Home Sample Collection'
  }
};

/* ---------- ৪) ডাইনামিক ডাটা ---------- */
const DOCTORS = [
  { id:1, img:'https://placehold.co/400x400/155e75/ffffff?text=Dr.+A.+Karim',
    name:{bn:'ডা. আবদুল করিম',en:'Dr. Abdul Karim'},
    specialty:{bn:'মেডিসিন ও ডায়াবেটোলজি',en:'Medicine & Diabetology'},
    degrees:{bn:'MBBS (ঢাকা মেডিকেল কলেজ), FCPS (মেডিসিন), MD (এন্ডোক্রাইনোলজি)',en:'MBBS (DMC), FCPS (Medicine), MD (Endocrinology)'},
    days:{bn:'শনি – বৃহস্পতি',en:'Sat – Thu'}, time:{bn:'সকাল ১০টা – দুপুর ২টা',en:'10:00 AM – 2:00 PM'},
    fee:{bn:'৳ ১,০০০',en:'৳ 1,000'}, exp:{bn:'১৮+ বছরের অভিজ্ঞতা',en:'18+ yrs experience'} },
  { id:2, img:'https://placehold.co/400x400/9d174d/ffffff?text=Dr.+F.+Yasmin',
    name:{bn:'ডা. ফারহানা ইয়াসমিন',en:'Dr. Farhana Yasmin'},
    specialty:{bn:'গাইনোকোলজি ও প্রসূতি',en:'Gynecology & Obstetrics'},
    degrees:{bn:'MBBS, FCPS (গাইনি ও অবস্টেট্রিকস)',en:'MBBS, FCPS (Gynae & Obstetrics)'},
    days:{bn:'রবি, মঙ্গল ও বৃহস্পতি',en:'Sun, Tue & Thu'}, time:{bn:'বিকেল ৪টা – রাত ৮টা',en:'4:00 PM – 8:00 PM'},
    fee:{bn:'৳ ১,২০০',en:'৳ 1,200'}, exp:{bn:'১২+ বছরের অভিজ্ঞতা',en:'12+ yrs experience'} },
  { id:3, img:'https://placehold.co/400x400/166534/ffffff?text=Dr.+M.+Hasan',
    name:{bn:'ডা. মাহমুদ হাসান',en:'Dr. Mahmud Hasan'},
    specialty:{bn:'শিশু ও নবজাতক',en:'Child & Neonatology'},
    degrees:{bn:'MBBS, FCPS (শিশু রোগ)',en:'MBBS, FCPS (Paediatrics)'},
    days:{bn:'শনি – বুধবার',en:'Sat – Wed'}, time:{bn:'সকাল ১১টা – দুপুর ৩টা',en:'11:00 AM – 3:00 PM'},
    fee:{bn:'৳ ৮০০',en:'৳ 800'}, exp:{bn:'১০+ বছরের অভিজ্ঞতা',en:'10+ yrs experience'} },
  { id:4, img:'https://placehold.co/400x400/7c2d12/ffffff?text=Dr.+S.+Alam',
    name:{bn:'ডা. শামসুল আলম',en:'Dr. Shamsul Alam'},
    specialty:{bn:'কার্ডিওলজি (হৃদরোগ)',en:'Cardiology'},
    degrees:{bn:'MBBS, MD (কার্ডিওলজি), FACC (USA)',en:'MBBS, MD (Cardiology), FACC (USA)'},
    days:{bn:'সোম, বুধ ও বৃহস্পতি',en:'Mon, Wed & Thu'}, time:{bn:'সকাল ৯টা – দুপুর ১২টা',en:'9:00 AM – 12:00 PM'},
    fee:{bn:'৳ ১,৫০০',en:'৳ 1,500'}, exp:{bn:'২০+ বছরের অভিজ্ঞতা',en:'20+ yrs experience'} }
];

const SERVICES = [
  { icon:'fa-user-doctor',        title:{bn:'বিশেষজ্ঞ ডাক্তারের পরামর্শ',en:'Specialist Consultation'}, desc:{bn:'অভিজ্ঞ বিশেষজ্ঞ ডাক্তারের সরাসরি পরামর্শ',en:'Direct consultation with experienced specialists'}, price:{bn:'৳ ৮০০ – ১,৫০০',en:'৳ 800 – 1,500'} },
  { icon:'fa-video',              title:{bn:'অনলাইন পরামর্শ',en:'Online Consultation'}, desc:{bn:'ভিডিও কলে ঘরে বসেই ডাক্তারের পরামর্শ',en:'Doctor consultation via video call from home'}, price:{bn:'৳ ৫০০',en:'৳ 500'} },
  { icon:'fa-flask-vial',         title:{bn:'প্যাথলজি ল্যাব',en:'Pathology Lab'}, desc:{bn:'আধুনিক যন্ত্রে ১০০+ পরীক্ষা',en:'100+ tests on modern machines'}, price:{bn:'৳ ১০০ থেকে',en:'From ৳ 100'} },
  { icon:'fa-heart-pulse',        title:{bn:'ইসিজি ও ইকো',en:'ECG & Echo'}, desc:{bn:'ইসিজি, ইকোকার্ডিওগ্রাম সেবা',en:'ECG and echocardiogram services'}, price:{bn:'৳ ৪০০ থেকে',en:'From ৳ 400'} },
  { icon:'fa-syringe',            title:{bn:'টিকাদান সেবা',en:'Vaccination'}, desc:{bn:'শিশু ও প্রাপ্তবয়স্কদের সকল টিকা',en:'All vaccines for children & adults'}, price:{bn:'৳ ৩০০ থেকে',en:'From ৳ 300'} },
  { icon:'fa-house-medical',      title:{bn:'হোম স্যাম্পল কালেকশন',en:'Home Sample Collection'}, desc:{bn:'ঢাকার ভেতরে বাসা থেকে স্যাম্পল সংগ্রহ',en:'Sample collection from home inside Dhaka'}, price:{bn:'৳ ১০০ থেকে',en:'From ৳ 100'} },
  { icon:'fa-notes-medical',      title:{bn:'ডায়াবেটিস ম্যানেজমেন্ট',en:'Diabetes Management'}, desc:{bn:'ফলো-আপ ও ডায়েট পরামর্শ',en:'Follow-up and diet counseling'}, price:{bn:'৳ ১,৫০০',en:'৳ 1,500'} },
  { icon:'fa-clipboard-check',    title:{bn:'বার্ষিক হেলথ চেকআপ',en:'Annual Health Checkup'}, desc:{bn:'সম্পূর্ণ স্বাস্থ্য পরীক্ষার প্যাকেজ',en:'Complete health screening packages'}, price:{bn:'৳ ২,০০০ থেকে',en:'From ৳ 2,000'} }
];

const TESTS = [
  { name:{bn:'সিবিসি (CBC)',en:'CBC (Complete Blood Count)'}, price:{bn:'৳ ৩৫০',en:'৳ 350'} },
  { name:{bn:'রক্তে গ্লুকোজ (FBS)',en:'Fasting Blood Sugar (FBS)'}, price:{bn:'৳ ১০০',en:'৳ 100'} },
  { name:{bn:'এইচবিএ১সি (HbA1c)',en:'HbA1c'}, price:{bn:'৳ ৭০০',en:'৳ 700'} },
  { name:{bn:'লিপিড প্রোফাইল',en:'Lipid Profile'}, price:{bn:'৳ ৯০০',en:'৳ 900'} },
  { name:{bn:'এসজিপিটি (ALT)',en:'SGPT (ALT)'}, price:{bn:'৳ ৩৫০',en:'৳ 350'} },
  { name:{bn:'সিরাম ক্রিয়েটিনিন',en:'Serum Creatinine'}, price:{bn:'৳ ৩০০',en:'৳ 300'} },
  { name:{bn:'থাইরয়েড প্রোফাইল (TSH, T3, T4)',en:'Thyroid Profile (TSH, T3, T4)'}, price:{bn:'৳ ৮০০',en:'৳ 800'} },
  { name:{bn:'হেপাটাইটিস-বি (HBsAg)',en:'Hepatitis-B (HBsAg)'}, price:{bn:'৳ ৬০০',en:'৳ 600'} },
  { name:{bn:'প্রস্রাব রুটিন (R/E)',en:'Urine Routine (R/E)'}, price:{bn:'৳ ২০০',en:'৳ 200'} },
  { name:{bn:'ভিটামিন-ডি',en:'Vitamin-D'}, price:{bn:'৳ ১,৮০০',en:'৳ 1,800'} },
  { name:{bn:'ডেঙ্গু (NS1 Ag)',en:'Dengue (NS1 Ag)'}, price:{bn:'৳ ৯০০',en:'৳ 900'} }
];

const PACKAGES = [
  { icon:'fa-droplet', name:{bn:'ডায়াবেটিক প্যাকেজ',en:'Diabetic Package'}, price:{bn:'৳ ২,৫০০',en:'৳ 2,500'},
    items:{bn:'FBS, HbA1c, লিপিড প্রোফাইল, ক্রিয়েটিনিন, প্রস্রাব রুটিন + ডায়েট কাউন্সিলিং',en:'FBS, HbA1c, Lipid Profile, Creatinine, Urine R/E + diet counseling'} },
  { icon:'fa-heart-pulse', name:{bn:'কার্ডিয়াক চেকআপ',en:'Cardiac Checkup'}, price:{bn:'৳ ৪,৫০০',en:'৳ 4,500'},
    items:{bn:'ইসিজি, ইকোকার্ডিওগ্রাম, লিপিড প্রোফাইল + কার্ডিওলজিস্ট পরামর্শ',en:'ECG, Echocardiogram, Lipid Profile + cardiologist consult'} },
  { icon:'fa-venus', name:{bn:'মহিলাদের হেলথ প্যাকেজ',en:"Women's Health Package"}, price:{bn:'৳ ৩,৫০০',en:'৳ 3,500'},
    items:{bn:'সিবিসি, থাইরয়েড প্রোফাইল, আল্ট্রাসনোগ্রাম + গাইনি পরামর্শ',en:'CBC, Thyroid Profile, Ultrasonogram + gynae consult'} },
  { icon:'fa-baby', name:{bn:'শিশু হেলথ প্যাকেজ',en:'Child Health Package'}, price:{bn:'৳ ২,০০০',en:'৳ 2,000'},
    items:{bn:'সিবিসি, বৃদ্ধি মূল্যায়ন, টিকার পরামর্শ + শিশু বিশেষজ্ঞ পরামর্শ',en:'CBC, growth assessment, vaccine advice + paediatric consult'} },
  { icon:'fa-person-cane', name:{bn:'সিনিয়র সিটিজেন প্যাকেজ',en:'Senior Citizen Package'}, price:{bn:'৳ ৫,৫০০',en:'৳ 5,500'},
    items:{bn:'ফুল বডি স্ক্রিনিং, ইসিজি, ইকো, PSA + মেডিসিন বিশেষজ্ঞ পরামর্শ',en:'Full body screening, ECG, Echo, PSA + medicine consult'} },
  { icon:'fa-list-check', name:{bn:'ফুল বডি চেকআপ',en:'Full Body Checkup'}, price:{bn:'৳ ৬,৫০০',en:'৳ 6,500'},
    items:{bn:'৩৫+ পরীক্ষা, ইসিজি, আল্ট্রাসনোগ্রাম + ২ জন বিশেষজ্ঞের পরামর্শ',en:'35+ tests, ECG, Ultrasonogram + 2 specialist consults'} }
];

let TESTIMONIALS = [
  { name:'রাহাত হোসেন', loc:{bn:'ধানমন্ডি, ঢাকা',en:'Dhanmondi, Dhaka'}, rating:5,
    text:{bn:'ডায়াবেটিক প্যাকেজের রিপোর্ট ২৪ ঘণ্টার মধ্যে পেয়ে গেছি। ডা. করিম সাহেব খুব মন দিয়ে শুনে পরামর্শ দেন। ধানমন্ডিতে এমন সেবা আর নেই।',en:'Got my diabetic package report within 24 hours. Dr. Karim listens patiently and explains everything. The best care in Dhanmondi.'} },
  { name:'নুসরাত জাহান', loc:{bn:'মোহাম্মদপুর, ঢাকা',en:'Mohammadpur, Dhaka'}, rating:5,
    text:{bn:'অনলাইনে সিরিয়াল বুক করে গিয়ে বসেছি — কোনো ভিড় বা অপেক্ষা লাগেনি। ডা. ফারহানা ম্যাডামের আচরণ অসাধারণ।',en:'Booked my serial online and walked right in — no crowd, no waiting. Dr. Farhana is wonderful with patients.'} },
  { name:'মো. শাহাদাত হোসেন', loc:{bn:'যাত্রাবাড়ী, ঢাকা',en:'Jatrabari, Dhaka'}, rating:5,
    text:{bn:'রাত ১১টায় বাচ্চার হঠাৎ জ্বরে জরুরি সেবা নিয়েছি। এত রাতেও ডাক্তার পাওয়া যাবে ভাবিনি। চিরকৃতজ্ঞ থাকব নিরাময়ের প্রতি।',en:'Took emergency service at 11 PM for my child\'s sudden fever. Never expected to find a doctor at that hour. Forever grateful to Niramoy.'} },
  { name:'তাহমিনা আক্তার', loc:{bn:'ধানমন্ডি, ঢাকা',en:'Dhanmondi, Dhaka'}, rating:4.5,
    text:{bn:'ভিডিও কলে ডাক্তারের পরামর্শ নিয়েছি — ঘরে বসেই WhatsApp-এ প্রেসক্রিপশন পেয়ে গেছি। বয়স্ক রোগীদের জন্য দারুণ সুবিধা।',en:'Consulted a doctor over video call and received the prescription on WhatsApp from home. A great facility for elderly patients.'} },
  { name:'আরিফুল ইসলাম', loc:{bn:'শ্যামলী, ঢাকা',en:'Shyamoli, Dhaka'}, rating:4.5,
    text:{bn:'হোম স্যাম্পল কালেকশন সার্ভিসটা অসাধারণ। বাবার রক্ত পরীক্ষা বাসা থেকেই হলো, রিপোর্ট এসেছে ইমেইলে।',en:'The home sample collection service is amazing. My father\'s blood test was done at home and the report arrived by email.'} }
];

const BLOGS = [
  { img:'https://placehold.co/600x400/0e7490/ffffff?text=Diabetes+Care', tag:{bn:'ডায়াবেটিস',en:'Diabetes'},
    date:{bn:'১২ জানুয়ারি ২০২৫',en:'Jan 12, 2025'}, read:5,
    title:{bn:'ডায়াবেটিস নিয়ন্ত্রণে রাখতে পালনীয় ৭টি খাদ্যাভ্যাস',en:'7 Dietary Habits to Keep Diabetes Under Control'},
    ex:{bn:'খাবারের পাত থেকে দৈনন্দিন অভ্যাস — ছোট ছোট পরিবর্তনেই রক্তে সুগারের মাত্রা নিয়ন্ত্রণে রাখা সম্ভব। জেনে নিন পুষ্টিবিদদের পরামর্শ।',en:'Small changes from your plate to your daily routine can keep blood sugar in check. Here is what nutritionists advise.'} },
  { img:'https://placehold.co/600x400/be123c/ffffff?text=Heart+Health', tag:{bn:'হৃদরোগ',en:'Heart'},
    date:{bn:'০৮ জানুয়ারি ২০২৫',en:'Jan 8, 2025'}, read:4,
    title:{bn:'হৃদরোগের ৭টি সতর্ক লক্ষণ যা উপেক্ষা করা যাবে না',en:'7 Warning Signs of Heart Disease You Must Not Ignore'},
    ex:{bn:'বুকে চাপ, হঠাৎ দম বন্ধ, অস্বাভাবিক ঘাম — এই লক্ষণগুলো কখনোই হালকাভাবে নেবেন না। বিস্তারিত জানুন।',en:'Chest pressure, sudden breathlessness, unusual sweating — never take these symptoms lightly. Learn more.'} },
  { img:'https://placehold.co/600x400/166534/ffffff?text=Child+Care', tag:{bn:'শিশু স্বাস্থ্য',en:'Child Health'},
    date:{bn:'০২ জানুয়ারি ২০২৫',en:'Jan 2, 2025'}, read:3,
    title:{bn:'শীতে শিশুদের সর্দি-কাশি ও নিউমোনিয়া থেকে বাঁচার উপায়',en:'Protecting Children From Cold, Cough & Pneumonia in Winter'},
    ex:{bn:'শীত মানেই শিশুদের অসুস্থতার শুরু। সঠিক পোশাক, খাবার ও পরিচ্ছন্নতা — মেনে নিন শিশু বিশেষজ্ঞের ৬টি পরামর্শ।',en:'Winter often starts child illnesses. Follow these 6 tips from our paediatrician on clothing, food and hygiene.'} }
];

/* ---------- ৫) রেন্ডারিং ---------- */
function renderServices(){
  $('#servicesGrid').innerHTML = SERVICES.map(s => `
    <div class="service-card">
      <div class="svc-icon"><i class="fa-solid ${s.icon}"></i></div>
      <h3>${L(s.title)}</h3>
      <p>${L(s.desc)}</p>
      <span class="price-chip">${L(s.price)}</span>
    </div>`).join('');
}

function renderDoctors(){
  $('#doctorsGrid').innerHTML = DOCTORS.map(d => `
    <div class="doc-card">
      <div class="doc-img">
        <img src="${d.img}" alt="${L(d.name)}" loading="lazy">
        <span class="doc-exp">${L(d.exp)}</span>
      </div>
      <div class="doc-body">
        <h3>${L(d.name)}</h3>
        <span class="doc-spec">${L(d.specialty)}</span>
        <span class="doc-deg">${L(d.degrees)}</span>
        <div class="doc-meta">
          <span><i class="fa-regular fa-calendar"></i> ${L(d.days)}</span>
          <span><i class="fa-regular fa-clock"></i> ${L(d.time)}</span>
        </div>
        <div class="doc-foot">
          <span class="doc-fee">${L(d.fee)}</span>
          <button class="doc-book" data-book="${d.id}"><i class="fa-regular fa-calendar-check"></i> ${t('doctors.book')}</button>
        </div>
      </div>
    </div>`).join('');
}

function renderSchedule(){
  $('#scheduleBody').innerHTML = DOCTORS.map(d => `
    <tr>
      <td><b>${L(d.name)}</b></td>
      <td>${L(d.specialty)}</td>
      <td>${L(d.days)}</td>
      <td>${L(d.time)}</td>
      <td class="fee-cell">${L(d.fee)}</td>
    </tr>`).join('');
}

function renderTests(){
  $('#testsList').innerHTML = TESTS.map(x => `
    <div class="test-row"><b>${L(x.name)}</b><span class="t-price">${L(x.price)}</span></div>`).join('');
}

function renderPackages(){
  $('#packagesList').innerHTML = PACKAGES.map(p => `
    <div class="package-card">
      <div class="pkg-top">
        <div><h3>${L(p.name)}</h3><small style="color:var(--muted)">${t('packages.includes')}</small></div>
        <div class="pkg-icon"><i class="fa-solid ${p.icon}"></i></div>
      </div>
      <div class="pkg-price">${L(p.price)}<small style="font-size:12px">${LANG==='bn'?'সব কিছু মিলিয়ে':'all inclusive'}</small></div>
      <div class="pkg-items">${L(p.items).split(',').map(i => `<span><i class="fa-solid fa-check"></i>${i.trim()}</span>`).join('')}</div>
    </div>`).join('');
}

function renderBlogs(){
  $('#blogGrid').innerHTML = BLOGS.map(b => `
    <article class="blog-card">
      <div class="blog-img"><img src="${b.img}" alt="${L(b.title)}" loading="lazy"><span class="blog-tag">${L(b.tag)}</span></div>
      <div class="blog-body">
        <div class="blog-meta">
          <span><i class="fa-regular fa-calendar"></i> ${L(b.date)}</span>
          <span><i class="fa-regular fa-clock"></i> ${LANG==='bn'? toBn(b.read)+' মিনিট পড়া' : b.read+' min read'}</span>
        </div>
        <h3><a href="#">${L(b.title)}</a></h3>
        <p>${L(b.ex)}</p>
        <a href="#" class="blog-read">${t('blog.read')} <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>`).join('');
}

/* ---------- ৬) টাইম স্লট ---------- */
function timeSlots(){
  const out = [];
  for (let h = 10; h <= 20; h++) {
    let label;
    if (LANG === 'bn') {
      if (h === 12)      label = 'দুপুর ১২টা';
      else if (h < 12)   label = `সকাল ${toBn(h)}টা`;
      else if (h < 16)   label = `দুপুর ${toBn(h-12)}টা`;
      else if (h < 18)   label = `বিকেল ${toBn(h-12)}টা`;
      else               label = `রাত ${toBn(h-12)}টা`;
    } else {
      const ap = h < 12 ? 'AM' : 'PM';
      const hh = h % 12 === 0 ? 12 : h % 12;
      label = `${hh}:00 ${ap}`;
    }
    out.push({ v: `${h}:00`, label });
  }
  return out;
}

function populateSelects(){
  // ডাক্তার সিলেক্ট
  ['#apptDoctor', '#consDoctor'].forEach(sel => {
    const el = $(sel); if (!el) return;
    const prev = el.value;
    el.innerHTML = `<option value="">${t('form.selectDoctor')}</option>` +
      DOCTORS.map(d => `<option value="${d.id}">${L(d.name)} — ${L(d.specialty)}</option>`).join('');
    if (prev) el.value = prev;
  });
  // টাইম সিলেক্ট
  const tEl = $('#apptTime');
  if (tEl) {
    const prev = tEl.value;
    tEl.innerHTML = `<option value="">${t('form.selectTime')}</option>` +
      timeSlots().map(s => `<option value="${s.v}">${s.label}</option>`).join('');
    if (prev) tEl.value = prev;
  }
}

/* ---------- ৭) টেস্টিমোনিয়াল স্লাইডার ---------- */
let tIndex = 0, tTimer = null;

const stars = r => {
  let h = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(r)) h += '<i class="fa-solid fa-star"></i>';
    else if (i === Math.ceil(r) && r % 1) h += '<i class="fa-solid fa-star-half-stroke"></i>';
    else h += '<i class="fa-regular fa-star"></i>';
  }
  return h;
};
const initials = n => n.split(' ').filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join('');

function buildTestimonials(){
  $('#testiTrack').innerHTML = TESTIMONIALS.map(x => `
    <div class="testi-slide">
      <div class="testi-stars">${stars(x.rating)}</div>
      <p class="testi-text">“${L(x.text)}”</p>
      <div class="testi-author">
        <div class="testi-avatar">${initials(x.name)}</div>
        <div><b>${x.name}</b><span>${L(x.loc)}</span></div>
      </div>
    </div>`).join('');
  $('#testiDots').innerHTML = TESTIMONIALS.map((_, i) =>
    `<button class="dot ${i === tIndex ? 'active' : ''}" data-i="${i}" aria-label="review ${i+1}"></button>`).join('');
  updateTesti();
}
function updateTesti(){
  $('#testiTrack').style.transform = `translateX(-${tIndex * 100}%)`;
  $$('#testiDots .dot').forEach((d, i) => d.classList.toggle('active', i === tIndex));
}
function goTesti(i){
  tIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
  updateTesti();
}
function startTestiTimer(){
  clearInterval(tTimer);
  tTimer = setInterval(() => goTesti(tIndex + 1), 5000);
}

/* ---------- ৮) ভাষা প্রয়োগ ---------- */
function applyI18n(){
  document.documentElement.lang = LANG;
  document.body.classList.toggle('lang-bn', LANG === 'bn');
  document.body.classList.toggle('lang-en', LANG === 'en');
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('#langToggle').textContent = LANG === 'bn' ? 'EN' : 'বাংলা';

  renderServices(); renderDoctors(); renderSchedule();
  renderTests(); renderPackages(); renderBlogs();
  populateSelects(); buildTestimonials();

  // কাউন্টার আগে অ্যানিমেট হয়ে থাকলে নতুন ভাষায় ফরম্যাট
  $$('.stat-num').forEach(el => { if (el.dataset.done) el.textContent = fmtNum(+el.dataset.target); });
}

/* ---------- ৯) কাউন্টার অ্যানিমেশন ---------- */
function animateCounter(el){
  const target = +el.dataset.target, dur = 1700, start = performance.now();
  (function step(now){
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtNum(target * eased);
    if (p < 1) requestAnimationFrame(step);
    else el.dataset.done = '1';
  })(performance.now());
}

/* ---------- ১০) ফর্ম → Google Sheets (ফ্রি ডাটাবেস) ---------- */
const isValidPhone = p => /^(?:\+?88)?01[3-9]\d{8}$/.test(p.replace(/[\s-]/g, ''));

async function submitData(type, data){
  const ref = 'NHC-' + Date.now().toString(36).toUpperCase().slice(-6);
  const payload = { ...data, type, ref, lang: LANG, submittedAt: new Date().toISOString() };
  let source = 'local';

  if (CONFIG.API_URL) {
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // CORS সমস্যা এড়াতে
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.status === 'success') source = 'server';
    } catch (e) { console.warn('API unavailable, using local storage:', e); }
  }
  // ডেমো ফলব্যাক — ব্রাউজারেই ডাটা জমা থাকে
  const key = STORE_KEYS[type] || 'nhc_other';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(payload);
  localStorage.setItem(key, JSON.stringify(arr));
  return { ref, source };
}

function handleForm(formSel, type, collect){
  const form = $(formSel);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = collect();
    if (!data.name || data.name.trim().length < 3) return showToast(t('toast.err'), 'error');
    if (!isValidPhone(data.phone))                return showToast(t('toast.phone'), 'error');

    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

    try {
      const { ref, source } = await submitData(type, data);
      form.reset();
      openModal(ref, source);
    } catch (err) {
      showToast(t('toast.err'), 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  });
}

const doctorName = id => {
  const d = DOCTORS.find(x => x.id == id);
  return d ? L(d.name) : '';
};

/* ---------- ১১) মোডাল ও টোস্ট ---------- */
function openModal(ref, source){
  $('#modalRef').textContent = ref;
  $('#modalSource').textContent = t(source === 'server' ? 'modal.serverNote' : 'modal.localNote');
  $('#successModal').classList.add('show');
}
function closeModal(){ $('#successModal').classList.remove('show'); }

function showToast(msg, type = 'success'){
  const wrap = $('#toast');
  wrap.insertAdjacentHTML('beforeend',
    `<div class="toast-item ${type}"><i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i><span>${msg}</span></div>`);
  const item = wrap.lastElementChild;
  requestAnimationFrame(() => item.classList.add('show'));
  setTimeout(() => { item.classList.remove('show'); setTimeout(() => item.remove(), 450); }, 3500);
}

/* ---------- ১২) রিমোট ডাটা ফেচিং (Google Sheet থেকে) ---------- */
async function loadRemoteData(){
  if (!CONFIG.API_URL) return;
  try {
    const res = await fetch(`${CONFIG.API_URL}?action=testimonials`);
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data) && json.data.length) {
      TESTIMONIALS = json.data.map(r => ({
        name: r.name || 'রোগী',
        loc: { bn: r.location || '', en: r.location || '' },
        rating: +r.rating || 5,
        text: { bn: r.text_bn || '', en: r.text_en || r.text_bn || '' }
      }));
      tIndex = 0;
      buildTestimonials();
    }
  } catch (e) { console.warn('Remote testimonials unavailable (using local data).'); }
}

/* ---------- ১৩) ইনিশিয়ালাইজ ---------- */
function setMinDates(){
  const today = new Date().toISOString().split('T')[0];
  ['#apptDate', '#consDate'].forEach(s => { const el = $(s); if (el) el.min = today; });
}

function applyTheme(mode){
  document.documentElement.dataset.theme = mode;
  const btn = $('#themeToggle');
  if (btn) btn.innerHTML = mode === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

function init(){
  // থিম ও ভাষা
  applyTheme(localStorage.getItem('nhc_theme') || 'light');
  applyI18n();
  setMinDates();

  // ভাষা টগল
  $('#langToggle').addEventListener('click', () => {
    LANG = LANG === 'bn' ? 'en' : 'bn';
    localStorage.setItem('nhc_lang', LANG);
    applyI18n();
  });

  // ডার্ক মোড টগল
  $('#themeToggle').addEventListener('click', () => {
    const mode = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nhc_theme', mode);
    applyTheme(mode);
  });

  // মোবাইল মেনু
  const burger = $('#hamburger');
  burger.addEventListener('click', () => {
    const open = $('#header').classList.toggle('open');
    burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    $('#header').classList.remove('open');
    burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  // স্ক্রল: হেডার শ্যাডো + টু-টপ
  window.addEventListener('scroll', () => {
    $('#header').classList.toggle('scrolled', scrollY > 10);
    $('#toTop').classList.toggle('show', scrollY > 500);
  }, { passive: true });
  $('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // রিভিল অ্যানিমেশন
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  // কাউন্টার
  const co = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { animateCounter(en.target); co.unobserve(en.target); }
  }), { threshold: .5 });
  $$('.stat-num').forEach(el => co.observe(el));

  // ট্যাব
  $