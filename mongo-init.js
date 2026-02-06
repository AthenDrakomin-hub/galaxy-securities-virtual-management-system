// MongoDB initialization script for Galaxy Securities Virtual Management System
// This script runs when the MongoDB container is first started

db = db.getSiblingDB('galaxy_securities');

// Create application user with limited privileges
db.createUser({
  user: 'galaxy_app',
  pwd: 'app_password_123',
  roles: [
    { role: 'readWrite', db: 'galaxy_securities' }
  ]
});

// Create collections
db.createCollection('virtual_users');
db.createCollection('virtual_stocks');
db.createCollection('virtual_trades');
db.createCollection('virtual_holdings');
db.createCollection('system_logs');

// Create indexes
db.virtual_users.createIndex({ username: 1 }, { unique: true });
db.virtual_stocks.createIndex({ symbol: 1 }, { unique: true });
db.virtual_trades.createIndex({ userId: 1, timestamp: -1 });
db.virtual_holdings.createIndex({ userId: 1, symbol: 1 }, { unique: true });
db.system_logs.createIndex({ time: -1 });

print('✅ Galaxy Securities MongoDB database initialized successfully!');
