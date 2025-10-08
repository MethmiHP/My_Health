// const express = require("express");
// const router = express.Router();

// const hospitalAuthRoutes = require('./routes/hospitalAuth.routes');

// router.use('/api/hospital/auth', hospitalAuthRoutes);


// module.exports = router;

// router/index.js
const express = require("express");
const router = express.Router();

const hospitalAuthRoutes = require('./routes/hospitalAuth.routes');

// NOTE: Only '/hospital/auth' here; '/api' is added in server.js
router.use('/hospital/auth', hospitalAuthRoutes);

// (optional) health route through the aggregator
router.get('/health', (req,res)=>res.json({ok:true}));

module.exports = router;
