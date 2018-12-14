"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://lulu:ml1284@ds153841.mlab.com:53841/artistogram-api";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://lulu:ml1284@ds153841.mlab.com:53841/artistogram-api";
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || "WEST_HAM_UNITED";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
