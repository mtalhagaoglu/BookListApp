import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { editBook } from '@/Store/Library'
import { useLibrary } from '@/Hooks'

import {timeSince} from "@/Services/tools"

const info = [
  {
    title: 'Sayfa Sayısı',
    key: 'page',
  },
  {
    title: 'Okunan Sayfa',
    key: 'progress',
  },
  {
    title: 'Kategori',
    key: 'category',
  },
]

export default function BookDetails({ navigation, route }) {
  const { categories } = useLibrary()
  const [data, setData] = useState({})
  const [topContainerHeight, setTopContainerHeight] = useState(100)
  const [noteModal, setNoteModal] = useState(false)
  const [noteModalText, setNoteModalText] = useState('')
  const [noteModalId, setNoteModalId] = useState('')
  const dispatch = useDispatch()
  useEffect(() => {
    if (!route?.params?.data) {
      navigation.goBack()
      return
    }
    setData({
      ...route.params.data,
      category: categories[route.params.data.category_id - 1].name,
    })
    navigation.setOptions({
      title: '',
      headerStyle: {
        backgroundColor: '#e7b468',
      },
    })
  }, [])

  const handleNote = () => {
    if (noteModalId) {
      if (noteModalText === '') {
        setData(b => {
          b.notes = b.notes.filter(n => n.id !== noteModalId)
          dispatch(editBook({ book: b }))
          return b
        })
      } else {
        setData(b => {
          b.notes = b.notes.map(n => {
            if (n.id === noteModalId) {
              n.text = noteModalText
            }
            return n
          })
          dispatch(editBook({ book: b }))
          return b
        })
      }
    } else {
      setData(b => {
        b.notes = [
          ...b.notes,
          {
            text: noteModalText,
            id: `${Math.random().toString(16).slice(2)}`,
            date: new Date().getTime(),
          },
        ]
        dispatch(editBook({ book: b }))
        return b
      })
    }
    setNoteModalText('')
    setNoteModalId(0)
    setNoteModal(false)
  }

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.page]}>
      <ScrollView
        onScroll={event => {
          const y = event.nativeEvent.contentOffset.y
          if (y >= topContainerHeight - 150) {
            navigation.setOptions({ title: data.title })
          } else {
            navigation.setOptions({ title: '' })
          }
        }}
      >
        <View
          onLayout={event => {
            const { height } = event.nativeEvent.layout
            setTopContainerHeight(height)
          }}
          style={styles.topContainer}
        >
          <Image source={{ uri: data.cover_image }} style={styles.cover} />
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.author}>{data.author}</Text>
          <View style={styles.info}>
            {info.map(i => (
              <View key={`book_info_${i.key}`} style={styles.infoContainer}>
                <Text style={styles.infoTitle}>{i.title}</Text>
                <Text style={styles.infoValue}>{data[i.key]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BookForm', { data })}
              style={styles.leftButton}
            >
              <Text style={styles.buttonText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNoteModal(true)}
              style={styles.rightButton}
            >
              <Text style={styles.buttonText}>Not Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ne Hakkında?</Text>
            <Text style={styles.cardContent}>{data.about}</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notlarım</Text>
            {data.notes && data.notes.length ? (
              data.notes.map(n => {
                return (
                  <Text
                    onPress={() => {
                      setNoteModal(true)
                      setNoteModalText(n.text)
                      setNoteModalId(n.id)
                    }}
                    key={`notes_${n.id}`}
                    style={[styles.cardContent, { marginVertical: 5 }]}
                  >
                    • {n.text} <Text style={styles.noteDate}>{timeSince(n.date)} önce</Text>
                  </Text>
                )
              })
            ) : (
              <Text>Daha Not Eklemedin</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        hardwareAccelerated={true}
        transparent={true}
        visible={noteModal}
      >
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Not Ekle</Text>
            <TextInput
              multiline={true}
              style={styles.textInput}
              placeholder="Not..."
              value={noteModalText}
              onChangeText={setNoteModalText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'red' }]}
                onPress={() => {
                  setNoteModal(false)
                  setNoteModalText('')
                }}
              >
                <Text style={styles.modalButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNote}
                style={[styles.modalButton]}
              >
                <Text style={styles.modalButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f4f4f4',
  },
  topContainer: {
    backgroundColor: '#e7b468',
    padding: 10,
    marginBottom: 20,
  },
  cover: {
    height: 200,
    width: 150,
    alignSelf: 'center',
    borderRadius: 5,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    marginTop: 10,
  },
  author: {
    textAlign: 'center',
    color: 'black',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  infoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  infoTitle: {
    color: 'black',
  },
  infoValue: {
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    padding: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    marginBottom: 10,
  },
  buttons: {
    position: 'absolute',
    bottom: -30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  leftButton: {
    height: 50,
    backgroundColor: '#292637',
    justifyContent: 'center',
    width: 100,
    marginRight: 2.5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rightButton: {
    height: 50,
    backgroundColor: '#292637',
    justifyContent: 'center',
    width: 100,
    marginRight: 2.5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noteDate: {
    fontWeight: '300',
  },
  modal: {
    backgroundColor: 'rgba(1,1,1,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    alignSelf: 'center',
    borderRadius: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  textInput: {
    color: 'black',
    height: 200,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#292637',
  },
  modalButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
})
