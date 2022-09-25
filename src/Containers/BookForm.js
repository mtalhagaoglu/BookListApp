import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import React, { useState, memo } from 'react'
import { Input } from '@/Components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Config } from '@/Config'
import { useDispatch } from 'react-redux'
import { addBook, editBook, setCategories } from '@/Store/Library'
import { useLibrary } from '@/Hooks'

import { launchImageLibrary } from 'react-native-image-picker'

const { STATUS } = Config

const Button = memo(({ id, title, active, onPress, middle }) => {
  return (
    <TouchableOpacity
      key={id}
      style={[
        styles.radioButton,
        active ? styles.radioButtonActive : {},
        { marginHorizontal: 5 },
      ]}
      onPress={onPress}
    >
      <Text style={styles.radioButtonText}>{title}</Text>
    </TouchableOpacity>
  )
})

export default function BookForm({ navigation, route }) {
  const dispatch = useDispatch()
  const { categories } = useLibrary()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category_id, setCategory_id] = useState(0)
  const [page, setPage] = useState(undefined)
  const [score, setScore] = useState(undefined)
  const [status_id, setStatus_id] = useState(0)
  const [about, setAbout] = useState('')
  const [progress, setProgress] = useState(0)
  const [cover_image, setCover_image] = useState('')
  const [start_date, setStart_date] = useState('')
  const [end_date, setEnd_date] = useState('')

  //Not Editable
  const [notes, setNotes] = useState([])
  const [id, setId] = useState(0)

  React.useEffect(() => {
    try {
      if (route?.params?.data) {
        const { data } = route.params
        setTitle(data.title)
        setAuthor(data.author)
        setCategory_id(data.category_id)
        setPage(data.page)
        setScore(data.score)
        setStatus_id(data.status_id)
        setAbout(data.about)
        setProgress(data.progress)
        setCover_image(data.cover_image)
        setStart_date(data.start_date)
        setEnd_date(data.end_date)
        setNotes(data.notes)
        setId(data.id)
      }
    } catch (error) {
      console.log('useEffect', error.message)
    }
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'https://res.cloudinary.com/drxffezfe/raw/upload/v1661977358/book-categories_qbktat.json',
        {
          method: 'GET',
        },
      )
      const data = await response.json()
      if (data?.data?.length) {
        dispatch(setCategories({ categories: data.data }))
      }
    } catch (error) {}
  }

  const handleBookStatus = id => {
    setStatus_id(id)
    switch (id) {
      case 0:
        setProgress(0)
        break
      case 2:
        setProgress(page)
      default:
        break
    }
  }

  const handleSave = () => {
    const book = {
      title,
      author,
      category_id,
      page,
      score,
      status_id,
      about,
      progress,
      cover_image:
        cover_image === ''
          ? `https://fakeimg.pl/150x200/?text=${title}`
          : cover_image,
      start_date,
      end_date,
    }
    if (title === '') {
      alert('title boş mu olur mk')
      return
    }
    if (id) {
      dispatch(
        editBook({
          book: {
            ...book,
            id,
            notes,
          },
        }),
      )
      navigation.navigate('Home')
      return
    }
    dispatch(
      addBook({
        book: {
          ...book,
          created_at: new Date().getTime(),
          id: `${Math.random().toString(16).slice(2)}`,
          notes: [],
        },
      }),
    )

    navigation.goBack()
  }

  const openGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
      })
      const { assets } = result
      setCover_image(`data:image/png;base64,${assets[0].base64}`)
    } catch (error) {
      console.log('no image', error.message)
    }
  }

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.page]}>
      <KeyboardAwareScrollView>
        <Input
          label="Kitap İsmi"
          placeholder="Yeraltından Notlar"
          value={title}
          handleChange={setTitle}
          style={{ flex: 1 }}
        />

        <Input
          label="Yazar Adı"
          placeholder="Fyodor Dostoevsky"
          value={author}
          handleChange={setAuthor}
        />
        <Input
          label="Ne Hakkında?"
          placeholder="Yeraltındaki notlar hakkında"
          multiline
          value={about}
          handleChange={setAbout}
        />
        <FlatList
          style={{ marginHorizontal: 15, marginVertical: 10 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <Button
              id={item.id}
              title={item.name}
              onPress={() => setCategory_id(item.id)}
              active={category_id === item.id}
              middle={item.id > 1 && item.id < categories.length}
            />
          )}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Input
            label="Sayfa Sayısı"
            placeholder={0}
            value={page}
            handleChange={setPage}
            style={{ flex: 1, marginRight: 0 }}
            keyboardType="decimal-pad"
          />
          <Input
            label="Okunan Sayfa Sayısı"
            placeholder={0}
            value={progress}
            handleChange={setProgress}
            style={{ flex: 1, marginLeft: 0 }}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.radioButtonContainer}>
          {STATUS.map(s => (
            <Button
              id={s.id}
              title={s.title}
              onPress={() => handleBookStatus(s.id)}
              active={s.id === status_id}
              middle={s.id > 0 && s.id + 1 < STATUS.length}
            />
          ))}
        </View>
        {status_id ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <Input
              label="Başlama Tarihi"
              placeholder={0}
              value={start_date}
              handleChange={setStart_date}
              style={{ flex: 1, marginRight: status_id == 1 ? null : 0 }}
            />
            {status_id === 2 && (
              <Input
                label="Bitirme Tarihi"
                placeholder={0}
                value={end_date}
                handleChange={setEnd_date}
                style={{ flex: 1, marginLeft: 0 }}
              />
            )}
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={openGallery}
            style={[styles.addButton, { backgroundColor: '#7d74a9' }]}
          >
            <Text style={styles.addButtonText}>{`Kapak Fotoğrafı ${
              cover_image ? 'Düzenle' : 'Ekle'
            }`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.addButton}>
            <Text style={styles.addButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {},
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  radioButton: {
    padding: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  radioButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  radioButtonActive: {
    backgroundColor: '#e7b468',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#292637',
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
})
