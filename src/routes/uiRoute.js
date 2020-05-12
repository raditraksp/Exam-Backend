const router = require('express').Router()
const conn = require('../config/db')


/////////////////////////////////////////////
///   T A B E L   I N V E  N T O R Y     ////
/////////////////////////////////////////////

// R E A D   U I //
router.get('/inventory', (req, res) => {

    const sql = `SELECT i.inventory_id, p.name, s.branch_name, i.inventory FROM inventory i JOIN products p 
    ON i.product_id = p.product_id JOIN stores s 
    ON i.store_id = s.store_id;`
 
    // Running query
    conn.query(sql, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
           UI: result
       })
    })
})

// C R E A T E     I N V E N T O R Y //
router.post('/inventory', (req, res) => {

    const sql = `INSERT INTO inventory SET ?`
    const data = req.body
 
    // Running query
    conn.query(sql, data, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
          message: 'Inventory Added'
       })
    })
})

// U P D A T E    I N V E N T O R Y   S T O C K //
router.patch('/inventory/:inventory_id', (req, res) => {
   
    const sql = `UPDATE inventory SET inventory = ? WHERE inventory_id = ?`
    const data = [req.body, req.params.inventory_id]
    // Running query
    conn.query(sql, data, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
          message: 'Inventory Updated',
       })
    })
})

// D E L E T E   I N V  E N T O R Y //
router.delete('/inventory/:inventory_id', (req, res) => {
    const sql = `DELETE FROM inventory WHERE inventory_id = ${req.params.inventory_id}`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err.sqlMessage)

        res.send({
            message: 'Iventory (Stock) Deleted'
        })
    })
})


module.exports = router