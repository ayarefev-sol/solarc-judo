import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { getSessions, createSession } from '../api/sessions';

export default function SessionsListScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (e) {
      console.log('LOAD ERROR', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const newSession = await createSession();
      navigation.navigate('SessionDetail', { session: newSession });
    } catch (e) {
      console.log('CREATE ERROR', e.message);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Button title="Start Session" onPress={handleCreate} />

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SessionDetail', { session: item })
            }
          >
            <Text style={{ padding: 10 }}>
              Session {item.id} — {item.date}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}