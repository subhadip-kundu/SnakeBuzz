import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoopTimeout = useRef(null);

  const handleKeyDown = useCallback((event) => {
    const { key } = event;
    if (key.startsWith('Arrow')) {
      const newDirection = key.substr(5).toUpperCase();
      if (
        newDirection !== direction &&
        !(newDirection === 'UP' && direction === 'DOWN') &&
        !(newDirection === 'DOWN' && direction === 'UP') &&
        !(newDirection === 'LEFT' && direction === 'RIGHT') &&
        !(newDirection === 'RIGHT' && direction === 'LEFT')
      ) {
        setDirection(newDirection);
      }
    }
  }, [direction]);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case DIRECTIONS.UP:
        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case DIRECTIONS.DOWN:
        head.y = (head.y + 1) % GRID_SIZE;
        break;
      case DIRECTIONS.LEFT:
        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case DIRECTIONS.RIGHT:
        head.x = (head.x + 1) % GRID_SIZE;
        break;
      default:
        break;
    }

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
      const newFood = generateRandomFood();
      setFood(newFood);
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    // Check for collision with self
    if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);
    setSnake(newSnake);
  }, [direction, snake, food, score]);

  const generateRandomFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  useEffect(() => {
    const handleKeyDownRef = (e) => handleKeyDown(e);
    document.addEventListener('keydown', handleKeyDownRef);

    return () => {
      document.removeEventListener('keydown', handleKeyDownRef);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isGameOver) {
      gameLoopTimeout.current = setTimeout(moveSnake, 1000);
    }

    return () => clearTimeout(gameLoopTimeout.current);
  }, [snake, direction, isGameOver, moveSnake]);

  return (
    <div className="game">
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      <div className="grid">
        {[...Array(GRID_SIZE).keys()].map((row) => (
          <div key={row} className="row">
            {[...Array(GRID_SIZE).keys()].map((col) => (
              <div
                key={col}
                className={`cell ${snake.some((segment) => segment.x === col && segment.y === row) ? 'snake' : ''} ${food.x === col && food.y === row ? 'food' : ''}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))}
          </div>
        ))}
      </div>
      {isGameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default App;
