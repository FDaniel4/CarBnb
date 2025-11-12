import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SoporteReal = () => {
  const handleCall = () => {
    Linking.openURL('tel:4499465030');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:carbnb@support.com');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soporte</Text>

      <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
        <Svg width={100} height={100} viewBox="0 0 24 24" stroke="orange" strokeWidth={1.5} fill="none">
          <Path
            d="M5 4h4l2 5-3.5 3.5a11 11 0 0 0 5 5l3.5-3.5 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M5 4h4l2 5-3.5 3.5a11 11 0 0 0 5 5l3.5-3.5 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.label}>Speak with support staff</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={handleEmail}>
        <Svg width={100} height={100} viewBox="0 0 24 24" stroke="orange" strokeWidth={1.5} fill="none">
          <Path
            d="M4 4h16v16H4V4z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4 4l8 8 8-8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.label}>Send an email to support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffffff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#070707ff' },
  iconButton: { alignItems: 'center', marginVertical: 60 },
  label: { marginTop: 12, fontSize: 18, fontWeight: '600', color: '#000000ff' },
});

export default SoporteReal;