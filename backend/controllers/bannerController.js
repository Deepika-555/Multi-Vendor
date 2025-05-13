const formidable = require('formidable');
const productModel = require('../models/productModel');
const bannerModel = require('../models/bannerModel');
const { responseReturn } = require('../utiles/response');
const { mongo: { ObjectId } } = require('mongoose');
const fs = require('fs');
const ImageKit = require('imagekit');

// ImageKit config
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

class bannerController {
    add_banner = async (req, res) => {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, field, files) => {
            const { productId } = field;
            const { image } = files;

            try {
                const { slug } = await productModel.findById(productId);

                const fileBuffer = fs.readFileSync(image.filepath);
                const result = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalFilename,
                    folder: "banners"
                });

                const banner = await bannerModel.create({
                    productId,
                    banner: result.url,
                    link: slug
                });

                responseReturn(res, 201, { banner, message: "banner add success" });
            } catch (error) {
                console.log(error);
                responseReturn(res, 500, { message: error.message });
            }
        });
    }

    get_banner = async (req, res) => {
        const { productId } = req.params;
        try {
            const banner = await bannerModel.findOne({ productId: new ObjectId(productId) });
            responseReturn(res, 200, { banner });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { message: error.message });
        }
    }

    get_banners = async (req, res) => {
        try {
            const banners = await bannerModel.aggregate([
                {
                    $sample: {
                        size: 10
                    }
                }
            ]);
            responseReturn(res, 200, { banners });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { message: error.message });
        }
    }

    update_banner = async (req, res) => {
        const { bannerId } = req.params;
        const form = formidable({});

        form.parse(req, async (err, _, files) => {
            const { image } = files;

            try {
                let banner = await bannerModel.findById(bannerId);

                // ImageKit doesn't support delete by URL; you must store and use fileId (optional)
                // For now, we skip delete (or use cleanup outside if needed)

                const fileBuffer = fs.readFileSync(image.filepath);
                const uploadResult = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalFilename,
                    folder: "banners"
                });

                await bannerModel.findByIdAndUpdate(bannerId, {
                    banner: uploadResult.url
                });

                banner = await bannerModel.findById(bannerId);
                responseReturn(res, 200, { banner, message: "banner update success" });

            } catch (error) {
                console.log(error);
                responseReturn(res, 500, { message: error.message });
            }
        });
    }
}

module.exports = new bannerController();
