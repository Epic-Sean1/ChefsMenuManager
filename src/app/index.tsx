import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

type Course = 'Starters' | 'Mains' | 'Dessert';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  cost: string;
  price: string;
  course: Course;
};

export default function App() {
  console.log('NEW CHEF`S MENU APP LOADED');
  
  const [screen, setScreen] = useState<'home' | 'add'>('home');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<Course>('Mains');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  function addDish() {
    if (
      name.trim() === '' ||
      description.trim() === '' ||
      cost.trim() === '' ||
      price.trim() === ''
    ) {
      Alert.alert(
        'Missing Information',
        'Please complete all required fields.'
      );
      return;
    }

    if (isNaN(Number(cost)) || Number(cost) <= 0) {
      Alert.alert(
        'Invalid Cost',
        'Please enter a valid cost.'
      );
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert(
        'Invalid Price',
        'Please enter a valid price.'
      );
      return;
    }

    const newDish: MenuItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      cost: Number(cost).toFixed(2),
      price: Number(price).toFixed(2),
      course: course,
    };

    setMenuItems([...menuItems, newDish]);

    setName('');
    setDescription('');
    setCost('');
    setPrice('');
    setCourse('Mains');

    Alert.alert(
      'Success',
      'Menu item added successfully!',
      [
        {
          text: 'OK',
          onPress: function () {
            setScreen('home');
          },
        },
      ]
    );
  }

  function removeDish(id: string) {
    setMenuItems(
      menuItems.filter(function (item) {
        return item.id !== id;
      })
    );
  }

  if (screen === 'add') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={function () {
            setScreen('home');
          }}
        >
          <Text style={styles.back}>← Back to Menu</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Add New Dish</Text>

        <Text style={styles.label}>Dish Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter dish name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter dish description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />

        <Text style={styles.label}>Course</Text>

        <View style={styles.courseRow}>
          <TouchableOpacity
            style={
              course === 'Starters'
                ? styles.selectedCourse
                : styles.courseButton
            }
            onPress={function () {
              setCourse('Starters');
            }}
          >
            <Text
              style={
                course === 'Starters'
                  ? styles.selectedCourseText
                  : styles.courseText
              }
            >
              Starters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              course === 'Mains'
                ? styles.selectedCourse
                : styles.courseButton
            }
            onPress={function () {
              setCourse('Mains');
            }}
          >
            <Text
              style={
                course === 'Mains'
                  ? styles.selectedCourseText
                  : styles.courseText
              }
            >
              Mains
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              course === 'Dessert'
                ? styles.selectedCourse
                : styles.courseButton
            }
            onPress={function () {
              setCourse('Dessert');
            }}
          >
            <Text
              style={
                course === 'Dessert'
                  ? styles.selectedCourseText
                  : styles.courseText
              }
            >
              Dessert
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Cost (R) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter cost"
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Price (R) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter selling price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={addDish}
        >
          <Text style={styles.saveText}>Add Menu Item</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chef's Menu Manager</Text>

        <Text style={styles.subtitle}>
          Manage your restaurant menu
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={function () {
          setScreen('add');
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Dish</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Current Menu</Text>

      {menuItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No Menu Items Yet</Text>

          <Text style={styles.emptyText}>
            Add your first dish to start building the menu.
          </Text>
        </View>
      ) : (
        menuItems.map(function (item) {
          return (
            <View style={styles.dishCard} key={item.id}>
              <View style={styles.dishTop}>
                <Text style={styles.dishName}>
                  {item.name}
                </Text>

                <Text style={styles.price}>
                  R{item.price}
                </Text>
              </View>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <Text style={styles.cost}>
                Cost: R{item.cost}
              </Text>

              <View style={styles.dishBottom}>
                <Text style={styles.course}>
                  {item.course}
                </Text>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={function () {
                    removeDish(item.id);
                  }}
                >
                  <Text style={styles.removeText}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EEDC',
    padding: 20,
  },

  header: {
    marginTop: 45,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B3515',
  },

  subtitle: {
    fontSize: 15,
    color: '#795548',
    marginTop: 6,
  },

  addButton: {
    backgroundColor: '#6B3515',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 28,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#4B2E1F',
    marginBottom: 15,
  },

  emptyBox: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B3515',
    marginBottom: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#795548',
    lineHeight: 20,
  },

  back: {
    marginTop: 35,
    marginBottom: 20,
    color: '#6B3515',
    fontWeight: 'bold',
    fontSize: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4B2E1F',
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6C2B2',
    borderRadius: 9,
    padding: 13,
    fontSize: 15,
    marginBottom: 12,
  },

  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6C2B2',
    borderRadius: 9,
    padding: 13,
    fontSize: 15,
    height: 100,
    marginBottom: 12,
    textAlignVertical: 'top',
  },

  courseRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  courseButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8AE9A',
    padding: 11,
    borderRadius: 8,
    marginRight: 8,
  },

  selectedCourse: {
    backgroundColor: '#6B3515',
    padding: 11,
    borderRadius: 8,
    marginRight: 8,
  },

  courseText: {
    color: '#6B3515',
    fontWeight: 'bold',
  },

  selectedCourseText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#6B3515',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  dishCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  dishTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dishName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3E2723',
    flex: 1,
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B3515',
  },

  description: {
    color: '#75645A',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },

  cost: {
    color: '#795548',
    fontSize: 13,
    marginBottom: 12,
  },

  dishBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  course: {
    color: '#6B3515',
    fontWeight: 'bold',
  },

  removeButton: {
    backgroundColor: '#EFE2D5',
    padding: 8,
    borderRadius: 7,
  },

  removeText: {
    color: '#8B3A2B',
    fontWeight: 'bold',
  },
});