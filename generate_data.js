const fs = require('fs');

const categories = ['Food', 'Travel', 'Shopping', 'Education', 'Utilities', 'Entertainment', 'Health', 'Other'];

const items = {
  Food: ['Campus Cafeteria', 'Ramen Noodles', 'Pizza Delivery', 'Coffee Shop', 'Midnight Snacks', 'Boba Tea', 'Dining Hall', 'Taco Bell'],
  Travel: ['Bus Pass', 'Uber to Party', 'Train Ticket Home', 'Gas Share', 'Lyft to Campus', 'Subway Ticket'],
  Shopping: ['Thrift Store', 'Amazon Textbooks', 'Target Run', 'Stationery', 'Hoodie from Store', 'Dorm Decor'],
  Education: ['Course Materials', 'Library Printing', 'Used Textbook', 'Lab Notebook', 'Online Course Fee'],
  Utilities: ['Phone Bill', 'Dorm WiFi', 'Laundry Card', 'Spotify Premium'],
  Entertainment: ['Movie Tickets', 'Concert', 'Video Game', 'Party Supplies', 'Netflix Split'],
  Health: ['Pharmacy', 'Gym Pass', 'Vitamins', 'Student Health Center'],
  Other: ['Club Dues', 'Haircut', 'Gift for Friend', 'Fundraiser']
};

const incomeItems = ['Allowance from Parents', 'Campus Job', 'Tutoring', 'Financial Aid', 'Selling old books'];

const transactions = [];
let currentDate = new Date('2026-05-10T00:00:00.000Z');

for (let i = 1; i <= 100; i++) {
  const isIncome = Math.random() < 0.15; // 15% chance of income
  
  let category, name, amount, type;
  
  if (isIncome) {
    type = 'income';
    category = 'Income';
    name = incomeItems[Math.floor(Math.random() * incomeItems.length)];
    amount = parseFloat((Math.random() * 200 + 50).toFixed(2));
  } else {
    type = 'expense';
    category = categories[Math.floor(Math.random() * categories.length)];
    const names = items[category] || items['Other'];
    name = names[Math.floor(Math.random() * names.length)];
    amount = -parseFloat((Math.random() * 45 + 5).toFixed(2));
  }
  
  transactions.push({
    id: i.toString(),
    name,
    category,
    amount,
    date: new Date(currentDate.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    type
  });
}

transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

const data = JSON.parse(fs.readFileSync('src/data.json', 'utf8'));
data.transactions = transactions;

fs.writeFileSync('src/data.json', JSON.stringify(data, null, 2));
console.log('Done');
