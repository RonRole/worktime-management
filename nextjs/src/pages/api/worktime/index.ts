import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { addMonths, parseDate } from '@/domains/date';
import { redirectIfUnauthorizedRoute, withSessionRoute } from '@/lib/withSession';

type PostData = {
    // yyyyMM
    targetMonth: string;
    inputDataList: {
        projectCodeId: string;
        date?: string;
        minutes?: number;
        content?: string;
    }[];
};

const post: Parameters<typeof redirectIfUnauthorizedRoute>['2'] = (user) =>
    async function (req: NextApiRequest, res: NextApiResponse) {
        const deleteWorkTimeDetails = prisma.workTimeDetail.deleteMany({
            where: {
                userId: user.id,
                date: {
                    gte: parseDate((req.body as PostData).targetMonth, 'yyyyMM'),
                    lte: addMonths(parseDate((req.body as PostData).targetMonth, 'yyyyMM'), 1),
                },
            },
        });
        const createWorkTimeDetails = (req.body as PostData).inputDataList.map((datum) =>
            prisma.workTimeDetail.create({
                data: {
                    projectCodeId: datum.projectCodeId,
                    userId: user.id,
                    date: datum.date ? parseDate(datum.date, 'yyyy-MM-dd') : undefined,
                    minutes: datum.minutes,
                    content: datum.content,
                },
            }),
        );
        await prisma.$transaction([deleteWorkTimeDetails, ...createWorkTimeDetails]);
        res.status(200).json({ data: req.body });
    };

const reqMap: { [method: string]: NextApiHandler } = {
    POST: (req, res) => redirectIfUnauthorizedRoute(req, res, post),
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const handler = reqMap[req.method || ''];
    await handler(req, res);
}

export default withSessionRoute(handler);
