import { v4 as uuidv4 } from 'uuid';
// import multer from 'multer';
import ImageKit from 'imagekit';
import config from '../config';

// const upload = multer({ dest: 'uploads/' });
const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL,
});

/**
 * Upload Profile Image
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const uploadProfileImage = async (req, res) => {
  try {
    const uploadData = {
      file: req.file.data,
      fileName: `${req.file.name}-${uuidv4()}`,
      folder: 'profile_images',
    };
    await imagekit
      .upload(uploadData)
      .then((response) => {
        return res.status(201).send({
          response,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          error: 'An error occured while uploading file to server',
          data: error,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'An Error Occured while uploading File',
    });
  }
};

/**
 * Upload Item Image
 * @param {object} req
 * @param {object} res
 * @returns object
 */
const uploadItemImage = async (req, res) => {
  try {
    const uploadData = {
      file: req.file.data,
      fileName: `${req.file.name}-${uuidv4()}`,
      folder: 'item_images',
    };
    await imagekit
      .upload(uploadData)
      .then((response) => {
        return res.status(201).send({
          response,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          error: 'An error occured while uploading file to server',
          data: error,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: 'An Error Occured while uploading File',
    });
  }
};

export default {
  uploadProfileImage,
  uploadItemImage,
};
