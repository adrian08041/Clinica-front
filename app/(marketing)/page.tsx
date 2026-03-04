import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 font-sans">
                    O futuro da gestão odontológica.
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10">
                    Uma plataforma completa para modernizar o atendimento, simplificar a gestão e impulsionar o crescimento da sua clínica.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/cadastro"
                        className="inline-flex justify-center items-center rounded-md bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                        Começar Gratuitamente
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex justify-center items-center rounded-md bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Acessar Sistema
                    </Link>
                </div>
            </section>

            {/* Features Section placeholder */}
            <section className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tudo que você precisa</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Gerencie pacientes, agendamentos, finanças e muito mais. Construído com a mais moderna tecnologia para a sua clínica.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
