import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {StoryProps} from '../shared/types';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import Video from 'react-native-video';
import SvgOrImage from '../components/SvgOrImage';

const WIDTH = Dimensions.get('window').width;

export const Story = ({items}: StoryProps) => {
  if (!items || items.length === 0) return null;

  const storyFlatListRef = React.useRef<FlatList>(null);
  const [progresses, setProgresses] = React.useState<number[]>(
    Array(items.length).fill(0),
  );
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const handleOnPressNext = React.useCallback(() => {
    const nextIndex = (activeIndex + 1) % items.length;
    setProgresses(prevProgresses => {
      const newProgresses = [...prevProgresses];
      newProgresses[activeIndex] = 100;

      if (nextIndex === 0) {
        return Array(items.length).fill(0);
      }
      return newProgresses;
    });
    storyFlatListRef.current?.scrollToIndex({index: nextIndex});
    setActiveIndex(nextIndex);
  }, [activeIndex, items.length]);

  const ProgressBars = React.memo(({progresses}: {progresses: number[]}) => {
    return (
      <View style={styles.progressBarsContainer}>
        {progresses.map((progress, index) => (
          <View key={index} style={styles.outerProgressBar}>
            <View style={[styles.innerProgressBar, {width: `${progress}%`}]} />
          </View>
        ))}
      </View>
    );
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgresses(prevProgresses => {
        const newProgresses = [...prevProgresses];
        newProgresses[activeIndex] = Math.min(
          newProgresses[activeIndex] + 1,
          100,
        );

        // Once the progress reaches 100, move to the next item
        if (newProgresses[activeIndex] === 100) {
          const nextIndex = (activeIndex + 1) % items.length;
          storyFlatListRef.current?.scrollToIndex({index: nextIndex});
          setActiveIndex(nextIndex);

          // if we've reached the end, reset all the progresses
          if (nextIndex === 0) {
            return Array(items.length).fill(0);
          }
        }

        return newProgresses;
      });
    }, 100);

    // Clear interval on unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, [activeIndex, items.length]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={storyFlatListRef}
        data={items}
        keyExtractor={item => item.mobileImageOrVideo.url}
        renderItem={({item, index}) => (
          <Video
            key={item.mobileImageOrVideo.url}
            source={{uri: item.mobileImageOrVideo.url}}
            style={styles.video}
            resizeMode="cover"
            muted={true}
            paused={index !== activeIndex}
            repeat={true}
            rate={1.0}
          />
        )}
        style={{flex: 1}}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />
      <View style={styles.body}>
        <View style={styles.body1}>
          <View style={styles.bodyInfo}>
            <SvgOrImage item={items[activeIndex].eyebrowImage} style={styles.storyLogo} />
            <Text style={styles.title}>{items[activeIndex].title}</Text>
          </View>
          <Pressable onPress={handleOnPressNext} style={styles.chevron}>
            <FontAwesomeIcon icon={faChevronRight} size={60} color="#fff" />
          </Pressable>
        </View>
        <ProgressBars progresses={progresses} />
      </View>
      {items[activeIndex].enableDarkBackdrop && (
        <View style={styles.overlay}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
    width: WIDTH,
    height: '100%',
  },
  chevron: {
    width: 60,
    height: 120,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    fontFamily: 'Kanit Bold',
  },
  storyLogo: {
    resizeMode: 'contain',
    width: 200,
    height: 80,
  },
  body: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    zIndex: 10,
  },
  bodyInfo: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  body1: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 50,
  },
  progressBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  outerProgressBar: {
    flex: 1,
    height: 5,
    backgroundColor: 'gray',
    marginHorizontal: 2,
  },
  innerProgressBar: {
    height: '100%',
    backgroundColor: 'white',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: 5,
  },
});
