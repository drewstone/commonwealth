import express, { Express, Request, Response } from "express";
import { rabbitMQ } from './config'
import createMQProducer from './producer';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

const produceMessage = createMQProducer(rabbitMQ.url, "snapshot_event");

export interface SnapshotEvent {
  id: string;
  event: string;
  space: string;
  expire: number;
}

app.get("/", (req: Request, res: Response) => {
  res.send("OK!");
});

app.post("/snapshot", async (req: Request, res: Response) => {
  try {
    const event: SnapshotEvent = req.body.event;
    if (!event) {
      res.status(500).send("Error sending snapshot event");
    }

    const success = produceMessage(JSON.stringify(event));
    
    if (success) {
      res.status(201).send("Snapshot event sent: " + JSON.stringify(event));
    } else {
      res.status(500).send("Error sending snapshot event");
    }

  } catch (err) {
    console.log(err);

    res.status(500).send("error: " + err);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
