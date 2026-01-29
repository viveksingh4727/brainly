import express from "express";
import { Request, Response } from "express";


const app = express();


app.post("/api/v1/signup", (req : Request, res: Response) => {
    res.send("You're signed up!");
});

app.post("/api/v1/login", (req: Request, res: Response) => {

});

app.post("/api/v1/content", (req: Request, res: Response) => {
    
});

app.get("/api/v1/content", (req: Request, res: Response) => {

});

app.delete("/api/v1/content", (req: Request, res: Response) => {

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

