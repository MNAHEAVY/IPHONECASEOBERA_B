const { Router } = require("express");
const getBanners = require("../controllers/banners/getBanners");
const updateBanner = require("../controllers/banners/editBanner");
const router = Router();

router.get("/banners", getBanners);
router.put("/banners/:id", updateBanner);

module.exports = router;
