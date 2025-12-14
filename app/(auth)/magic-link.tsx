import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MagicLink() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function sendLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'dolcevita://auth' },
    });
    if (error) Alert.alert('Error', error.message);
    else setSent(true);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      {!sent ? (
        <>
          <Text style={{ fontSize: 22, fontWeight: '700', textAlign: 'center' }}>
            Sign in with Magic Link
          </Text>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              borderColor: '#555',
            }}
          />
          <Button title="Send Magic Link" onPress={sendLink} />
        </>
      ) : (
        <Text style={{ textAlign: 'center' }}>
          A link was sent to {email}. Check your inbox and open Dolce Vita.
        </Text>
      )}
    </View>
  );
}
