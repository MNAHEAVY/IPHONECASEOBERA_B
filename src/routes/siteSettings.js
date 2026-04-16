const { Router } = require("express");
const { getSiteSettings, updateTopBarSettings } = require("../controllers/siteSettings");

const router = Router();

router.get("/", getSiteSettings);
router.put("/topbar", updateTopBarSettings);

module.exports = router;
