
const AppError = require("../Errors/AppError");
const express = require('express');
const router = express.Router();
router.get("/health",(req,res)=>{
    res.status(200).json({
        status:"ok",
        service: "distributor-api",



    });

});


 
router.get("/test-async-error", async (req, res) => {
  throw new Error("Something went wrong in async route");
});

 module.exports= router;

/*router.get("/test-error", (req, res, next) => {
  const error = new Error("This is a test error");
  error.statusCode = 400;

  next(error);
});*/