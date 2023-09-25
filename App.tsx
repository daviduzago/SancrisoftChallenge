import React from 'react';
import axios from 'axios';
import {ANNOUNCEMENTS_QUERY, HERO_SLIDER_QUERY} from './src/queries';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {Slider, Story} from './src/screens';
import {
  Announcement,
  ImageOrVideo,
  Story as StoryType,
  StoryData,
} from './src/shared/types';
import {SLIDER_API_TOKEN, STORY_API_TOKEN} from '@env';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [announcementsData, setAnnouncementsData] = React.useState<
    Announcement[]
  >([]);
  const [heroSliderData, setHeroSliderData] = React.useState<StoryType[]>([]);

  const RETRY_LIMIT = 3;

  let retryCountFetchAnnouncements = 0;
  let retryCountFetchHeroSlider = 0;

  const fetchAnnouncements = async () => {
    axios
      .post(
        'https://graphql.contentful.com/content/v1/spaces/951t4k2za2uf/environments/master',
        {
          query: ANNOUNCEMENTS_QUERY,
        },
        {
          headers: {
            Authorization: `Bearer ${SLIDER_API_TOKEN}`,
          },
        },
      )
      .then(({data}) => {
        setAnnouncementsData(data.data.announcementCollection.items);
        retryCountFetchAnnouncements = 0;
      })
      .catch(err => {
        console.log(err.response ? err.response.data : err.message);

        if (retryCountFetchAnnouncements < RETRY_LIMIT) {
          retryCountFetchAnnouncements++;
          setTimeout(() => fetchAnnouncements(), 2000);
        } else {
          retryCountFetchAnnouncements = 0;
          Alert.alert(
            'Error',
            'There was an error fetching the announcements. Please check your internet connection and try again.',
          );
        }
      });
  };

  const fetchHeroSlider = async () => {
    axios
      .post(
        'https://graphql.contentful.com/content/v1/spaces/tyqyfq36jzv2/environments/master',
        {
          query: HERO_SLIDER_QUERY,
        },
        {
          headers: {
            Authorization: `Bearer ${STORY_API_TOKEN}`,
          },
        },
      )
      .then(({data}) => {
        const extractedData = extractStories(data.data.blockHomeHeroSlider);
        setHeroSliderData(extractedData);
        retryCountFetchHeroSlider = 0;
      })
      .catch(err => {
        console.log(err.response ? err.response.data : err.message);

        if (retryCountFetchHeroSlider < RETRY_LIMIT) {
          retryCountFetchHeroSlider++;
          setTimeout(() => fetchHeroSlider(), 2000);
        } else {
          retryCountFetchHeroSlider = 0;
          Alert.alert(
            'Error',
            'There was an error fetching the hero slider. Please check your internet connection and try again.',
          );
        }
      });
  };

  const extractStories = (data: StoryData): StoryType[] => {
    const stories: StoryType[] = [];

    const storyKeys = Object.keys(data).filter(key =>
      key.match(/slide\d+Title/),
    );

    storyKeys.forEach(key => {
      const storyNum = key.match(/\d+/)?.[0];

      if (storyNum) {
        3;
        const slide: StoryType = {
          title: data[`slide${storyNum}Title`] as string,
          eyebrowText: data[`slide${storyNum}EyebrowText`] as string,
          targetUrl: data[`slide${storyNum}TargetUrl`] as string,
          enableDarkBackdrop: data[
            `slide${storyNum}EnableDarkBackdrop`
          ] as boolean,
          eyebrowImage: data[`slide${storyNum}EyebrowImage`] as ImageOrVideo,
          mobileImageOrVideo: data[
            `slide${storyNum}MobileImageOrVideo`
          ] as ImageOrVideo,
        };

        if (slide.title) {
          stories.push(slide);
        }
      }
    });
    return stories;
  };

  React.useEffect(() => {
    setLoading(true);
    Promise.all([fetchAnnouncements(), fetchHeroSlider()])
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      {announcementsData.length !== 0 && <Slider items={announcementsData} />}
      <View style={styles.heroContainer}>
        <View style={styles.heroTopBar}>
          <Image
            source={require('./assets/pmg-logo.png')}
            style={styles.logo}
          />
          <FontAwesomeIcon icon={faBars} size={32} color="#fff" />
        </View>
        <Story items={heroSliderData} />
      </View>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  logo: {
    width: 120,
    resizeMode: 'contain',
  },
  heroContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  heroTopBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
});
