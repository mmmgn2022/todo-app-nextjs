import styles from '../styles/layout.module.css';
import React, { ReactNode } from 'react'; //In the TypeScript version, we added the import React, { ReactNode } from 'react'; line to import React and ReactNode types.

//To convert the given JavaScript code into TypeScript, you need to add type annotations to the function parameters and props.


interface LayoutProps { //We also created an interface LayoutProps to describe the expected props of the Layout component. 
  children: ReactNode; //The children prop is given the type ReactNode, which is a built-in type for any React child component. 
}

export default function Layout(props: LayoutProps) { // The function parameter props is then annotated with the LayoutProps type.
  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>To Do</h1>
      {props.children}
    </div>
  );
}

/*
Javascript from the source link :

import styles from '../styles/layout.module.css'

export default function Layout(props) {
  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>To Do</h1>
      {props.children}
    </div>
  )
}
*/
