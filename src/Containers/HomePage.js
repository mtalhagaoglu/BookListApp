import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native'
import { Book } from '@/Components'
import { useLibrary } from '@/Hooks'
import EmptyListSVG from '@/Assets/Images/EmptyList.svg'
import { navigate } from '@/Navigators/utils'

const EmptyList = () => {
  return (
    <TouchableOpacity
      style={styles.emptyListContainer}
      onPress={() => navigate('BookForm')}
    >
      <EmptyListSVG fill="black" width={200} height={200} />
      <Text style={styles.emptyListTitle}>Kayıtlı Kitap Bulunamadı!</Text>
      <Text style={styles.emptyListDesc}>
        Buraya tıklayarak kitap eklemeye başla!
      </Text>
    </TouchableOpacity>
  )
}

const HomePage = () => {
  const { books } = useLibrary()

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.page]}>
      <FlatList
        data={books}
        renderItem={({ item }) => <Book {...item} />}
        keyExtractor={(item, index) => `book_${index}`}
        ListEmptyComponent={<EmptyList />}
        initialNumToRender={10}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyListTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginTop: 20,
  },
  emptyListDesc: {
    textAlign: 'center',
    marginTop: 10,
  },
})

export default HomePage
