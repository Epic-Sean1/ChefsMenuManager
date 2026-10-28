import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Course = 'Starter' | 'Main Course' | 'Dessert';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  cost: string;
  price: string;
  course: Course;
};

type MenuItemCardProps = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
};

const formatRand = (amount: number) =>
  `R${amount.toFixed(2)}`;

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  const cost = Number(item.cost);
  const price = Number(item.price);

  return (
    <View style={styles.dishCard}>
      <View style={styles.dishTop}>
        <View style={styles.dishHeading}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.courseBadge}>{item.course}</Text>
        </View>

        <Text style={styles.price}>{formatRand(price)}</Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.priceDetails}>
        <Text style={styles.cost}>Cost: {formatRand(cost)}</Text>
        <Text style={styles.cost}>
          Profit: {formatRand(price - cost)}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item)}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onDelete(item)}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.name}`}
        >
          <Text style={styles.removeText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});