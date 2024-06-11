import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Todo } from './Todo';
import { useNavigation } from '@react-navigation/native';

const AddTodo: React.FC = () => {
    const [description, setDescription] = useState<string>('');
    const navigation = useNavigation();

    const handleAddTodo = async () => {
        if (description.trim() === '') return;

        const newTodo = new Todo(Date.now(), description, false);
        await newTodo.save();
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleAddTodo}>
                Add Todo
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    input: {
        marginBottom: 20,
    },
});

export default AddTodo;
