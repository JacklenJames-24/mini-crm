
const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_crm',
  port: process.env.DB_PORT || 3306,
};

async function seedDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await connection.execute('DELETE FROM communication_log');
    await connection.execute('DELETE FROM campaigns');
    await connection.execute('DELETE FROM orders');
    await connection.execute('DELETE FROM customers');
    
    // Reset auto increment
    await connection.execute('ALTER TABLE customers AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE orders AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE campaigns AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE communication_log AUTO_INCREMENT = 1');
    
    console.log('✅ Cleared existing data');
    
    // Seed customers
    const customers = [];
    for (let i = 0; i < 50; i++) {
      const customer = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        spend: parseFloat(faker.finance.amount(0, 10000, 2)),
        visits: faker.number.int({ min: 0, max: 50 }),
        last_active_date: faker.date.between({ from: '2023-01-01', to: new Date() }),
      };
      customers.push(customer);
    }
    
    const customerQuery = 'INSERT INTO customers (name, email, spend, visits, last_active_date) VALUES (?, ?, ?, ?, ?)';
    for (const customer of customers) {
      await connection.execute(customerQuery, [
        customer.name,
        customer.email,
        customer.spend,
        customer.visits,
        customer.last_active_date
      ]);
    }
    
    console.log('✅ Seeded 50 customers');
    
    // Get customer IDs
    const [customerRows] = await connection.execute('SELECT id FROM customers');
    const customerIds = customerRows.map(row => row.id);
    
    // Seed orders
    for (let i = 0; i < 200; i++) {
      const customerId = faker.helpers.arrayElement(customerIds);
      const orderValue = parseFloat(faker.finance.amount(10, 1000, 2));
      const orderDate = faker.date.between({ from: '2023-01-01', to: new Date() });
      
      await connection.execute(
        'INSERT INTO orders (customer_id, order_value, order_date) VALUES (?, ?, ?)',
        [customerId, orderValue, orderDate]
      );
    }
    
    console.log('✅ Seeded 200 orders');
    
    // Update customer spend based on orders
    await connection.execute(`
      UPDATE customers c 
      SET spend = (
        SELECT COALESCE(SUM(o.order_value), 0) 
        FROM orders o 
        WHERE o.customer_id = c.id
      )
    `);
    
    console.log('✅ Updated customer spend totals');
    
    // Seed sample campaigns
    const sampleCampaigns = [
      {
        name: 'High Value Customers',
        rules: JSON.stringify([{ field: 'spend', operator: '>', value: 5000 }]),
        audience_size: 15
      },
      {
        name: 'Inactive Users',
        rules: JSON.stringify([{ field: 'last_active_date', operator: '<', value: '2024-01-01' }]),
        audience_size: 23
      },
      {
        name: 'Frequent Visitors',
        rules: JSON.stringify([{ field: 'visits', operator: '>', value: 20 }]),
        audience_size: 18
      }
    ];
    
    for (const campaign of sampleCampaigns) {
      await connection.execute(
        'INSERT INTO campaigns (name, rules, audience_size) VALUES (?, ?, ?)',
        [campaign.name, campaign.rules, campaign.audience_size]
      );
    }
    
    console.log('✅ Seeded sample campaigns');
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };