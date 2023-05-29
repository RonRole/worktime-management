import { SAML } from '@node-saml/node-saml/lib';
import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
    var saml: SAML | undefined;
}
