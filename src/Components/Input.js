import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { memo, useCallback } from 'react'

export default Input = memo(params => {
  const {
    label,
    placeholder,
    value,
    handleChange,
    style,
    multiline,
    keyboardType,
  } = params
 
  return (
    <View key={`Input_${label}`} style={[styles.component, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 5 : undefined}
        style={[
          styles.textInput,
          multiline ? { textAlignVertical: 'top' } : {},
        ]}
        placeholder={placeholder || ''}
        value={value}
        onChangeText={handleChange}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  component: {
    //borderWidth: 1,
    marginHorizontal: 10,
    padding: 10,
    paddingVertical: 5,
    flexDirection: 'column',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
})
