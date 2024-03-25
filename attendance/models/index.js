const { pool } = require('../config/pg');
const bcrypt = require("../helpers/bcrypt")

module.exports.findOneToday = async (id) => {
  const client = await pool.connect().catch((err) => {
    throw err
});
  try {
    const query = `SELECT id, employee_id, TO_CHAR(time_in, 'HH24:MI') AS time_in, TO_CHAR(time_out, 'HH24:MI') AS time_out, created_At FROM attendance_table
                    WHERE employee_id = '${id}' AND DATE(created_at) = CURRENT_DATE LIMIT 1;`
    console.log("query", query);
    const res = await client.query(query);
    console.l
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

module.exports.createNewAttendance = async (id) => {
  const client = await pool.connect().catch((err) => {
    throw err
  });
  try {

    const query = `INSERT INTO "attendance_table" (employee_id, time_in) 
                    VALUES ('${id}', NOW()) returning *;`;
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

module.exports.updateClockOut = async (id) => {
  console.log(id)
  const client = await pool.connect().catch((err) => {
    throw err
  });

  try {
      let query = `UPDATE attendance_table SET time_out = NOW() WHERE id ='${id}' returning *`;
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

module.exports.getAllAttendancebyEmployee = async (payload, id) => {
  const client = await pool.connect().catch((err) => {
  });

  try {
      let offset = 0;
      let count = 0;
      let qry_count_so =  `  SELECT count(a.id)  `;
          qry_count_so += ` FROM attendance_table a where a.employee_id='${id}'`;

          if(payload.start_date || payload.end_date){
            qry_count_so += ` and a.created_at BETWEEN '${payload.start_date} 00:00:00'  and  '${payload.end_date} 24:00:00'  `
          }          
          
      
      console.log("qry_count_so: ", qry_count_so);
      const res_tot_data = await client.query(qry_count_so);
      console.log("res_total_data:" , res_tot_data.rows[0].count);
      const total_data = res_tot_data.rows[0].count;
     
      
      if(payload.page > 1 ){
        offset = (payload.page * payload.showentry) - payload.showentry;
      }
      
      if (payload.showentry) {
        qry_count_so += ` LIMIT ${payload.showentry} `;
      }

      if (offset) {
        qry_count_so += ` OFFSET ${offset} `;
      }

      const res_count_so = await client.query(qry_count_so);
  
      if(res_count_so.rows.length>0){
        count = res_count_so.rows[0].count;
      }
      
      const tot_page = Math.ceil(count/payload.showentry);

      let qry_select_so =  `  select a.* FROM attendance_table a WHERE a.employee_id='${id}'`;

          if(payload.start_date || payload.end_date){
            qry_select_so += ` and a.created_at BETWEEN '${payload.start_date} 00:00:00'  and  '${payload.end_date} 24:00:00'  `
          }
     
     
        if(payload.key){
          qry_select_so += ` ORDER BY ${payload.key} ${payload.order} `;
        }else{
          qry_select_so += ` ORDER BY a.created_at DESC `;
        }
      

      if (payload.showentry) {
        qry_select_so += ` LIMIT ${payload.showentry} `;
      }

      if (offset) {
        qry_select_so += ` OFFSET ${offset} `;
      }

      console.log("qry_select_so: ", qry_select_so);
      
      const res_list = await client.query(qry_select_so);
      
      const result = {
        totalFiltered :total_data,
        currentPage: payload.page,
        data : res_list.rows,
        totalPage: tot_page
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
};

module.exports.getDataPagination = async (showentry, page, order, key, search) => {
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let offset = 0;
      let count = 0;
      let query_count_customer =  `  SELECT count(a.id) FROM attendance_table a LEFT JOIN employee_table e ON a.employee_id = e.id `;

      if (search) {
          query_count_customer += ` AND (e.email LIKE $$%` + search + `%$$ ) `;
      }

      if(page > 1 ){
        offset = (page * showentry) - showentry;
      }
      
      if (showentry) {
        query_count_customer += ` LIMIT ${showentry} `;
      }

      console.log("query_count_customer: ", query_count_customer);

      const res_count_customer = await client.query(query_count_customer);

      if(res_count_customer.rows.length > 0){
        count = res_count_customer.rows[0].count;
      }
      
     
      const tot_page = Math.ceil(count/showentry);


      let query_select_customer =  ` SELECT * `;
          query_select_customer += ` FROM attendance_table a LEFT JOIN employee_table e ON a.employee_id = e.id`;

      if (search) {
          query_select_customer += ` AND (e.email LIKE $$%` + search + `%$$ ) `;
      }

      if(key){
        query_select_customer += ` ORDER BY ${key} ${order} `;
      }else{
        query_select_customer += ` ORDER BY a.created_at DESC `;
      }
      

      if (showentry) {
          query_select_customer += ` LIMIT ${showentry} `;
      }

      if (offset) {
          query_select_customer += ` OFFSET ${offset} `;
      }

      console.log("query_select_customer: ", query_select_customer);
      
      const res_list_attendance = await client.query(query_select_customer);
      const attendance =  res_list_attendance.rows;

      const result = {
        totalFiltered :count,
        currentPage: page,
        data : attendance,
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
};