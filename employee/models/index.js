const { pool } = require('../config/pg');
const bcrypt = require("../helpers/bcrypt")

module.exports.findOneByEmail = async (data) => {
  const client = await pool.connect().catch((err) => {
    console.log(err);
    errConnect = err;
});
  try {
    const query = `SELECT * FROM employee_table
                    WHERE email = '${data.email}';`
    console.log("query", query);
    const res = await client.query(query);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};



module.exports.createNewOne = async (data, image) => {
  const client = await pool.connect().catch((err) => {
    console.log(err);
    errConnect = err;
});
  try {
    const rounds = env === 'development' ? 1 : 10;
    const hash = bcrypt.hasher(data.password, rounds);

    const query = `INSERT INTO "employee_table" (name, email, emp_photo, position, phone, password) 
                    VALUES ('${data.name}', '${data.email}', '${image}', '${data.position}', '${data.phone}', '${hash}');`;
    console.log('query:', query);
    const res = await client.query(query);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.findOneById = async (data) => {
  const client = await pool.connect().catch((err) => {
    console.log(err);
    errConnect = err;
});
  try {
    const query = `SELECT * FROM employee_table where id = ${data.id} LIMIT 1 `;
    console.log('query:', query);
    const res = await client.query(query);
    console.log(res.rows,'ini')
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.updateEmployee = async (id, data, image) => {
  console.log(id, data)
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let query = `UPDATE employee_table SET name = '${data.name}', email = '${data.email}', phone = '${data.phone}',  position = '${data.position}',  emp_photo = '${image}', password = '${data.password}' WHERE id ='${id}' returning *`;
      console.log('query:', query);
      const res = await client.query(query);
      console.log('res:', res);
      return res.rows[0];
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};