import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

export default function Input(props: TextInputProps) {
  return <TextInput style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  }
});
