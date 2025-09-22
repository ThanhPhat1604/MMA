import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    tasks: []
};

const taskSlice = createSlice({
    name: "stasks",
    initialState,
    reducers: {
        setTasks(state, action){
            state.tasks = action.payload || [];
        },
        addTask(state, action){
            const title = action.payload;
            const newTask = {
                id: Date.now().toString(),
                title,
                complete: false
            };
            state.tasks.unshift(newTask);
        },
        ToggleTask(state, action){
            const id = action.payload;
            const t = state.tasks.find(x=>x.id === id);
            if (t) t.complete = !t.complete;
        },
        removeTask(state, action){
            const id = action.payload;
            const t = state.tasks.find(x => x.id !== id);
        },
        clearTasks(state){
            state.tasks = [];
        }
    }
});
export const {setTasks, addTask, ToggleTask, removeTask, clearTasks} = taskSlice.actions;
export default taskSlice.reducer;