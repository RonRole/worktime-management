# 環境変数について

## HOST

アプリケーションの URL
ex.) http://localhost:3000

## NEXT_PUBLIC_API_HOST

アプリケーションの api 部の URL  
Next.js の仕様で、$HOST/apiがサーバー側のエンドポイントになるので、  
$HOST/api と設定しておく

## NEXT_PUBLIC_SAML_IDP_URL

SAML 認証において、IdP 側に認証要求を送るための URL  
IdP の管理画面から確認できるはず  
Okta の場合"General"=>"App Embed Link"として確認できる

## SAML_IDP_CERT

SAML 認証において、IdP 側の署名の証明書(signing certificate)  
IdP の管理画面から確認できるはず  
Okta の場合、"Sign On"=>"SAML Signing Certificates"から確認できる

## SAML_IDP_AUDIENCE

SAML 認証において、IdP 側の Audience の設定値  
IdP の管理画面から確認できるはず  
Okta の場合、"General"=>"SAML Settings"=>"Audience Restriction"から確認できる

## SAML_SP_ISSUER

SAML 認証において、AuthnRequest に含む SP 側の発行者名
