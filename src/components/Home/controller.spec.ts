import {createDatabase, DI_DB_KEY} from '../../utils/database';
import {Container} from 'typedi';
import {WebSQLDatabase} from 'expo-sqlite/src/SQLite.types';
import ItemController from './controller';

describe('Items', () => {
  beforeAll(() => {
    createDatabase('TestDatabase');
  });

  afterAll(async () => {
    const db = Container.get<WebSQLDatabase>(DI_DB_KEY);
    await db.closeAsync();
    await db.deleteAsync();
  });

  describe('Create', () => {
    test('it should create an Item', async () => {
      try {
        await ItemController.createItem('This is a test');
        const items = await ItemController.fetchItems();
        expect(items.length).toBe(1);
        expect(items[0].description).toBe('This is a test');
      } catch (err) {
        console.log(err);
        expect(err).toBeUndefined();
      }
    });

    test('it should create a second Item with empty description', async () => {
      try {
        await ItemController.createItem('t');
        const items = await ItemController.fetchItems();
        expect(items.length).toBe(2);
        expect(items[1].description).toBe('');
      } catch (err) {
        console.log(err);
        expect(err).toBeUndefined();
      }
    });

    test('it should not duplicate an Item', async () => {
      try {
        await ItemController.createItem('This is a test');
      } catch (err) {
        console.log(err);
        expect(err).toBeDefined();
      }
    });
  });

  describe('Update', () => {
    test('it should update an Item', async () => {
      try {
        await ItemController.updateItem(1, 'This is a updated');
        const items = await ItemController.fetchItems();
        expect(items[0].description).toBe('This is a updated');
      } catch (err) {
        console.log(err);
        expect(err).toBeUndefined();
      }
    });

    test('it should not update an Item', async () => {
      try {
        await ItemController.updateItem(2, 'This is a updated');
      } catch (err) {
        console.log(err);
        expect(err).toBeDefined();
      }
    });

    test('it should not update the second Item', async () => {
      try {
        await ItemController.updateItem(2, 'This is the second item');
      } catch (err) {
        console.log(err);
        expect(err).toBeDefined();
      }
    });
  });

  describe('Delete', () => {
    /**
     * it should delete an Item
     */
    test('it should delete an Item', async () => {
      try {
        await ItemController.deleteItem(1);
        const items = await ItemController.fetchItems();
        expect(items[0].description).not.toBe(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeUndefined();
      }
    });
  });
});
