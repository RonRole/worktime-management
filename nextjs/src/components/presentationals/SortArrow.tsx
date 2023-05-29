import React from 'react';

export type SortArrowProps = {
    orderBy?: 'ASC' | 'DESC';
};

type Arrows = {
    [key in 'ASC' | 'DESC']: string;
};

const Arrows: Arrows = {
    ASC: '▲',
    DESC: '▼',
} as const;

export default function SortArrow({ orderBy }: SortArrowProps) {
    return <>{orderBy && Arrows[orderBy]}</>;
}
