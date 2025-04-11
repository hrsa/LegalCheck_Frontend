import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from '../Badge';
import Button from '../Button';
import { Checklist } from '../../types/checklist.types';
import RuleItem from '../policy/RuleItem';
import { Ionicons } from '@expo/vector-icons';

interface ChecklistItemProps {
  item: Checklist;
  onEdit: (checklist: Checklist) => void;
}

export default function ChecklistItem({ item, onEdit }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row justify-between items-start">
        <TouchableOpacity 
          className="flex-1 flex-row items-center"
          onPress={toggleExpanded}
        >
          <View className="flex-1">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-gray-600 text-sm mt-1">
              Created: {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Badge
            text={item.type}
            variant={item.type === 'user' ? 'blue' : 'purple'}
            className="mr-2"
          />
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>

        <Button
          title="Edit"
          variant="transparent"
          onPress={() => onEdit(item)}
          className="ml-2"
        />
      </View>

      {expanded && (
        <View className="mt-4">
          <Text className="font-bold mb-2">Rules ({item.rules.length}):</Text>
          <View className="flex-col">
            {item.rules.map((rule) => (
              <RuleItem 
                key={rule.id} 
                rule={rule} 
                onEdit={() => {}}
                editable={false}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
