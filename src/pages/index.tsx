import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Layout from '../components/layout';
import ToDoList from '../components/todo-list';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Head>
        <title>Full Stack Book To Do App</title>
        <meta name="description" content="Full Stack Book To Do" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {/* Layout : component that we can reuse at every page to get the same layout */}
      <Layout> 
        {/*ToDoList : this is the component with all the todo list functionality */}
        <ToDoList />
      </Layout>
    </div>
  )
}
