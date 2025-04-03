import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TextAndDrop = ({ text, Icon }) => {
 return (
  <TouchableOpacity style={styles.container}>
   <Text style={styles.text}>{text}</Text>
   {Icon}
  </TouchableOpacity>
 );
};

const styles = StyleSheet.create({
 container: {
  flexDirection: 'row',
  alignItems: 'center',

  borderRadius: 7,
  borderColor: '#E7E7E7',
  borderWidth: 1,
  padding: 5,
  backgroundColor: 'white',
  gap: 5
 },
 text: {
  fontSize: 12,
  color: '#000',
 },
 icon: {
  marginLeft: 10,
 },
});

export default TextAndDrop;
