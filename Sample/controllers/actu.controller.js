const db = require('../models')
const fs = require('fs')


// image Upload
const multer = require('multer')
const path = require('path')

// create main Model
const Actu = db.actu
const Categorie = db.categorie


// main work

// 1. create actu

const addActu = async (req, res) => {

    const id = req.params.id

    let info = {
        categorie_id: id,
        title: req.body.title,
        subtitle: req.body.subtitle,
        text: req.body.text,
        image: req.file.path,
    }

    const actu = await Actu.create(info)
    res.status(200).send(actu)
}



// 2. get all actus

const getAllActus = async (req, res) => {

    let actu = await Actu.findAll({})
    res.status(200).send(actu)

}



// 3. get single actu

const getOneActu = async (req, res) => {

    let id = req.params.id
    let actu = await Actu.findOne({ where: { id: id }})
    res.status(200).send(actu)

}



// 4. update Actu

const updateActu = async (req, res) => {

    let id = req.params.id
    let data

    if (req.file) {
        let actu = await Actu.findOne({ where: { id: id }})
            if (actu.image) {
                const filename = actu.image.split("Images/")[1];
                fs.unlink(`Images/${filename}`, (err => {
                    if (err) console.log(err);
                    else {
                        console.log(`\nDeleted file: ${filename}`);
                    }
                }));
            }
        data = {
            categorie_id: req.body.categorie_id,
            title: req.body.title,
            subtitle: req.body.subtitle,
            text: req.body.text,
            image: req.file.path,
        }
    }else{
        data = {
            categorie_id: req.body.categorie_id,
            title: req.body.title,
            subtitle: req.body.subtitle,
            text: req.body.text,
        }
    }

    const actu = await Actu.update(data, { where: { id: id }})

    res.status(200).send(actu)

}



// 5. delete actu by id

const deleteActu = async (req, res) => {

    let id = req.params.id

    let actu = await Actu.findOne({ where: { id: id }})
    if (actu.image) {
        const filename = actu.image.split("Images/")[1];
        fs.unlink(`Images/${filename}`, (err => {
            if (err) console.log(err);
            else {
                console.log(`\nDeleted file: ${filename}`);
            }
        }));
    }
    
    await Actu.destroy({ where: { id: id }} )

    res.status(200).send('Actu is deleted !')
}





// 6. Upload Image Controller

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1331200' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|webp/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')



module.exports ={
    addActu,
    getAllActus,
    getOneActu,
    updateActu,
    deleteActu,
    upload,
}
