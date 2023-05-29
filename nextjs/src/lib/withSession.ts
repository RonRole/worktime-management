import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { IronSessionData, getIronSession } from 'iron-session/edge';
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
    NextApiRequest,
    NextApiResponse,
} from 'next';

declare module 'iron-session' {
    interface IronSessionData {
        user?: {
            id: string;
        };
    }
}

export const sessionOptions: Parameters<typeof getIronSession>['2'] = {
    cookieName: process.env.COOKIE_NAME as string,
    password: process.env.COOKIE_PASSWORD as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        maxAge: 60 * 30,
        secure: process.env.NODE_ENV === 'production',
    },
};

export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function redirectIfUnauthorizedRoute(
    req: NextApiRequest,
    res: NextApiResponse,
    next: (user: NonNullable<IronSessionData['user']>) => NextApiHandler,
) {
    const user = req.session.user;
    if (!user) {
        res.status(403).json('Not Authorized');
        return;
    }
    return next(user)(req, res);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, sessionOptions);
}

type SsrRedirectOption<P extends { [key: string]: unknown }> = {
    redirectUrl: string;
    propsOnRedirect: GetServerSidePropsResult<P>;
};

export function redirectIfUnauthorizedSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    { redirectUrl, propsOnRedirect }: SsrRedirectOption<P>,
    context: GetServerSidePropsContext,
    next: (
        user: NonNullable<IronSessionData['user']>,
    ) => (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
): GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>> {
    if (!context.req.session.user) {
        context.res.writeHead(302, { Location: redirectUrl });
        context.res.end();
        return propsOnRedirect;
    }
    return next(context.req.session.user)(context);
}
