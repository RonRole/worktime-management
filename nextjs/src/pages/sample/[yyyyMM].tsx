import WorkTimePage from '@/components/pages/WorkTimePage';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import prisma from '@/lib/prisma';
import React from 'react';
import WorkTimeDetail from '@/domains/work-time-detail';
import { parseISO } from 'date-fns';
import { redirectIfUnauthorizedSsr, withSessionSsr } from '@/lib/withSession';
import { totalMinutes } from '@/domains/time';
import { addMonths, formatDate, parseDate } from '@/domains/date';
import { useRouter } from 'next/router';

type SamplePageProps = {
    yyyyMM: string;
    projectCodes: {
        [id: string]: {
            id: string;
            name: string;
        };
    };
    workTimeDetails: {
        id: number;
        // ISO
        date: string | null;
        projectCodeId: string | null;
        minutes: number | null;
        content: string | null;
    }[];
};

const redirectOptions = {
    redirectUrl: '/top',
    propsOnRedirect: {
        props: { yyyyMM: '197001', projectCodes: {}, workTimeDetails: [] },
    },
};

async function getServerSideSamplePageProps(context: GetServerSidePropsContext) {
    return redirectIfUnauthorizedSsr(
        redirectOptions,
        context,
        (user) =>
            async function (context: GetServerSidePropsContext) {
                const dateParams = context.query['yyyyMM'] as string;
                const targetDate = parseDate(dateParams, 'yyyyMM');
                const projectCodesSrc = await prisma.projectCode.findMany({ orderBy: [{ id: 'asc' }] });
                const projectCodes = Object.fromEntries(
                    projectCodesSrc.map((src) => [src.id, { id: '' + src.id, name: src.name }]),
                );
                const workTimeDetailsSrc = await prisma.workTimeDetail.findMany({
                    where: {
                        date: {
                            gte: targetDate,
                            lte: addMonths(targetDate, 1),
                        },
                        userId: user.id,
                    },
                    orderBy: [
                        {
                            date: 'desc',
                        },
                        {
                            minutes: 'desc',
                        },
                    ],
                });
                const workTimeDetails = workTimeDetailsSrc.map((src) => {
                    return {
                        id: src.id,
                        date: src.date?.toISOString() || null,
                        projectCodeId: '' + src.projectCodeId,
                        minutes: src.minutes || null,
                        content: src.content || null,
                    };
                });
                const props: SamplePageProps = {
                    yyyyMM: formatDate(targetDate, 'yyyyMM'),
                    projectCodes,
                    workTimeDetails,
                };
                return {
                    props,
                };
            },
    );
}

export const getServerSideProps = withSessionSsr(getServerSideSamplePageProps);

export default function Sample({ yyyyMM, projectCodes, workTimeDetails }: SamplePageProps) {
    const router = useRouter();
    const workTimeDetailsProp = workTimeDetails?.map(
        (detail) =>
            new WorkTimeDetail({
                ...detail,
                date: detail.date ? parseISO(detail.date) : undefined,
                projectCodeId: detail.projectCodeId || undefined,
                time: totalMinutes({ minutes: detail.minutes || 0 }),
                content: detail.content || undefined,
            }),
    );
    return (
        <WorkTimePage
            onChangeMonth={(yyyyMM) => router.push(`/sample/${encodeURIComponent(yyyyMM)}`)}
            yyyyMM={yyyyMM}
            projectCodeMap={projectCodes}
            workTimeDetails={workTimeDetailsProp}
        />
    );
}
