const express = require('express');
const path = require('path');
const oracledb = require('oracledb');

const app = express();
const PORT = process.env.PORT || 3002;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure Oracle DB connection
const dbConfig = {
  user: 'sys',
  password: '12345678',
  connectString: 'localhost:1521/orcl',
  privilege: oracledb.SYSDBA
};

// Define route to fetch properties with filters
app.get('/fetch_properties', async (req, res) => {
  const { price, parking, garden, swimmingPool, homeTheatre } = req.query;

  let filterQuery = '';
  let filterParams = [];
  if (price) {
    filterQuery += 'Price <= :price';
    filterParams.push(price);
  }
  if (parking) {
    if (filterQuery) filterQuery += ' AND ';
    filterQuery += `Parking = '${parking}'`;
  }
  if (garden) {
    if (filterQuery) filterQuery += ' AND ';
    filterQuery += `Garden = '${garden}'`;
  }
  if (swimmingPool) {
    if (filterQuery) filterQuery += ' AND ';
    filterQuery += `Swimming_pool = '${swimmingPool}'`;
  }
  if (homeTheatre) {
    if (filterQuery) filterQuery += ' AND ';
    filterQuery += `Home_theatre = '${homeTheatre}'`;
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    let sql = `SELECT p.* FROM Properties p JOIN Prop_features pf ON p.Property_ID = pf.Property_ID`;
    if (filterQuery) {
      sql += ` WHERE ${filterQuery}`;
    }

    const result = await connection.execute(sql, filterParams);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Serve the index.html file when the root URL is requested
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
