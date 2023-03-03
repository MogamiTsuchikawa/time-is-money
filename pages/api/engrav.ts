// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOption } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOption);
  if (!session) res.status(401).end();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });
  if (!user) {
    res.status(500).end();
    return;
  }
  switch (req.method) {
    case "GET":
      //今日の分の勤怠一覧を返す
      const today = new Date(Date.now());
      const todayList = await prisma.workSpan.findMany({
        where: {
          userId: {
            equals: user.id,
          },
          startAt: {
            gte: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            ),
            lt: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 1
            ),
          },
        },
      });
      res.status(200).json(todayList);
      break;
    case "POST":
      //勤怠を付ける
      let yesterdayTime = new Date(Date.now());
      yesterdayTime.setDate(yesterdayTime.getDate() - 1);
      const target = await prisma.workSpan.findFirst({
        where: {
          userId: { equals: user!.id },
          endAt: { equals: null },
          startAt: { gte: yesterdayTime },
        },
      });
      if (!target) {
        //新規作成
        await prisma.workSpan.create({
          data: {
            userId: user.id,
            startAt: new Date(Date.now()),
            endAt: undefined,
          },
        });
        res.status(201).end();
        return;
      } else {
        //既存に追加
        const updateRes = await prisma.workSpan.update({
          where: { id: target.id },
          data: { ...target, endAt: new Date(Date.now()) },
        });
        res.status(201).end();
        return;
      }
      break;
  }
}
