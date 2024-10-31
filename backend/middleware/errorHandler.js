require("dotenv").config();
const express = require("express");

function errorHandler(err, req, res, next) {
  console.error("Error:", err); // Log error for debugging

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err,
  });
}

module.exports = errorHandler;
