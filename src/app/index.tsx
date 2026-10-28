import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';

type Course = 'Starter' | 'Main Course' | 'Dessert';
type CourseFilter = 'All' | Course;
type Screen = 'home' | 'form';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  cost: string;
  price: string;
  course: Course;
};

const COURSES: Course[] = ['Starter', 'Main Course', 'Dessert'];

const INITIAL_FORM = {
  name: '',
  description: '',
  cost: '',
  price: '',
  course: 'Main Course' as Course,
};

const formatRand = (amount: number) =>
  `R${amount.toFixed(2)}`;

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] =
    useState<CourseFilter>('All');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState(INITIAL_FORM.name);
  const [description, setDescription] = useState(
    INITIAL_FORM.description
  );
  const [cost, setCost] = useState(INITIAL_FORM.cost);
  const [price, setPrice] = useState(INITIAL_FORM.price);
  const [course, setCourse] = useState<Course>(
    INITIAL_FORM.course
  );

  // Statistics always use the complete menu, not filtered results.
  const statistics = useMemo(() => {
    const total = menuItems.length;

    const totalPrice = menuItems.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );

    const courseCounts: Record<Course, number> = {
      Starter: 0,
      'Main Course': 0,
      Dessert: 0,
    };

    menuItems.forEach((item) => {
      courseCounts[item.course] += 1;
    });

    return {
      total,
      averagePrice: total > 0 ? totalPrice / total : 0,
      courseCounts,
    };
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesName =
        item.name.toLowerCase().includes(query);

      const matchesCourse =
        courseFilter === 'All' ||
        item.course === courseFilter;

      return matchesName && matchesCourse;
    });
  }, [menuItems, searchText, courseFilter]);

  function resetForm() {
    setName('');
    setDescription('');
    setCost('');
    setPrice('');
    setCourse('Main Course');
    setEditingId(null);
  }

  function openAddForm() {
    resetForm();
    setScreen('form');
  }

  function openEditForm(item: MenuItem) {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setCost(item.cost);
    setPrice(item.price);
    setCourse(item.course);
    setScreen('form');
  }

  function cancelForm() {
    resetForm();
    setScreen('home');
  }

  function saveDish() {
    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const cleanCost = cost.trim();
    const cleanPrice = price.trim();

    if (
      !cleanName ||
      !cleanDescription ||
      !cleanCost ||
      !cleanPrice
    ) {
      Alert.alert(
        'Missing information',
        'Please complete all required fields.'
      );
      return;
    }

    const parsedCost = Number(cleanCost);
    const parsedPrice = Number(cleanPrice);

    if (
      !Number.isFinite(parsedCost) ||
      parsedCost <= 0
    ) {
      Alert.alert(
        'Invalid cost',
        'Enter a cost greater than zero.'
      );
      return;
    }

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0
    ) {
      Alert.alert(
        'Invalid price',
        'Enter a selling price greater than zero.'
      );
      return;
    }

    const savedItem: MenuItem = {
      id: editingId ?? `${Date.now()}-${Math.random()}`,
      name: cleanName,
      description: cleanDescription,
      cost: parsedCost.toFixed(2),
      price: parsedPrice.toFixed(2),
      course,
    };

    if (editingId) {
      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingId ? savedItem : item
        )
      );
    } else {
      setMenuItems((currentItems) => [
        ...currentItems,
        savedItem,
      ]);
    }

    resetForm();
    setScreen('home');

    Alert.alert(
      'Success',
      editingId
        ? 'Menu item updated successfully.'
        : 'Menu item added successfully.'
    );
  }

  function confirmDelete(item: MenuItem) {
    Alert.alert(
      'Delete menu item?',
      `Are you sure you want to remove "${item.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((currentItems) =>
              currentItems.filter(
                (currentItem) => currentItem.id !== item.id
              )
            );

            Alert.alert(
              'Deleted',
              'The menu item has been removed.'
            );
          },
        },
      ]
    );
  }

  function clearFilters() {
    setSearchText('');
    setCourseFilter('All');
  }

  if (screen === 'form') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={cancelForm}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Back to Menu
            </Text>
          </TouchableOpacity>

          <Text style={styles.eyebrow}>
            CHEF'S MENU MANAGER
          </Text>

          <Text style={styles.title}>
            {editingId ? 'Edit Dish' : 'Add New Dish'}
          </Text>

          <Text style={styles.subtitle}>
            {editingId
              ? 'Update the details of your menu item.'
              : 'Add a delicious dish to your restaurant menu.'}
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grilled Salmon"
              placeholderTextColor="#9A8A7D"
              value={name}
              onChangeText={setName}
              maxLength={80}
              accessibilityLabel="Dish name"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Describe the dish and its ingredients"
              placeholderTextColor="#9A8A7D"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={300}
              accessibilityLabel="Dish description"
            />

            <Text style={styles.label}>Course *</Text>
            <View style={styles.courseRow}>
              {COURSES.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.courseButton,
                    course === option &&
                      styles.courseButtonActive,
                  ]}
                  onPress={() => setCourse(option)}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: course === option,
                  }}
                >
                  <Text
                    style={[
                      styles.courseButtonText,
                      course === option &&
                        styles.courseButtonTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Cost (R) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9A8A7D"
              value={cost}
              onChangeText={setCost}
              keyboardType="decimal-pad"
              maxLength={12}
              accessibilityLabel="Dish cost in rand"
            />

            <Text style={styles.label}>Selling Price (R) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9A8A7D"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              maxLength={12}
              accessibilityLabel="Dish selling price in rand"
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={saveDish}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>
                {editingId ? 'Save Changes' : 'Add Menu Item'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelForm}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.homeContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            RESTAURANT MANAGEMENT
          </Text>

          <Text style={styles.title}>
            Chef's Menu Manager
          </Text>

          <Text style={styles.subtitle}>
            Your menu, organised in one place.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={openAddForm}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            + Add New Dish
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
          Menu Overview
        </Text>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            TOTAL MENU ITEMS
          </Text>
          <Text style={styles.statValue}>
            {statistics.total}
          </Text>
          <Text style={styles.statHint}>
            All dishes in your menu
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            AVERAGE SELLING PRICE
          </Text>
          <Text style={styles.statValue}>
            {formatRand(statistics.averagePrice)}
          </Text>
          <Text style={styles.statHint}>
            Across all menu items
          </Text>
        </View>

        <View style={styles.courseStatsCard}>
          <Text style={styles.courseStatsTitle}>
            Items by Course
          </Text>

          {COURSES.map((itemCourse) => (
            <View
              key={itemCourse}
              style={styles.courseStatRow}
            >
              <Text style={styles.courseStatName}>
                {itemCourse}
              </Text>
              <Text style={styles.courseStatCount}>
                {statistics.courseCounts[itemCourse]}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          Current Menu
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes by name..."
          placeholderTextColor="#9A8A7D"
          value={searchText}
          onChangeText={setSearchText}
          accessibilityLabel="Search menu by dish name"
        />

        <Text style={styles.filterLabel}>
          FILTER BY COURSE
        </Text>

        <View style={styles.filterRow}>
          {(['All', ...COURSES] as CourseFilter[]).map(
            (option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterButton,
                  courseFilter === option &&
                    styles.filterButtonActive,
                ]}
                onPress={() => setCourseFilter(option)}
                accessibilityRole="button"
                accessibilityState={{
                  selected: courseFilter === option,
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    courseFilter === option &&
                      styles.filterTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {(searchText.length > 0 ||
          courseFilter !== 'All') && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearText}>
              Clear search and filters
            </Text>
          </TouchableOpacity>
        )}

        {filteredItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              {menuItems.length === 0
                ? 'Your menu is empty'
                : 'No matching dishes'}
            </Text>

            <Text style={styles.emptyText}>
              {menuItems.length === 0
                ? 'Add your first dish to start building your restaurant menu.'
                : 'Try another search or course filter.'}
            </Text>

            {menuItems.length === 0 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={openAddForm}
              >
                <Text style={styles.secondaryButtonText}>
                  Add Your First Dish
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredItems.map((item) => (
            <View style={styles.dishCard} key={item.id}>
              <View style={styles.dishTop}>
                <View style={styles.dishHeading}>
                  <Text style={styles.dishName}>
                    {item.name}
                  </Text>

                  <Text style={styles.courseBadge}>
                    {item.course}
                  </Text>
                </View>

                <Text style={styles.price}>
                  {formatRand(Number(item.price))}
                </Text>
              </View>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <View style={styles.priceDetails}>
                <Text style={styles.cost}>
                  Cost: {formatRand(Number(item.cost))}
                </Text>
                <Text style={styles.cost}>
                  Profit: {formatRand(
                    Number(item.price) - Number(item.cost)
                  )}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditForm(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => confirmDelete(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                >
                  <Text style={styles.removeText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          Chef's Menu Manager · Menu administration
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7EEDC',
  },
  container: {
    flex: 1,
  },
  homeContent: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 36,
  },
  formContent: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 22,
  },
  eyebrow: {
    color: '#9A6A45',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 9,
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#542B16',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#795E4B',
    marginTop: 8,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#6B3515',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#4B2E1F',
    marginBottom: 14,
    marginTop: 5,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  statLabel: {
    color: '#8A6A55',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#6B3515',
    marginTop: 7,
  },
  statHint: {
    fontSize: 13,
    color: '#8A7A6D',
    marginTop: 4,
  },
  courseStatsCard: {
    backgroundColor: '#EFE1D0',
    borderRadius: 14,
    padding: 18,
    marginBottom: 26,
  },
  courseStatsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#542B16',
    marginBottom: 12,
  },
  courseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DCC7B2',
  },
  courseStatName: {
    color: '#65452F',
    fontSize: 14,
  },
  courseStatCount: {
    color: '#6B3515',
    fontSize: 16,
    fontWeight: '800',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDC9B6',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#3E2723',
    marginBottom: 17,
  },
  filterLabel: {
    color: '#8A6A55',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6C2B2',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },
  filterButtonActive: {
    backgroundColor: '#6B3515',
    borderColor: '#6B3515',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B3515',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 10,
  },
  clearText: {
    color: '#8B3A2B',
    fontWeight: '700',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6B3515',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#795548',
    lineHeight: 21,
  },
  secondaryButton: {
    backgroundColor: '#EFE2D5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9,
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#6B3515',
    fontWeight: '800',
  },
  dishCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  dishTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  dishHeading: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3E2723',
  },
  courseBadge: {
    color: '#79502E',
    backgroundColor: '#F4E8DA',
    fontSize: 11,
    fontWeight: '700',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 8,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#6B3515',
  },
  description: {
    color: '#75645A',
    marginTop: 12,
    marginBottom: 12,
    lineHeight: 21,
    fontSize: 14,
  },
  priceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  cost: {
    color: '#795548',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    borderTopWidth: 1,
    borderTopColor: '#F0E7DF',
    paddingTop: 12,
  },
  editButton: {
    backgroundColor: '#EFE2D5',
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 8,
  },
  editText: {
    color: '#6B3515',
    fontWeight: '800',
  },
  removeButton: {
    backgroundColor: '#F9E8E5',
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 8,
  },
  removeText: {
    color: '#9D3026',
    fontWeight: '800',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 24,
  },
  backText: {
    color: '#6B3515',
    fontWeight: '800',
    fontSize: 15,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B2E1F',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFCF8',
    borderWidth: 1,
    borderColor: '#DDC9B6',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 15,
    color: '#3E2723',
    marginBottom: 8,
  },
  descriptionInput: {
    height: 105,
    textAlignVertical: 'top',
  },
  courseRow: {
    gap: 8,
    marginBottom: 8,
  },
  courseButton: {
    backgroundColor: '#FFFCF8',
    borderWidth: 1,
    borderColor: '#D6C2B2',
    borderRadius: 9,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  courseButtonActive: {
    backgroundColor: '#6B3515',
    borderColor: '#6B3515',
  },
  courseButtonText: {
    color: '#6B3515',
    fontWeight: '700',
  },
  courseButtonTextActive: {
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#795548',
    fontWeight: '700',
  },
  footer: {
    color: '#9A8574',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 15,
    marginBottom: 10,
  },
});