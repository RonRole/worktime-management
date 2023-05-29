import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProjectCode() {
    const seeds = [
        { id: 'PLANNING', name: '企画立案' },
        { id: 'SALES', name: '営業活動' },
        { id: 'DEVELOPMENT', name: '開発' },
    ];
    const promises = seeds.map((seed) => prisma.projectCode.create({ data: seed }));
    await prisma.$transaction(promises);
}

async function main() {
    await seedProjectCode();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
