import { formatDate, parseDate } from '@/domains/date';
import { redirectIfUnauthorizedSsr, withSessionSsr } from '@/lib/withSession';
import { GetServerSidePropsContext } from 'next';
import { Router, useRouter } from 'next/router';
import React from 'react';

async function getServerSideSamplePageProps(context: GetServerSidePropsContext) {
    return redirectIfUnauthorizedSsr(
        {
            redirectUrl: '/top', propsOnRedirect: {props:{}}
        },
        context,
        (_) => () => {return {props: {}}}
    )
}

export const getServerSideProps = withSessionSsr(getServerSideSamplePageProps)

export default function Sample() {
    const todayYYYYMM = formatDate(new Date(), 'yyyyMM');
    const router = useRouter();
    React.useLayoutEffect(() => {
        router.push(`/sample/${todayYYYYMM}`);
    });
    return <></>;
}
