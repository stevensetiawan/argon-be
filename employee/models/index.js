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

module.exports.getDataPagination = async (showentry, page, order, key, search) => {
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let offset = 0;
      let count = 0;
      let query_count_employee =  `  SELECT count(e.id) FROM employee_table e `;

      if (search) {
          query_count_employee += ` AND (e.email LIKE $$%` + search + `%$$ ) `;
      }

      if(page > 1 ){
        offset = (page * showentry) - showentry;
      }
      
      if (showentry) {
        query_count_employee += ` LIMIT ${showentry} `;
      }

      console.log("query_count_customer: ", query_count_employee);

      const res_count_employee = await client.query(query_count_employee);

      if(res_count_employee.rows.length > 0){
        count = res_count_employee.rows[0].count;
      }
      
     
      const tot_page = Math.ceil(count/showentry);


      let query_select_customer =  ` SELECT * `;
          query_select_customer += ` FROM employee_table e `;

      if (search) {
          query_select_customer += ` AND (e.email LIKE $$%` + search + `%$$ ) `;
      }

      if(key){
        query_select_customer += ` ORDER BY ${key} ${order} `;
      }else{
        query_select_customer += ` ORDER BY e.created_at DESC `;
      }
      

      if (showentry) {
          query_select_customer += ` LIMIT ${showentry} `;
      }

      if (offset) {
          query_select_customer += ` OFFSET ${offset} `;
      }

      console.log("query_select_customer: ", query_select_customer);
      
      const res_list_employee = await client.query(query_select_customer);
      const employee =  res_list_employee.rows;

      const result = {
        totalFiltered :count,
        currentPage: page,
        data : employee,
        total_page: tot_page
      
      }
      return result;

  } catch (err) {
      console.log(err);
      return err;
  } finally {
      if (client) {
          client.release();
      }
  }
}

module.exports.createNewOne = async (data, image) => {
  const client = await pool.connect().catch((err) => {
    console.log(err);
    errConnect = err;
});
  try {
    const rounds =  10;
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

module.exports.findAbsentById = async (data) => {
  const client = await pool.connect().catch((err) => {
    console.log(err);
    errConnect = err;
});
  try {
    const query = `SELECT * FROM employee_table where id = ${data.id} AND LIMIT 1 `;
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