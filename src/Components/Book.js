import React, { useState, memo } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import Bookmark from '../Assets/Images/bookmark.svg'
import { useDispatch } from 'react-redux'
import { navigate } from '@/Navigators/utils'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import { removeBook } from '@/Store/Library'

export default Book = memo(params => {
  const dispatch = useDispatch()

  const {
    title,
    author,
    page,
    category_id,
    score,
    status_id,
    note,
    description,
    progress,
    cover_image,
  } = params
  const [bookmark, setBookmark] = useState(false)
  const progress_percentage = parseInt((progress / page) * 100)

  return (
    <Pressable
      onPress={() => navigate('BookDetails', { data: params })}
      style={styles.component}
    >
      <Image
        source={{ uri: cover_image }}
        style={styles.cover}
        resizeMode="cover"
        resizeMethod="scale"
      />
      <View style={styles.details}>
        <View style={styles.bottomDetails}>
          <Text style={styles.author}>{author}</Text>
          <Menu>
            <MenuTrigger text=" ••• " />

            <MenuOptions>
              <MenuOption
                onSelect={() => navigate('BookForm', { data: params })}
                text="Düzenle"
              />
              <MenuOption text="Paylaş" />
              <MenuOption
                onSelect={() => dispatch(removeBook({ bookId: params.id }))}
                text="Kaldır"
              />
            </MenuOptions>
          </Menu>
        </View>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.bottomDetails}>
          <Text style={styles.progress}>{progress_percentage}%</Text>
          <TouchableOpacity onPress={() => setBookmark(s => !s)}>
            <Bookmark fill={bookmark ? '#e7b468' : '#c1c1c2'} width={25} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  component: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    margin: 5,
  },
  cover: {
    height: 20 * 5,
    width: 15 * 5,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    paddingLeft: 20,
  },
  author: {
    color: '#c5c5c5',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  progress: {
    color: '#c1c1c2',
    fontWeight: 'bold',
  },
  bottomDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
