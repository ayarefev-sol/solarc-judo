import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getSessions, createSession } from './api/sessions';
import { router } from 'expo-router';

export default function Home() {
  const [sessions, setSessions] = useState([]);

  const load = async () => {
    const data = await getSessions();
    setSessions(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const newSession = await createSession();
    router.push(`/session/${newSession.id}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Start Session" onPress={handleCreate} />

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/session/${item.id}`)}>
            <Text style={{ padding: 10 }}>
              Session {item.id}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 
