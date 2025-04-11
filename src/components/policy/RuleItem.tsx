import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from '../Badge';
import Button from '../Button';
import { Rule } from '../../types/policy.types';
import {BadgeVariant} from "../../types/components/Badge.types";

interface RuleItemProps {
  rule: Rule;
  onEdit: (rule: Rule) => void;
  editable?: boolean;
  colorType?: string;
}

export default function RuleItem({ rule, onEdit, editable = true, colorType = 'gray' }: RuleItemProps) {
  const getSeverityColor = (severity: string): BadgeVariant => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getRuleTypeColor = (ruleType: string): BadgeVariant => {
    switch (ruleType.toLowerCase()) {
      case 'compliance':
        return 'blue';
      case 'security':
        return 'purple';
      case 'privacy':
        return 'teal';
      default:
        return 'gray';
    }
  };

  const getColorType = (colorType: string): string => {
    switch (colorType.toLowerCase()) {
      case 'blue':
        return 'bg-blue-100 border-blue-500';
      case 'green':
        return 'bg-green-100 border-green-500';
      case 'red':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  return (
    <View className={`p-3 rounded-md mb-2 border ${getColorType(colorType)}`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-gray-800 font-semibold mb-4">{rule.description}</Text>

          {rule.keywords && rule.keywords.length > 0 && (
            <View className="mb-2">
              <Text className="text-xs text-gray-500 mb-1">Keywords:</Text>
              <View className="flex-row flex-wrap">
                {rule.keywords.map((keyword, index) => (
                  <Text 
                    key={index} 
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mr-1 mb-1"
                  >
                    {keyword}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {editable && (
          <Button
            title="Edit"
            onPress={() => onEdit(rule)}
            className="ml-2"
          />
        )}
      </View>

      <View className="flex-row mt-1">
        <Badge 
          text={rule.rule_type}
          variant={getRuleTypeColor(rule.rule_type)}
        />
        <Badge 
          text={rule.severity}
          variant={getSeverityColor(rule.severity)}
          className="ml-2"
        />
      </View>
    </View>
  );
}
