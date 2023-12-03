const tryCatchWrapper = (controler) => {
  const fn = async (req, res, next) => {
    try {
      await controler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return fn;
};

export default tryCatchWrapper;
