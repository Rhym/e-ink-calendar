import Head from 'next/head';
import { Calendar } from '../components';

export default function Home() {
  // Render
  //-----------------------------------------------------

  return (
    <div>
      <Head>
        <title>{`Inky`}</title>
        <meta name="description" content="Ink Screen Calendar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex flex-column h-screen w-full">
          <Calendar />
        </div>
      </main>
    </div>
  )
}
