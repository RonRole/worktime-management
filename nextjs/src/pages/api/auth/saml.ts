import { NextApiRequest, NextApiResponse } from 'next';
import saml from '@/lib/saml';
import prisma from '@/lib/prisma';
import { withSessionRoute } from '@/lib/withSession';

/**
 * IdPからのSaml Assertionに対して直接redirectを行った場合、
 * redirect先にcookieが送信されない
 * (外部サイトからのリクエストという扱いになっている?)
 *
 * 対策として、ページを読み込ませてからjsでリダイレクトさせる
 */
const jsRedirectPage = '<html><script>location.href = "/sample"</script></html>';

/**
 * Saml AssertionをPOSTで受け取るAPI
 *
 * やること
 * 1. Saml Assertionの検証
 * 2. Sessionにユーザー情報を設定
 * 3. リダイレクト
 *
 * @param req
 * @param res
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json('Resource not allowed');
        return;
    }
    try {
        const samlResponse = await saml.validatePostResponseAsync(req.body);
        const user = await prisma.user.findFirst({
            where: {
                id: samlResponse.profile?.nameID,
            },
        });
        if (!user) {
            res.redirect('/top');
            return;
        }
        req.session.user = user;
        await req.session.save();
        // IdPからのSamlAssertionに対して直接redirectするとcookieが送信されないので、
        //
        res.send(jsRedirectPage);
    } catch (e: any) {
        console.log(e);
        res.status(500).json('Error occurs');
    }
}

export default withSessionRoute(handler);
