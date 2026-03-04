import Link from "next/link";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Marketing Header */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                            <span className="sr-only">Clinica</span>
                            <div className="h-8 w-8 bg-blue-600 rounded-md"></div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">Clínica</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/cadastro"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                        >
                            Criar Conta
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 isolate">
                {children}
            </main>

            {/* Marketing Footer */}
            <footer className="bg-white" aria-labelledby="footer-heading">
                <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2>
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                    <div className="border-t border-gray-900/10 pt-8 mt-16 md:flex md:items-center md:justify-between">
                        <p className="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
                            &copy; 2026 Sistema para Clínicas Odontológicas. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
