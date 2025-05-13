const categoryModel = require('../../models/categoryModel')
const { responseReturn } = require('../../utiles/response')
const formidable = require('formidable')
const fs = require('fs')
const ImageKit = require('imagekit')

// ImageKit config
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

class categoryController {

    add_category = async (req, res) => {
        const form = formidable()
        form.parse(req, async (err, fields, files) => {
            if (err) {
                responseReturn(res, 404, { error: 'something error' })
            } else {
                let { name } = fields
                let { image } = files
                name = name.trim()
                const slug = name.split(' ').join('-')

                try {
                    const fileBuffer = fs.readFileSync(image.filepath)
                    const result = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalFilename,
                        folder: "categorys"
                    })

                    if (result) {
                        const category = await categoryModel.create({
                            name,
                            slug,
                            image: result.url
                        })
                        responseReturn(res, 201, { category, message: 'category add success' })
                    } else {
                        responseReturn(res, 404, { error: 'Image upload failed' })
                    }
                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal server error' })
                }
            }
        })
    }

    get_category = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        try {
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const categorys = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { totalCategory, categorys })
            }
            else if (searchValue === '' && page && parPage) {
                const categorys = await categoryModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { totalCategory, categorys })
            }
            else {
                const categorys = await categoryModel.find({}).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { totalCategory, categorys })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = new categoryController()
