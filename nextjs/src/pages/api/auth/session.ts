import { withSessionRoute } from '@/lib/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

interface GetResponse {
    isLoggedIn: boolean;
}

interface DeleteResponse {}

/**
 * セッション確認用ルート
 * @param req
 * @param res
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json({
            isLoggedIn: !!req.session.user,
        } as GetResponse);
    }
    if (req.method === 'DELETE') {
        req.session.destroy();
        res.status(200).json({} as DeleteResponse);
    }
}

export default withSessionRoute(handler);
