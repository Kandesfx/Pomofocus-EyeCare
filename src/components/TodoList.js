import React from 'react';

export default function TodoList({ t, todos, todoInput, setTodoInput, handleAddTodo, toggleTodo, deleteTodo }) {
  return (
    <div className="todo-panel">
      <h3><span role="img" aria-label="todo">📝</span> {t.todoTitle}</h3>
      <form className="todo-form" onSubmit={handleAddTodo} autoComplete="off">
        <input
          className="todo-input"
          type="text"
          placeholder={t.addPlaceholder}
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          maxLength={60}
        />
        <button className="btn add-todo-btn" type="submit">{t.add}</button>
      </form>
      <ul className="todo-list">
        {todos.length === 0 && <li className="todo-empty">{t.todoEmpty}</li>}
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? 'todo-done' : ''}>
            <label>
              <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
              <span>{todo.text}</span>
            </label>
            <button className="delete-todo-btn" title={t.delete} onClick={() => deleteTodo(todo.id)}>
              <span role="img" aria-label="delete">🗑️</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
