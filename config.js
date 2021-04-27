"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb+srv://Lucy:Silsa1284mdb@cluster0.xm1ci.mongodb.net/artistogram-api?retryWrites=true&w=majority";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb+srv://Lucy:Silsa1284mdb@cluster0.xm1ci.mongodb.net/artistogram-api?retryWrites=true&w=majority";
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || "WEST_HAM_UNITED";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

exports.SPOTIFY_OAUTH =
  process.env.SPOTIFY_OAUTH ||
  'BQC5MyYSm1XuZpAhQi7komTIoClVRqJsJ4An8k6aRvMInrlim8BDnIK8nUXiM2wI-oVY94rgx_mSyJO8xNeHxfiWLVsCYkGQS3RHqc5UkdO5k9JmvdZvSK_AM4HGtyV1XVczVjJ5X4PsCdBOF5MpEzQYkrUihzbBwQDUuGFseqDuipBWlqRcth_ubOQ6xv8uHh5Qy3222WZoeLEc';
exports.SPOTIFY_CLIENT_ENCODED = process.env.SPOTIFY_CLIENT_ENCODED || "NDhiYzBjOWMyNjRjNDBlM2FlOTJjNWIwNzE5NTQ3YmQ6YzllYTllNTliNzM3NDYyOWE5MjgwYWVlNTMxNGQ5NDI=";
