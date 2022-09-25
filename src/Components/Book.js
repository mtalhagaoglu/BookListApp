import React, { useState, memo } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Share,
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
import { removeBook, addFavori, removeFavori } from '@/Store/Library'
import Option from '@/Assets/Images/option.svg'
import { useLibrary } from '@/Hooks'

export default Book = memo(params => {
  const dispatch = useDispatch()
  const { favorites, categories } = useLibrary()
  const {
    id,
    title,
    author,
    page,
    category_id,
    score,
    status_id,
    note,
    about,
    progress,
    cover_image,
  } = params

  const [bookmark, setBookmark] = useState(favorites.includes(id))
  const progress_percentage = parseInt((progress / page) * 100)

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Bu kitabı okudun mu?\n\n${title}\nYazar: ${author}\nKategori: ${
          categories.find(a => a.id === category_id).name
        }\n\nKonusu:\n${about}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

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
          <Text style={styles.author}>
            {author} | {categories.find(a => a.id === category_id).name}
          </Text>
          <Menu>
            <MenuTrigger>
              <Option width={20} />
            </MenuTrigger>

            <MenuOptions>
              <MenuOption
                onSelect={() => navigate('BookForm', { data: params })}
                text="Düzenle"
              />
              <MenuOption onSelect={handleShare} text="Paylaş" />
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
          <TouchableOpacity
            onPress={() => {
              if (bookmark) {
                dispatch(removeFavori({ bookId: id }))
              } else {
                dispatch(addFavori({ bookId: id }))
              }
              setBookmark(s => !bookmark)
            }}
          >
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
