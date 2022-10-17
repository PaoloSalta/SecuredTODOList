import React, {FC, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  StatusBar,
} from 'react-native';
import {Item} from './model';
import {Container} from 'typedi';
import {WebSQLDatabase} from 'expo-sqlite/src/SQLite.types';
import {DI_DB_KEY} from '../../utils/database';
import {GrayScaleColors, PaletteColors} from '../../styles/colors';
import StyledButton from '../common/styled-button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    color: PaletteColors.PRIMARY,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInputContainer: {
    flexDirection: 'row',
    backgroundColor: GrayScaleColors.WHITE,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GrayScaleColors.WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 8,
  },
});

const HomeScreen: FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selcetedItem, setSelectedItem] = useState<Item>();
  const [input, setInput] = useState('');
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    const db = Container.get<WebSQLDatabase>(DI_DB_KEY);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM items;',
        [],
        (_, resultSet) => {
          console.log(resultSet);
          setItems(
            resultSet.rows._array.map(i => ({
              id: i.id,
              description: i.description,
              completed: i.completed === 1,
            })),
          );
        },
        (transact, err) => {
          console.log('Error during item extraction', err);
          return false;
        },
      );
    });
  };

  const createItem = () => {
    const query = `INSERT INTO items (description) VALUES ('${input}');`;
    executeDBCommand(query);
  };

  const updateItem = async () => {
    const query = `UPDATE items SET description = '${input}' WHERE id = ${selcetedItem.id};`;
    executeDBCommand(query);
  };

  const deleteItem = async (id: number) => {
    const query = `DELETE FROM items WHERE id = ${id};`;
    executeDBCommand(query);
  };

  const executeDBCommand = (command: string) => {
    const db = Container.get<WebSQLDatabase>(DI_DB_KEY);
    console.log(`Executing: ${command}`);
    db.transaction(async trx => {
      trx.executeSql(
        command,
        [],
        (transact, resultset) => {
          console.log('command executed');
          setInput('');
          setSelectedItem(undefined);
          fetchItems();
        },
        (transact, err) => {
          console.log('Error during command execution', err);
          return false;
        },
      );
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: GrayScaleColors.BACKGROUND,
      }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.title}>TODO:</Text>
        <FlatList
          style={{flex: 1}}
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={info => (
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(info.item);
                setInput(info.item.description);
              }}>
              <View style={styles.itemContainer}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: PaletteColors.PRIMARY,
                    borderRadius: 15,
                    marginRight: 8,
                  }}
                />
                <Text style={{fontSize: 18, flex: 1, marginRight: 8}}>
                  {info.item.description}
                </Text>
                <Button
                  title="DELETE"
                  color={PaletteColors.ALERT}
                  onPress={() => {
                    Alert.alert(
                      'Attention',
                      'Are you sure you want to delete this item?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                        },
                        {
                          text: 'Confirm',
                          onPress: () => deleteItem(info.item.id),
                          style: 'destructive',
                        },
                      ],
                    );
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={styles.textInputContainer}>
          <TextInput
            style={{flex: 1, fontSize: 18}}
            placeholder={'Enter here'}
            value={input}
            onChangeText={v => setInput(v)}
          />
          {selcetedItem ? (
            <StyledButton onPress={() => updateItem()} title={'Update'} />
          ) : (
            <StyledButton onPress={() => createItem()} title={'Add'} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
