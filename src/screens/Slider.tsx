import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {Announcement, SliderProps} from '../shared/types';

interface ChevronProps {
  icon: IconDefinition;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const ITEM_WIDTH = Dimensions.get('window').width;

export const Slider = ({items}: SliderProps) => {
  const [flatlistHeight, setFlatlistHeight] = React.useState<number>(0);
  const [chevronBoxWidth, setChevronBoxWidth] = React.useState<number>(0);
  const [scrollOffset, setScrollOffset] = React.useState<number>(0);
  const sliderRef = React.useRef<FlatList<Announcement>>(null);

  const extendedData = React.useMemo(
    () => new Array(20).fill(items).flat(),
    [items],
  );

  const handlePress = async (url: string) => {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Oops! We can't go there now.`);
      }
    }
  };

  const renderSliderItem = ({item}: {item: Announcement}) => {
    return (
      <Pressable
        onPress={() => handlePress(item?.ctaUrl)}
        style={[
          styles.container,
          {
            backgroundColor: item?.backgroundColor || '#000',
            paddingHorizontal: chevronBoxWidth + 12,
          },
        ]}>
        <Text style={styles.text}>{item?.message}</Text>
        <Text
          style={[
            styles.text,
            {textDecorationLine: 'underline', textTransform: 'capitalize'},
          ]}>
          {item?.ctaLabel}
        </Text>
      </Pressable>
    );
  };

  const Chevron = ({icon, style, onPress, onLayout}: ChevronProps) => {
    return (
      <Pressable style={style} onPress={onPress} onLayout={onLayout}>
        <FontAwesomeIcon
          icon={icon}
          size={32}
          color="#fff"
          style={{top: flatlistHeight / 2 - 16}}
        />
      </Pressable>
    );
  };

  const handleChevronPress = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const newOffset =
        direction === 'left'
          ? scrollOffset - ITEM_WIDTH
          : scrollOffset + ITEM_WIDTH;

      sliderRef.current.scrollToOffset({
        offset: newOffset,
        animated: true,
      });
    }
  };

  const handleLeftPress = () => handleChevronPress('left');
  const handleRightPress = () => handleChevronPress('right');

  return (
    <View style={styles.emptyView}>
      <FlatList
        ref={sliderRef}
        onLayout={event => {
          setFlatlistHeight(event.nativeEvent.layout.height);
        }}
        initialScrollIndex={Math.floor(extendedData?.length / 2)}
        data={extendedData}
        onScroll={event => {
          setScrollOffset(event.nativeEvent.contentOffset.x);
        }}
        renderItem={renderSliderItem}
        keyExtractor={(item, index) => `${item.ctaLabel}-${index}`}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        snapToInterval={Dimensions.get('window').width}
        snapToAlignment="start"
        scrollEventThrottle={16}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
      {flatlistHeight && items.length > 1 ? (
        <>
          <Chevron
            icon={faChevronLeft}
            style={styles.leftChevron}
            onPress={handleLeftPress}
            onLayout={event => {
              setChevronBoxWidth(event.nativeEvent.layout.width);
            }}
          />
          <Chevron
            icon={faChevronRight}
            style={styles.rightChevron}
            onPress={handleRightPress}
          />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyView: {
    minHeight: 100,
    backgroundColor: '#e2e2e2',
  },
  container: {
    width: ITEM_WIDTH,
    paddingVertical: 16,
    rowGap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Kanit Regular',
  },
  leftChevron: {
    height: '100%',
    paddingLeft: 16,
    position: 'absolute',
    left: 0,
  },
  rightChevron: {
    height: '100%',
    paddingRight: 16,
    position: 'absolute',
    right: 0,
  },
});
