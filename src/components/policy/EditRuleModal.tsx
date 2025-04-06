import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import TextInput from '../TextInput';
import Badge from '../Badge';
import Button from '../Button';
import {Rule, RuleType, ruleTypes, severities, Severity} from '../../types/policy.types';

interface EditRuleModalProps {
  visible: boolean;
  rule: Rule | null;
  onClose: () => void;
  onSave: (policyId: number, ruleId: number, data: Partial<Rule>) => Promise<void>;
  updating: boolean;
}

export default function EditRuleModal({
  visible,
  rule,
  onClose,
  onSave,
  updating
}: EditRuleModalProps) {
  const [description, setDescription] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('requirement');
  const [severity, setSeverity] = useState<Severity>('high');
  const [keywordsText, setKeywordsText] = useState('');

  useEffect(() => {
    if (rule) {
      setDescription(rule.description);
      setRuleType(rule.rule_type);
      setSeverity(rule.severity);
      setKeywordsText(rule.keywords ? rule.keywords.join(', ') : '');
    }
  }, [rule]);

  const handleSave = async () => {
    if (!rule) return;

    try {
      const keywordsArray = keywordsText
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      await onSave(rule.policy_id, rule.id, {
        description,
        rule_type: ruleType,
        severity,
        keywords: keywordsArray
      });
    } catch (err) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-75">
        <View className="bg-white p-5 rounded-lg w-4/5 max-h-4/5">
          <ScrollView>
            <Text className="text-xl font-bold mb-4">{rule && rule.id === 0 ? 'Add Rule' : 'Edit Rule'}</Text>

            <Text className="font-semibold mb-1 mt-2">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              className="h-auto p-2 mx-1 my-2"
              textAlignVertical="top"
            />

            <Text className="font-semibold mb-1 mt-2">Rule Type</Text>
            <View className="flex-row flex-wrap mb-3 mx-1">
              {ruleTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setRuleType(type)}
                  className="mr-2 mb-2"
                >
                  <Badge
                    text={type}
                    variant={ruleType === type ? 'blue' : 'gray'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="font-medium mb-1">Severity</Text>
            <View className="flex-row flex-wrap mb-3 mx-1">
              {severities.map((sev) => (
                <TouchableOpacity
                  key={sev}
                  onPress={() => setSeverity(sev)}
                  className="mr-2 mb-2"
                >
                  <Badge
                    text={sev}
                    variant={
                      severity === sev
                        ? sev === 'high'
                          ? 'red'
                          : sev === 'medium'
                          ? 'orange'
                          : 'yellow'
                        : 'gray'
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="font-semibold mb-1 mt-2">Keywords (comma-separated)</Text>
            <TextInput
              value={keywordsText}
              onChangeText={setKeywordsText}
              className="h-auto p-2 mx-1 my-2"
              placeholder="keyword1, keyword2, keyword3"
            />

            <View className="flex-row justify-center mt-2">
              <Button
                title="Cancel"
                onPress={onClose}
                className="bg-gray-400 mr-2"
              />
              <Button
                title="Save"
                onPress={handleSave}
                disabled={updating}
                className={`${updating ? 'bg-blue-300' : 'bg-blue-500'}`}
                loading={updating}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
