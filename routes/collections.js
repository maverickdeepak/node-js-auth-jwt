const router = require("express").Router();
const { publicCollections, privateCollections } = require("../db");
const checkAuth = require("../middleware/checkauth");

router.get("/public", function (req, res) {
  res.json({ collections: publicCollections });
});

router.get("/private", checkAuth, function (req, res) {
  res.json({ collections: privateCollections });
});

module.exports = router;
