import styles from '../styles/todo-list.module.css';
import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { debounce } from 'lodash';
import ToDo from './todo';

interface Todo {
  id: number;
  name: string;
  completed: boolean;
}

export default function ToDoList() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [mainInput, setMainInput] = useState<string>('');
  const [filter, setFilter] = useState<boolean | undefined>();
  const didFetchRef = useRef<boolean>(false);

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true;
      fetchTodos();
    }
  }, []);

  async function fetchTodos(completed?: boolean) {
    try {
      let path = '/todos';
      if (completed == true) {
        path = `/todos?completed=1`;
      } else if (completed == false) {
        path = `/todos?completed=0`;
      }
      const res = await fetch(`http://localhost:8000` + path);
  
      // Check if the response status is not in the 2xx range (i.e., an error occurred)
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const json = await res.json();
      setTodos(json);
    } catch (error) {
      // Handle any errors that occurred during the fetch or parsing process
      console.error('Error fetching todos:', error);
    }
  }

  
  const debouncedUpdateTodo = useCallback(debounce(updateTodo, 500), []);

  function handleToDoChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // Use optional chaining (?.) and nullish coalescing (??) to handle null todos,  when accessing the todos array. This way, TypeScript knows that the changedToDo assignment will only happen if todos is not null.
    const copy = [...(todos ?? [])]; //By using todos ?? [] in the spread syntax, we ensure that copy is an empty array if todos is null
    const idx = todos?.findIndex((todo) => todo.id === id) ?? -1;
    if (idx !== -1) {
      const changedToDo = {
        ...(todos![idx] as Todo), // Use non-null assertion (!) here to let TypeScript know it's not null
        [name]: value,
      };
      copy[idx] = changedToDo;
      debouncedUpdateTodo(changedToDo);
      setTodos(copy);
    }
  }

  async function updateTodo(todo: Todo) {
    const data = {
      name: todo.name,
      completed: todo.completed,
    };
    const res = await fetch(`http://localhost:8000` + `/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async function addToDo(name: string) {
    const res = await fetch(`http://localhost:8000` + `/todos/`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        completed: false,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const json = await res.json();
      const copy = todos ? [...todos, json] : [json];
      setTodos(copy);
    }
  }

  async function handleDeleteToDo(id: number) {
    const res = await fetch(`http://localhost:8000` + `/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok && todos) {
      const idx = todos.findIndex((todo) => todo.id === id);
      if (idx !== -1) {
        const copy = [...todos];
        copy.splice(idx, 1);
        setTodos(copy);
      }
    }
  }

  function handleMainInputChange(e: ChangeEvent<HTMLInputElement>) {
    setMainInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (mainInput.length > 0) {
        addToDo(mainInput);
        setMainInput('');
      }
    }
  }

  function handleFilterChange(value?: boolean) {
    setFilter(value);
    fetchTodos(value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainInputContainer}>
        <input
          className={styles.mainInput}
          placeholder="What needs to be done?"
          value={mainInput}
          onChange={(e) => handleMainInputChange(e)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {!todos && <div>Loading...</div>}
      {todos && (
        <div>
          {todos.map((todo) => (
            <ToDo key={todo.id} todo={todo} onDelete={handleDeleteToDo} onChange={handleToDoChange} />
          ))}
        </div>
      )}
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${filter === undefined && styles.filterActive}`} onClick={() => handleFilterChange()}>
          All
        </button>
        <button className={`${styles.filterBtn} ${filter === false && styles.filterActive}`} onClick={() => handleFilterChange(false)}>
          Active
        </button>
        <button className={`${styles.filterBtn} ${filter === true && styles.filterActive}`} onClick={() => handleFilterChange(true)}>
          Completed
        </button>
      </div>
    </div>
  );
}



/*
Javascript from the source link :

import styles from '../styles/todo-list.module.css'
import { useState, useEffect, useCallback, useRef } from 'react'
import { debounce } from 'lodash'
import ToDo from './todo'

export default function ToDoList() {
  const [todos, setTodos] = useState(null)
  const [mainInput, setMainInput] = useState('')
  const [filter, setFilter] = useState()
  const didFetchRef = useRef(false)

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true
      fetchTodos()
    }
  }, [])

  async function fetchTodos(completed) {
    let path = '/todos'
    if (completed !== undefined) {
      path = `/todos?completed=${completed}`
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path)
    const json = await res.json()
    setTodos(json)
  }

  const debouncedUpdateTodo = useCallback(debounce(updateTodo, 500), [])

  function handleToDoChange(e, id) {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    const copy = [...todos]
    const idx = todos.findIndex((todo) => todo.id === id)
    const changedToDo = {
      ...todos[idx],
      [name]: value
    }
    copy[idx] = changedToDo
    debouncedUpdateTodo(changedToDo)
    setTodos(copy)
  }

  async function updateTodo(todo) {
    const data = {
      name: todo.name,
      completed: todo.completed
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async function addToDo(name) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        completed: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      const json = await res.json();
      const copy = [...todos, json]
      setTodos(copy)
    }
  }

  async function handleDeleteToDo(id) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      const idx = todos.findIndex((todo) => todo.id === id)
      const copy = [...todos]
      copy.splice(idx, 1)
      setTodos(copy)
    }
  }

  function handleMainInputChange(e) {
    setMainInput(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (mainInput.length > 0) {
        addToDo(mainInput)
        setMainInput('')
      }
    }
  }

  function handleFilterChange(value) {
    setFilter(value)
    fetchTodos(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainInputContainer}>
        <input className={styles.mainInput} placeholder="What needs to be done?" value={mainInput} onChange={(e) => handleMainInputChange(e)} onKeyDown={handleKeyDown}></input>
      </div>
      {!todos && (
        <div>Loading...</div>
      )}
      {todos && (
        <div>
          {todos.map((todo) => {
            return (
              <ToDo todo={todo} onDelete={handleDeleteToDo} onChange={handleToDoChange} />
            )
          })}
        </div>
      )}
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${filter === undefined && styles.filterActive}`} onClick={() => handleFilterChange()}>All</button>
        <button className={`${styles.filterBtn} ${filter === false && styles.filterActive}`} onClick={() => handleFilterChange(false)}>Active</button>
        <button className={`${styles.filterBtn} ${filter === true && styles.filterActive}`} onClick={() => handleFilterChange(true)}>Completed</button>
      </div>
    </div>
  )
}

*/