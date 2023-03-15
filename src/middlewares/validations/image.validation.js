const uploadProfileImage = async (req, res, next) => {
  try {
    /**
     * If File is present in request
     */
    if (req.files.profile) {
      req.file = req.files.profile;
      next();
    } else {
      return res.status(400).send({
        error: 'File missing in Request',
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: 'File missing in Request',
      data: error,
    });
  }
};

const uploadItemImage = async (req, res, next) => {
  try {
    /**
     * If File is present in request
     */
    if (req.files.item) {
      req.file = req.files.item;
      next();
    } else {
      return res.status(400).send({
        error: 'File missing in Request',
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: 'File missing in Request',
      data: error,
    });
  }
};

export default {
  uploadProfileImage,
  uploadItemImage,
};
