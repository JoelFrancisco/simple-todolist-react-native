import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { Checkbox, FAB, IconButton } from 'react-native-paper';
import { Todo } from './Todo';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

interface TodoItemProps {
    todo: Todo;
    onToggleDone: (id: string) => void;
    onDelete: (id: string) => void;
}

function TodoItem({ todo, onToggleDone, onDelete }: TodoItemProps) {
    return (
        <View style={styles.todoItem}>
            <Checkbox
                status={todo.isDone() ? 'checked' : 'unchecked'}
                onPress={() => onToggleDone(todo.getTodoId())}
            />
            <Text style={todo.isDone() ? styles.todoTextDone : styles.todoText}>{todo.getDescription()}</Text>
            <IconButton icon="delete" onPress={() => onDelete(todo.getTodoId())} />
        </View>
    )
}

function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const navigation = useNavigation();

    const fetchTodos = async () => {
        const todos = await Todo.findAll();
        setTodos(todos);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTodos();
        }, [])
    );

    const handleToggleDone = async (id: string) => {
        const todo = await Todo.findById(id);
        if (todo) {
            todo.toggle()
            await todo.save();
            setTodos(await Todo.findAll());
        }
    };

    const handleDelete = async (id: string) => {
        const todo = await Todo.findById(id);
        if (todo) {
            await todo.delete();
            setTodos(await Todo.findAll());
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={todos}
                keyExtractor={(item) => item.getTodoId().toString()}
                renderItem={({ item }) => (
                    <TodoItem todo={item} onToggleDone={handleToggleDone} onDelete={handleDelete} />
                )}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('AddTodo')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    todoText: {
        fontSize: 16,
        flex: 1,
    },
    todoTextDone: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        flex: 1,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default TodoList;
