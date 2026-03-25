import React from 'react';
import { View, Text } from 'react-native';

export default function SessionDetailScreen({ route }) {
  const { session } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text>Session ID: {session.id}</Text>
      <Text>Date: {session.date}</Text>
    </View>
  );
}