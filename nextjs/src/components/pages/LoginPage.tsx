import Link from 'next/link';
import NavHeader from '../presentationals/NavHeader';

export default function LoginPage() {
    return (
        <>
            <NavHeader />
            <div className='container grid mx-auto h-screen content-center'>
                <span className='col-span-1 mb-2 text-4xl font-bold text-center'>作業工数入力画面モックアップ</span>
                <div className='col-span-1 grid content-center justify-center'>
                    <Link
                        className='text-white rounded px-5 border-solid border-2 border-blue-500 bg-blue-500 hover:bg-transparent hover:text-blue-500'
                        href={process.env.NEXT_PUBLIC_SAML_IDP_URL || '#'}
                    >
                        SAML Login
                    </Link>
                </div>
            </div>
        </>
    );
}
