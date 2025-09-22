import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa type cho 1 task
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// Định nghĩa state
interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "stasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload || [];
    },
    addTask(state, action: PayloadAction<string>) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: action.payload,
        completed: false,
      };
      state.tasks.unshift(newTask);
    },
    toggleTask(state, action: PayloadAction<string>) {
      const t = state.tasks.find((x) => x.id === action.payload);
      if (t) t.completed = !t.completed;
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((x) => x.id !== action.payload);
    },
    clearTasks(state) {
      state.tasks = [];
    },
  },
});

export const { setTasks, addTask, toggleTask, removeTask, clearTasks } =
  taskSlice.actions;
export default taskSlice.reducer;
