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

 // UPLOAD AVATAR
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {

    try {
       const fileName = `${req.body.name}-avatar.png`

        // Menyimpan foto di folder
       await sharp(req.file.buffer).png().resize(500).toFile(`${filesDirectory}/${fileName}`)
       
       // const avatar = `${req.body.username}-avatar.png`
       // const sql = `UPDATE users SET avatar = '${avatar}' WHERE username = '${req.body.username}'`
 
       const sql = `UPDATE heroes SET avatar = ? WHERE name = ?`
       const data = [fileName, req.body.name]
 
       
 
       // Simpan nama avata di kolom 'avatar'
       conn.query(sql, data, (err, result) => {
          // Jika ada error saat running sql
          if(err) return res.send(err)
 
          // Simpan nama fotonya di database
          res.status(201).send({ message: 'Berhasil di upload' })
       })
 
 
    } catch (err) {
       res.status(500).send(err.message)
    }
 
    }, (err, req, res, next) => {
       // Jika terdapat masalah terhadap multer, kita akan kirimkan error
       res.send(err)
})

router.post('/hero', (req, res) => {
    
    const sql = 'INSERT INTO heroes SET ?'
    const data = req.body
    data.password = bcrypt.hashSync(data.password, 8)

    conn.query(sql, data, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

router.get('/hero/:id', (req, res) => {
    
    const sql = `SELECT * FROM heroes WHERE id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

router.get('/hero', (req, res) => {
    
    const sql = `SELECT * FROM heroes WHERE attribute = '${req.query.attribute}'`

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)

        res.status(200).send(result)
    })
})

// LOGIN
router.post('/hero/login', (req, res) => {
    const {name, password} = req.body
 
    const sql = `SELECT * FROM heroes WHERE name = '${name}'`
    const sql2 = `INSERT INTO tokens SET ?`
 
 
    conn.query(sql, (err, result) => {
       // cek error
       if(err) return res.send(err)
 
       // result = [ {} ]
       let user = result[0]
       // Jika name tidak ditemukan
       if(!user) return res.send('name tidak ditemukan')
       // Verifikasi password
       let validPassword = bcrypt.compareSync(password, user.password)
       // Jika password salah
       if(!validPassword) return res.send('Password tidak valid')
       // Membuat token
       let token = jwt.sign({id: user.id}, 'fresh-rain8')
 
       // user_id dan token merupakan nama kolok yang ada di tabel 'tokens'
       const data = {user_id : user.id, token: token}
 
       conn.query(sql2, data, (err, result) => {
          if(err) return res.send(err)
 
          // Untuk tidak menampilkan/menghapus beberapa property sebelum dikirim
          delete user.password
          delete user.avatar
          delete user.verified
          
          res.send({
             message: 'Login Berhasil',
             user,
             token
          })
       })
 
       
    })
 })
 
 // GET AVATAR
 router.get('/hero/avatar', auth, (req, res) => {
    // Menyimpan nme pada variable
    const name = req.hero.name

    res.send(req.hero)
 
    // // Cari nama file di database
    // const sql = `SELECT avatar FROM heroes WHERE name = '${name}'`
 
    // // Kirim file ke client
    // conn.query(sql, async (err, result) => {
 
    //    // Jika ada error saat running sql
    //    if(err) return res.send(err)
 
    //    try {
    //       // Nama file avatar
    //       const fileName = result[0].avatar
 
    //       // Mengirim file sebagai respon
    //       res.sendFile(`${filesDirectory}/${fileName}`, (err) => {
    //          // Mengirim object error jika terjadi masalah
    //          if(err) return res.send(err)
    //       })
    //    } catch (err) {
    //       res.send(err.message)
    //    }
          
    // })
 })


module.exports = router