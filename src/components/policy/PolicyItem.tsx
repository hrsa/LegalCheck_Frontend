import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from '../Badge';
import Button from '../Button';
import { Policy } from '../../stores/policyStore';

interface PolicyItemProps {
  item: Policy;
  onEdit: (policy: Policy) => void;
}

export default function PolicyItem({ item, onEdit }: PolicyItemProps) {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-gray-600 mt-1">{item.description}</Text>
        </View>
        <Button
            title="Edit"
          onPress={() => onEdit(item)}
        />
      </View>
      <View className="flex-row mt-3">
        <Badge 
          text={item.policy_type}
          variant={item.policy_type === 'standard' ? 'amber' : 'blue'}
        />
        <Badge 
          text={item.is_active ? 'Active' : 'Inactive'}
          variant={item.is_active ? 'green' : 'red'}
          className="ml-2"
        />
      </View>
    </View>
  );
}