const {Media, Review} = require('../models');
const {validationResult} = require("express-validator");

exports.getAllMedia = async (req, res) => {
    //get the user
    Media.find().lean()
        .then(async media => {
            if (!media) {
                res.status(500).send([]);
            }
            const mediaWithReviews = await Promise.all(media.map(async (mediaItem) => {
                const reviews = await Review.find({media: mediaItem._id}).lean();
                return {
                    ...mediaItem,
                    reviews
                };
            }));

            res.status(200).send(mediaWithReviews);
        })
        .catch(err => {
            res.status(500).send({error: err.message});
        });
};

exports.getMediaById = async (req, res) => {
    const {id} = req.params;
    Media.findById(id).lean()
        .then(async media => {
            if (!media) {
                res.status(500).send([]);
            }
            const reviews = await Review.find({media: id}).lean();

            const mediaWithReviews = {
                ...media,
                reviews
            };

            res.status(200).send(mediaWithReviews);
        })
        .catch(err => {
            res.status(500).send({error: err.message});
        });
}

exports.addMedia = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    Media.create(req.body)
        .then(newMedia => {
            res.status(200).send(newMedia);
        })
        .catch(err => {
            res.status(500).send({error: err.message});
        });
}

exports.editMedia = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const {id} = req.params;
    const updateData = req.body;

    Media.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .then(updatedMedia => {
            if (!updatedMedia) {
                return res.status(404).send({ message: 'Media not found' });
            }
            res.status(200).send(updatedMedia);
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
}

exports.deleteMedia = (req, res) => {
    const {id} = req.params;

    Media.findByIdAndDelete(id)
        .then(deletedMedia => {
            if (!deletedMedia) {
                return res.status(404).send({ message: 'Media not found' });
            }
            res.status(200).send({ message: 'Media deleted successfully' });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
}
