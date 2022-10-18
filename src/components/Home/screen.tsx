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
  Platform,
} from 'react-native';
import {Item} from './model';
import {Container} from 'typedi';
import {WebSQLDatabase} from 'expo-sqlite/src/SQLite.types';
import {DI_DB_KEY} from '../../utils/database';
import {GrayScaleColors, PaletteColors} from '../../styles/colors';
import StyledButton from '../common/styled-button';
import ItemController from './controller';

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
    paddingHorizontal: 16,
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

  const fetchItems = async () => {
    const set = await ItemController.fetchItems();
    setItems(set);
  };

  const createItem = async () => {
    try {
      await ItemController.createItem(input);
      setInput('');
      setSelectedItem(undefined);
      fetchItems();
    } catch (e) {
      console.log(e);
    }
  };

  const updateItem = async () => {
    try {
      await ItemController.updateItem(selcetedItem.id, input);
      setInput('');
      setSelectedItem(undefined);
      fetchItems();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await ItemController.deleteItem(id);
      setInput('');
      setSelectedItem(undefined);
      fetchItems();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: GrayScaleColors.BACKGROUND,
      }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
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
            <StyledButton
              onPress={() => input !== '' && createItem()}
              title={'Add'}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
