import "../env";
import { API_URL, API_PORT, FILE_PATH } from "../envType";
import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

app.post(
  "/img/upload/:fileName",
  upload.single("image"),
  (req: Request, res: Response): void => {
    (async () => {
      try {
        const fileName = req.params.fileName;
        const fileData = req.file;

        if (!fileData) {
          console.error("No file uploaded.");
          return res.status(400).send("No file uploaded.");
        }

        const filePath = path.join(FILE_PATH, fileName);
        console.log("File Path : " + filePath);
        if (fs.existsSync(filePath)) {
          console.error("Already exist file.");
          return res.status(403).send("Already exist file.");
        }

        fs.writeFileSync(filePath, fileData.buffer);
        console.log("File saved successfully!");
        res.status(200).send("File saved successfully!");
      } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).send("Error saving file");
      }
    })();
  }
);

app.get("/load/png/:fileName", (req: Request, res: Response): void => {
  (async () => {
    try {
      const pngFileName = req.params.fileName;
      const filePath = path.join(FILE_PATH, pngFileName);

      if (!fs.existsSync(filePath)) {
        console.error("File not found");
        return res.status(404).send("File not found");
      }

      const pngFileData = fs.readFileSync(filePath);

      res.setHeader("Content-Type", "image/png");
      res.status(200).send(pngFileData);
    } catch (error) {
      console.error("Error reading image:", error);
      res.status(500).send("Internal Server Error");
    }
  })();
});

app.get("/test/:param1", (req, res) => {
  const param1 = req.params.param1;

  res.send(`Received: ${param1}`);
});

app.listen(API_PORT, () => {
  console.log(API_URL);
  console.log("File Server running on port " + API_PORT);
  console.log("File Path : " + FILE_PATH);
});
