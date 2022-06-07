import mongoose from "mongoose";

mongoose.connect(
    "mongodb://mongoadmin:secret@sssm_mongo:27888/test?authSource=admin",
    {},
    function (err) {
      if (err) throw err;
    }
  );