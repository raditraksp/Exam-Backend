const router = require('express').Router()
const conn = require('../config/db')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const sharp = require('sharp')
const jwt = require('jsonwebtoken')
const auth = require('../auth')

const upload = multer({
    limits: {
        fileSize: 10000000 // Byte , default 1MB
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
 
        cb(undefined, true)
    }
 })
 
 const filesDirectory = path.join(__dirname, '../../public/files')


///////////////////////////////////////////
///   T A B E L   P R O D U  C T      /////
///////////////////////////////////////////


// U P L O A D   I M A G E //
router.post('/image', upload.single('image'), async (req, res) => {

    try {
       const fileName = `${req.body.id}-image.png`

        // Menyimpan foto di folder
       await sharp(req.file.buffer).png().resize(500).toFile(`${filesDirectory}/${fileName}`)
 
       const sql = `UPDATE products SET image = ? WHERE product_id = ?`
       const data = [fileName, req.body.id]
       
       // Simpan nama image di kolom 'image'
       conn.query(sql, data, (err, result) => {
          // Jika ada error saat running sql
          if(err) return res.send(err)
 
          // Simpan nama fotonya di database
          res.status(201).send({ message: 'Image Uploaded' })
       })
 
 
    } catch (err) {
       res.status(500).send(err.message)
    }
 
    }, (err, req, res, next) => {
       // Jika terdapat masalah terhadap multer, kita akan kirimkan error
       res.send(err)
})

// R E A D   I M A G E //
router.get('/image/:product_id', (req, res) => {
 
    // Cari nama file di database
    const sql = `SELECT image FROM products WHERE product_id = '${req.params.product_id}'`
 
    // Kirim file ke client
    conn.query(sql, async (err, result) => {
 
       // Jika ada error saat running sql
       if(err) return res.send(err)
        
       
       try {
          // Nama file image
          const fileName = result[0].image

          if(result[0].image == 'default.png') return res.send('Image has not uploaded')

          // Mengirim file sebagai respon
          res.sendFile(`${filesDirectory}/${fileName}`, (err) => {
             // Mengirim object error jika terjadi masalah
             if(err) return res.send(err)
          })
       } catch (err) {
          res.send(err.message)
       }
    })
 })

// C R E A T E     P R O D U C T //
router.post('/product', (req, res) => {

    const sql = `INSERT INTO products SET ?`
    const data = req.body
    req.body.image = 'default.png'
 
    // Running query
    conn.query(sql, data, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
          message: 'Product Added',
       })
    })
})

 // R E A D   P R O D U C T //
router.get('/product/:product_id', (req, res) => {

    const sql = `SELECT * FROM products WHERE product_id = ${req.params.product_id}`
 
    // Running query
    conn.query(sql, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
           Product: result
       })
    })
})

// U P D A T E    P R O D U C T //
router.patch('/product/:product_id', (req, res) => {
   
    const sql = `UPDATE products SET ? WHERE product_id = ?`
    const data = [req.body, req.params.product_id]
    // Running query
    conn.query(sql, data, (err, result) => {
       // Jika ada error kita akan kirim object errornya
       if(err) return res.send(err)
  
       // Jika berhasil, kirim object
       res.send({
          message: 'Product Updated',
       })
    })
})

// D E L E T E   P R O D U C T //
router.delete('/product/:product_id', (req, res) => {
    const sql = `DELETE FROM products WHERE product_id = ${req.params.product_id}`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err.sqlMessage)

        res.send({
            message: 'Product Deleted'
        })
    })
})



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