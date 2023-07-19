import Image from 'next/image';
import styles from '../styles/todo.module.css';

//To convert the given JavaScript code into TypeScript, you need to add type annotations to the function parameters and props. 

interface ToDoProps { //In the TypeScript version, we created an interface ToDoProps to describe the expected props of the ToDo component.
  todo: { //The todo prop is an object with id, completed, and name properties. 
    id: number;
    completed: boolean;
    name: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void; //The onChange prop is a function that takes a React.ChangeEvent<HTMLInputElement> event and an id number as parameters,
  onDelete: (id: number) => void; //the onDelete prop is a function that takes an id number as a parameter. 
}

export default function ToDo(props: ToDoProps) { // The function parameter props is then annotated with the ToDoProps type.
  const { todo, onChange, onDelete } = props;
  return (
    <div className={styles.toDoRow} key={todo.id}>
      <input
        className={styles.toDoCheckbox}
        name="completed"
        type="checkbox"
        checked={todo.completed}
        // value={todo.completed}
        onChange={(e) => onChange(e, todo.id)}
      />
      <input
        className={styles.todoInput}
        autoComplete='off'
        name="name"
        type="text"
        value={todo.name}
        onChange={(e) => onChange(e, todo.id)}
      />
      <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}>
        <Image src="/material-symbols_delete-outline-sharp.svg" width={24} height={24} alt="delete" /> 
      </button>
    </div>
  );
}


/*
Javascript from the source link :


import Image from 'next/image'
import styles from '../styles/todo.module.css'

export default function ToDo(props) {
    const { todo, onChange, onDelete } = props;
    return (
        <div className={styles.toDoRow} key={todo.id}>
        <input className={styles.toDoCheckbox} name="completed" type="checkbox" checked={todo.completed} value={todo.completed} onChange={(e) => onChange(e, todo.id)}></input>
        <input className={styles.todoInput} autoComplete='off' name="name" type="text" value={todo.name} onChange={(e) => onChange(e, todo.id)}></input>
        <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}><Image src="/material-symbols_delete-outline-sharp.svg" width="24px" height="24px" /></button>
        </div>
        )
    }


*/

// adjusted the width and height props in the Image component to use numbers instead of strings for better type safety 
   


