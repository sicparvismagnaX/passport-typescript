import mongoose from "mongoose";

mongoose.connect(
    "mongodb://testuser:test@localhost:27017/test?retryWrites=true&w=majority",
    {},
    function (err) {
      if (err) throw err;
    }
  );