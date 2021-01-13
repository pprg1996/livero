import { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.json({ name: "John Doessssssssss" });
  res.end();
};
