const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: 'postgres',
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE openjob_v1');
    console.log('Database openjob_v1 created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database openjob_v1 already exists');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
