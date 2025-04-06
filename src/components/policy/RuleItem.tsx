import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from '../Badge';
import Button from '../Button';
import { Rule } from '../../types/policy.types';
import {BadgeVariant} from "../../types/components/Badge.types";

interface RuleItemProps {
  rule: Rule;
  onEdit: (rule: Rule) => void;
}

export default function RuleItem({ rule, onEdit }: RuleItemProps) {
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

  return (
    <View className="bg-gray-50 p-3 rounded-md mb-2 border border-gray-200">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2">{rule.description}</Text>
          
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
        
        <Button
          title="Edit"
          onPress={() => onEdit(rule)}
          className="ml-2"
        />
      </View>
      
      {/* Badges for rule type and severity */}
      <View className="flex-row mt-2">
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