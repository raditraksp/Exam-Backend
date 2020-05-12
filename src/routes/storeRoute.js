const router = require('express').Router()
const conn = require('../config/db')


////////////////////////////////////
///   T A B E L   S T O R E     ////
////////////////////////////////////

// C R E A T E     S T O R E //
router.post('/store', (req, res) => {

    const sql = `INSERT INTO stores SET ?`
    const data = req.body
 
    // Running query
    conn.query(sql, data, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
          message: 'Brance Name Added',
       })
    })
})

// R E A D   S T O R E //
router.get('/store/:store_id', (req, res) => {

    const sql = `SELECT * FROM stores WHERE store_id = ${req.params.store_id}`
 
    // Running query
    conn.query(sql, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
           Store: result
       })
    })
})

// U P D A T E    P R O D U C T //
router.patch('/store/:store_id', (req, res) => {
   
    const sql = `UPDATE stores SET ? WHERE store_id = ?`
    const data = [req.body, req.params.store_id]
    // Running query
    conn.query(sql, data, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
          message: 'Store Updated',
       })
    })
})

// D E L E T E   S T O R E //
router.delete('/store/:store_id', (req, res) => {
    const sql = `DELETE FROM stores WHERE store_id = ${req.params.store_id}`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err.sqlMessage)

        res.send({
            message: 'Store Deleted'
        })
    })
})


module.exports = router