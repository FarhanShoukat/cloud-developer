import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import * as fs from "fs";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    if (!req.query || ! req.query.image_url) {
      res.status(422).send("image_url is required");
    }

    try {
      const filePath: string = await filterImageFromURL(req.query.image_url);
      const data: Buffer = fs.readFileSync(filePath);

      deleteLocalFiles([filePath]);

      res.header("content-type", "image/jpeg").status(200).send(data);
    } catch (err) {
      res.status(422).send(err);
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();