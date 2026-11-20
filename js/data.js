'use strict';

const DATA = (() => {

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  const MEAL_TIMES = {
    breakfast: '07:30',
    lunch:     '13:00',
    snack:     '17:00',
    dinner:    '20:00',
  };

  // ── 7-day Mess Menu (28 meals) ───────────────────────────────
  const MENU = {
    Monday: {
      breakfast: { name: 'Poha & Chai',           veg: true,  desc: 'Flattened rice with peas and mustard seeds',          items: ['Poha','Chai','Banana'] },
      lunch:     { name: 'Dal Makhani Thali',      veg: true,  desc: 'Creamy black lentil curry with rice and roti',        items: ['Dal Makhani','Rice','Roti','Salad','Pickle'] },
      snack:     { name: 'Samosa & Chai',          veg: true,  desc: 'Crispy potato-stuffed pastry',                        items: ['Samosa','Green Chutney','Chai'] },
      dinner:    { name: 'Lauki Kofta',            veg: true,  desc: 'Bottle gourd dumplings in spiced tomato gravy',       items: ['Lauki Kofta','Rice','Roti','Raita'] },
    },
    Tuesday: {
      breakfast: { name: 'Idli Sambhar',           veg: true,  desc: 'Steamed rice cakes with lentil vegetable stew',       items: ['Idli','Sambhar','Coconut Chutney'] },
      lunch:     { name: 'Chicken Curry Thali',    veg: false, desc: 'Spiced chicken curry with rice and roti',             items: ['Chicken Curry','Rice','Roti','Raita','Salad'] },
      snack:     { name: 'Bread Pakoda',           veg: true,  desc: 'Spiced potato sandwiches fried in gram batter',       items: ['Bread Pakoda','Green Chutney','Chai'] },
      dinner:    { name: 'Paneer Butter Masala',   veg: true,  desc: 'Cottage cheese in rich tomato-butter sauce',          items: ['Paneer Butter Masala','Naan','Salad'] },
    },
    Wednesday: {
      breakfast: { name: 'Aloo Paratha',           veg: true,  desc: 'Spiced potato-stuffed flatbread with curd & butter',  items: ['Aloo Paratha','Curd','Butter','Pickle'] },
      lunch:     { name: 'Rajma Chawal',           veg: true,  desc: 'Kidney bean curry with steamed rice',                 items: ['Rajma','Rice','Roti','Salad','Papad'] },
      snack:     { name: 'Vada Pav',               veg: true,  desc: 'Mumbai-style spicy potato fritter in a bun',          items: ['Vada Pav','Chutney','Chai'] },
      dinner:    { name: 'Egg Curry',              veg: false, desc: 'Boiled eggs in spiced onion-tomato gravy',            items: ['Egg Curry','Rice','Roti','Salad'] },
    },
    Thursday: {
      breakfast: { name: 'Upma & Juice',           veg: true,  desc: 'Semolina porridge with vegetables',                   items: ['Upma','Orange Juice','Boiled Egg'] },
      lunch:     { name: 'Chhole Bhature',         veg: true,  desc: 'Spiced chickpea curry with fried bread',              items: ['Chhole','Bhature','Pickle','Onion Salad'] },
      snack:     { name: 'Fruit Chaat',            veg: true,  desc: 'Fresh seasonal fruits with chaat masala',             items: ['Seasonal Fruits','Chaat Masala','Lemon'] },
      dinner:    { name: 'Mutton Curry',           veg: false, desc: 'Slow-cooked mutton in aromatic whole spices',         items: ['Mutton Curry','Rice','Roti','Raita','Salad'] },
    },
    Friday: {
      breakfast: { name: 'Puri Aloo Sabzi',        veg: true,  desc: 'Deep-fried bread with spiced potato curry',           items: ['Puri','Aloo Sabzi','Chai','Pickle'] },
      lunch:     { name: 'Palak Paneer',           veg: true,  desc: 'Cottage cheese in spinach-tomato gravy',              items: ['Palak Paneer','Rice','Roti','Salad'] },
      snack:     { name: 'Maggi Noodles',          veg: true,  desc: 'Masala noodles with veggies',                         items: ['Maggi','Chai'] },
      dinner:    { name: 'Fish Curry',             veg: false, desc: 'Coastal-style fish in coconut-mustard gravy',         items: ['Fish Curry','Rice','Roti','Salad'] },
    },
    Saturday: {
      breakfast: { name: 'Masala Dosa',            veg: true,  desc: 'Crispy crepe with spiced potato filling',             items: ['Masala Dosa','Sambhar','Coconut Chutney'] },
      lunch:     { name: 'Chicken Biryani',        veg: false, desc: 'Fragrant basmati rice with spiced chicken',           items: ['Chicken Biryani','Raita','Salad','Papad'] },
      snack:     { name: 'Tea & Biscuits',         veg: true,  desc: 'Evening tea with assorted biscuits',                  items: ['Chai','Cream Biscuits','Rusk'] },
      dinner:    { name: 'Kadhi Chawal',           veg: true,  desc: 'Yogurt-gram flour curry with steamed rice',           items: ['Kadhi','Rice','Papad','Salad'] },
    },
    Sunday: {
      breakfast: { name: 'Chole Kulche',           veg: true,  desc: 'Spiced chickpea curry with soft leavened bread',      items: ['Chole','Kulche','Chai','Pickle'] },
      lunch:     { name: 'Special Sunday Thali',   veg: true,  desc: 'Festive thali with dal, paneer, rice and dessert',    items: ['Paneer Masala','Dal Fry','Jeera Rice','Roti','Raita','Gulab Jamun'] },
      snack:     { name: 'Ice Cream',              veg: true,  desc: 'Vanilla and chocolate soft serve',                    items: ['Vanilla Ice Cream','Chocolate Ice Cream'] },
      dinner:    { name: 'Butter Chicken',         veg: false, desc: 'Tender chicken in rich creamy tomato sauce',          items: ['Butter Chicken','Naan','Salad','Raita'] },
    },
  };

  // ── Students (50) ────────────────────────────────────────────
  const BASE_NAMES = [
    'Rahul Sharma','Priya Singh','Amit Verma','Neha Gupta','Ravi Kumar',
    'Anjali Mehta','Suresh Patel','Kavya Nair','Rohit Joshi','Pooja Yadav',
  ];
  const STUDENTS = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: BASE_NAMES[i % 10] + (i < 10 ? '' : ` ${Math.floor(i / 10) + 1}`),
  }));

  const CURRENT_STUDENT_ID = 1; // Logged-in student = Rahul Sharma

  // ── Opt-Outs: key = `${Day}-${meal}` → Set of student IDs ───
  const optOuts = {
    'Monday-dinner':    new Set([2,5,8,12,15,18,21,24,27,30]),
    'Tuesday-lunch':    new Set([3,6,9,13,16]),
    'Wednesday-dinner': new Set([4,7,11,14,17,20,23]),
    'Thursday-breakfast': new Set([2,5,8]),
    // Demo: 15 students opt out of Friday dinner (headcount 50→35)
    'Friday-dinner':    new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),
  };

  // ── 14-day Waste Logs (showing downward trend) ───────────────
  const wasteLogs = [
    { date:'2026-11-07', meal:'lunch',     rice:12, dal:6,  veg:9,  roti:6  },
    { date:'2026-11-07', meal:'dinner',    rice:14, dal:8,  veg:10, roti:7  },
    { date:'2026-11-08', meal:'breakfast', rice:3,  dal:1,  veg:2,  roti:2  },
    { date:'2026-11-08', meal:'lunch',     rice:11, dal:5,  veg:7,  roti:5  },
    { date:'2026-11-09', meal:'lunch',     rice:10, dal:5,  veg:7,  roti:4  },
    { date:'2026-11-09', meal:'dinner',    rice:12, dal:7,  veg:8,  roti:5  },
    { date:'2026-11-10', meal:'lunch',     rice:9,  dal:4,  veg:6,  roti:4  },
    { date:'2026-11-10', meal:'dinner',    rice:10, dal:5,  veg:7,  roti:5  },
    { date:'2026-11-11', meal:'lunch',     rice:8,  dal:4,  veg:5,  roti:3  },
    { date:'2026-11-11', meal:'dinner',    rice:9,  dal:4,  veg:6,  roti:4  },
    { date:'2026-11-12', meal:'lunch',     rice:7,  dal:3,  veg:5,  roti:3  },
    { date:'2026-11-12', meal:'dinner',    rice:8,  dal:3,  veg:5,  roti:3  },
    { date:'2026-11-13', meal:'lunch',     rice:6,  dal:3,  veg:4,  roti:2  },
    { date:'2026-11-14', meal:'dinner',    rice:5,  dal:2,  veg:4,  roti:2  },
  ];

  // ── Dish Ratings: key = `${Day}-${meal}` ────────────────────
  const ratings = {
    'Monday-breakfast':    { avg:4.1, count:32, userRating:0, comment:'' },
    'Monday-lunch':        { avg:4.5, count:45, userRating:0, comment:'' },
    'Monday-snack':        { avg:4.3, count:28, userRating:0, comment:'' },
    'Monday-dinner':       { avg:3.8, count:40, userRating:0, comment:'' },
    'Tuesday-breakfast':   { avg:4.6, count:44, userRating:0, comment:'' },
    'Tuesday-lunch':       { avg:4.2, count:38, userRating:0, comment:'' },
    'Tuesday-snack':       { avg:3.9, count:30, userRating:0, comment:'' },
    'Tuesday-dinner':      { avg:4.7, count:47, userRating:0, comment:'' },
    'Wednesday-breakfast': { avg:4.8, count:48, userRating:0, comment:'' },
    'Wednesday-lunch':     { avg:4.4, count:42, userRating:0, comment:'' },
    'Wednesday-snack':     { avg:4.0, count:35, userRating:0, comment:'' },
    'Wednesday-dinner':    { avg:3.7, count:36, userRating:0, comment:'' },
    'Thursday-breakfast':  { avg:3.5, count:25, userRating:0, comment:'' },
    'Thursday-lunch':      { avg:4.6, count:46, userRating:0, comment:'' },
    'Thursday-snack':      { avg:4.2, count:38, userRating:0, comment:'' },
    'Thursday-dinner':     { avg:4.1, count:40, userRating:0, comment:'' },
    'Friday-breakfast':    { avg:4.0, count:33, userRating:0, comment:'' },
    'Friday-lunch':        { avg:4.3, count:41, userRating:0, comment:'' },
    'Friday-snack':        { avg:3.6, count:22, userRating:0, comment:'' },
    'Friday-dinner':       { avg:3.9, count:35, userRating:0, comment:'' },
    'Saturday-breakfast':  { avg:4.7, count:47, userRating:0, comment:'' },
    'Saturday-lunch':      { avg:4.9, count:49, userRating:0, comment:'' },
    'Saturday-snack':      { avg:3.8, count:28, userRating:0, comment:'' },
    'Saturday-dinner':     { avg:4.0, count:36, userRating:0, comment:'' },
    'Sunday-breakfast':    { avg:4.5, count:43, userRating:0, comment:'' },
    'Sunday-lunch':        { avg:4.9, count:50, userRating:0, comment:'' },
    'Sunday-snack':        { avg:4.6, count:44, userRating:0, comment:'' },
    'Sunday-dinner':       { avg:4.3, count:42, userRating:0, comment:'' },
  };

  // ── Cooking coefficients (grams per student) ─────────────────
  const PORTIONS = { rice: 80, dal: 40, veg: 60, roti: 100 };

  const TOTAL_ENROLLED = 50;
  const SAFETY_MARGIN  = 1.05;
  const MEAL_REBATE    = 30; // ₹ per skipped meal

  return {
    DAYS, MEAL_TIMES, MENU,
    STUDENTS, CURRENT_STUDENT_ID,
    optOuts, wasteLogs, ratings,
    PORTIONS, TOTAL_ENROLLED, SAFETY_MARGIN, MEAL_REBATE,
  };
})();
