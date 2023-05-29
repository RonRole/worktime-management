import { SAML, SamlConfig } from '@node-saml/node-saml/lib';

const options: SamlConfig = {
    cert: process.env.SAML_IDP_CERT as string,
    issuer: process.env.SAML_SP_ISSUER as string,
    audience: process.env.SAML_IDP_AUDIENCE,
};

const saml = global.saml || new SAML(options);

if(process.env.NODE_ENV === 'development') global.saml = saml

export default saml;
